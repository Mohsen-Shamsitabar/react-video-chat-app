import { NETWORK } from "@shared/constants.ts";
import { type NewRoomFormSchema } from "@shared/new-room-form-schema.ts";
import {
  type ClientToServerEvents,
  type InterServerEvents,
  type Room,
  type ServerToClientEvents,
  type SocketData,
  type UserData,
} from "@shared/types.ts";
import { generateMessageId, generateRoomId } from "@shared/utils.ts";
import cors from "cors";
import express from "express";
import http from "http";
import { Server as IoServer, type Socket } from "socket.io";
import { LOG_MESSAGES } from "./constants.ts";
import { roomIdToMessages } from "./database/messages.ts";
import roomsMap from "./database/rooms.ts";
import {
  connectedUsersSet,
  socketIdToSocket,
  updateConnectedUsersMap,
  userDataToSocketBDM,
  usernameToUserData,
} from "./database/users.ts";
import { registerAddRoomRoute, registerLoginRoute } from "./routes/post.ts";

const expressApp = express();

expressApp.use(express.json(), cors());

//=== ROUTES ===//

registerLoginRoute(expressApp);
registerAddRoomRoute(expressApp);

//==============//

const httpServer = http.createServer(expressApp);

//=== SOCKET.IO ===//

const ioServer = new IoServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "*",
  },
});

const createUsersDataPayload = (
  usernames?: UserData["username"][],
): UserData[] => {
  if (!usernames) {
    return Array.from(userDataToSocketBDM.keys()).sort(
      (user1, user2) =>
        user1.username.charCodeAt(0) - user2.username.charCodeAt(0),
    );
  }

  // handle undefined values.
  const result = usernames
    .map(username => usernameToUserData.get(username)!)
    .sort(
      (user1, user2) =>
        user1.username.charCodeAt(0) - user2.username.charCodeAt(0),
    );

  return result;
};

const createRoomsPayload = (roomIds?: Room["id"][]): Room[] => {
  if (!roomIds) {
    return Array.from(roomsMap.values()).sort(
      (room1, room2) => room1.name.charCodeAt(0) - room2.name.charCodeAt(0),
    );
  }

  // handle undefined values.
  const result = roomIds
    .map(roomId => roomsMap.get(roomId)!)
    .sort(
      (room1, room2) => room1.name.charCodeAt(0) - room2.name.charCodeAt(0),
    );

  return result;
};

const createRoomUsersDataPayload = (roomId: Room["id"]) => {
  const allRooms = ioServer.of("/").adapter.rooms;

  const allConnectedSocketIds = allRooms.get(roomId);

  if (!allConnectedSocketIds) return [];

  // handle undefined values.
  const allConnectedSockets = Array.from(allConnectedSocketIds.keys()).map(
    socketId => socketIdToSocket.get(socketId)!,
  );

  const allConnectedUsers = allConnectedSockets
    .map(socket => userDataToSocketBDM.getByValue(socket)!)
    .sort(
      (user1, user2) =>
        user1.username.charCodeAt(0) - user2.username.charCodeAt(0),
    );

  return allConnectedUsers;
};

const makeHandleSocketLeavingRoom =
  (socket: Socket) => async (roomId: Room["id"]) => {
    const userData = userDataToSocketBDM.getByValue(socket);

    if (!userData) return;

    const room = roomsMap.get(roomId);

    if (!room) return;

    await socket.leave(roomId);

    const updatedUserData: UserData = { ...userData, roomSummary: null };

    updateConnectedUsersMap(updatedUserData, socket);

    const updatedRoomUsers = room.connectedUsers.filter(
      username => username !== userData.username,
    );

    room.connectedUsers = updatedRoomUsers;

    if (room.connectedUsers.length <= 0) {
      roomsMap.delete(room.id);
      roomIdToMessages.delete(room.id);
    }

    ioServer.in(roomId).emit("room/message/send", {
      id: generateMessageId(),
      from: "server",
      to: roomId,
      content: `${updatedUserData.username} left`,
    });
    ioServer.emit("users/refresh", createUsersDataPayload());
    ioServer.emit("rooms/refresh", createRoomsPayload());
    ioServer
      .in(roomId)
      .emit("rooms/users/refresh", createRoomUsersDataPayload(roomId));

    console.log(LOG_MESSAGES.USER_LEFT(updatedUserData.username, room.name));
  };

ioServer.on("connection", socket => {
  socket.on("user/login", async (username: UserData["username"]) => {
    const userData: UserData = {
      username,
      roomSummary: null,
    };

    userDataToSocketBDM.set(userData, socket);
    usernameToUserData.set(username, userData);
    socketIdToSocket.set(socket.id, socket);

    const loweredUsername = username.toLowerCase();

    connectedUsersSet.add(loweredUsername);

    await socket.join(socket.id);

    ioServer.emit("users/refresh", createUsersDataPayload());

    console.log(LOG_MESSAGES.SOCKET_CONNECT(socket.id, username));
  });

  socket.on("users/fetch", (usernames, sendUsers) => {
    sendUsers(createUsersDataPayload(usernames));
  });

  socket.on("rooms/fetch", (roomIds, sendRooms) => {
    sendRooms(createRoomsPayload(roomIds));
  });

  socket.on("rooms/users/fetch", (roomId, sendUsers) => {
    sendUsers(createRoomUsersDataPayload(roomId));
  });

  socket.on("room/messages/fetch", (roomId, sendMessages) => {
    // handle undefined values
    const messages = roomIdToMessages.get(roomId)!;

    sendMessages(messages);
  });

  socket.on(
    "room/add",
    (roomData: NewRoomFormSchema, sendRoomId: (roomId: Room["id"]) => void) => {
      const { name, size } = roomData;

      const roomId = generateRoomId();

      const room: Room = {
        id: roomId,
        name,
        size,
        connectedUsers: [],
      };

      roomsMap.set(roomId, room);

      roomIdToMessages.set(roomId, []);

      sendRoomId(roomId);

      ioServer.emit("rooms/refresh", createRoomsPayload());

      console.log(LOG_MESSAGES.ROOM_CREATED(name));
    },
  );

  socket.on("room/join", async (roomId: Room["id"]) => {
    const userData = userDataToSocketBDM.getByValue(socket);

    if (!userData) return;

    const room = roomsMap.get(roomId);

    if (!room) return;

    await socket.join(roomId);

    userData.roomSummary = {
      id: room.id,
      name: room.name,
    };

    room.connectedUsers.push(userData.username);

    ioServer.in(roomId).emit("room/message/send", {
      id: generateMessageId(),
      from: "server",
      to: roomId,
      content: `${userData.username} joined`,
    });
    ioServer
      .in(roomId)
      .emit("rooms/users/refresh", createRoomUsersDataPayload(roomId));
    socket.broadcast.emit("users/refresh", createUsersDataPayload());
    socket.broadcast.emit("rooms/refresh", createRoomsPayload());

    console.log(LOG_MESSAGES.USER_JOINED(userData.username, room.name));
  });

  socket.on("room/leave", makeHandleSocketLeavingRoom(socket));

  socket.on("message/send", message => {
    const { to: roomId } = message;

    // handle undefined values
    const prevMessages = roomIdToMessages.get(roomId)!;

    prevMessages.push(message);

    const newMessages = [...prevMessages];

    roomIdToMessages.set(roomId, newMessages);

    ioServer.in(roomId).emit("room/message/send", message);
  });

  socket.on("disconnect", async reason => {
    const user = userDataToSocketBDM.getByValue(socket);

    if (!user) return;

    const { username } = user;

    const loweredUsername = username.toLowerCase();

    if (user.roomSummary) {
      await makeHandleSocketLeavingRoom(socket)(user.roomSummary.id);
    }

    connectedUsersSet.delete(loweredUsername);
    userDataToSocketBDM.deleteByValue(socket);
    usernameToUserData.delete(user.username);
    socketIdToSocket.delete(socket.id);

    socket.broadcast.emit("users/refresh", createUsersDataPayload());

    console.log(
      LOG_MESSAGES.SOCKET_DISCONNECT(socket.id, user.username, reason),
    );
  });
});

//=================//

httpServer.listen(NETWORK.SERVER_PORT, () => {
  console.log(`Server running at ${NETWORK.SERVER_URL}`);
});
