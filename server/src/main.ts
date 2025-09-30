import { NETWORK, PEER_PATH, SOCKET_PATH } from "@shared/constants.ts";
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
import { PeerServer } from "peer";
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

//=== PEERJS ===//

const _peerServer = PeerServer({
  port: NETWORK.PEER_PORT,
  path: PEER_PATH,
});

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
  path: SOCKET_PATH,
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
  (socket: Socket) => async (opts: { roomId: Room["id"] }) => {
    const { roomId } = opts;

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
      message: {
        id: generateMessageId(),
        from: "server",
        to: roomId,
        content: `${updatedUserData.username} left`,
      },
    });
    ioServer.emit("users/refresh", { users: createUsersDataPayload() });
    ioServer.emit("rooms/refresh", { rooms: createRoomsPayload() });
    ioServer.in(roomId).emit("rooms/users/refresh", {
      users: createRoomUsersDataPayload(roomId),
    });
    ioServer.in(roomId).emit("room/refresh", { room });

    console.log(LOG_MESSAGES.USER_LEFT(updatedUserData.username, room.name));
  };

ioServer.on("connection", socket => {
  socket.on("user/login", async ({ username }) => {
    const userData: UserData = {
      username,
      roomSummary: null,
      socketId: socket.id,
      peerId: null,
    };

    userDataToSocketBDM.set(userData, socket);
    usernameToUserData.set(username, userData);
    socketIdToSocket.set(socket.id, socket);

    const loweredUsername = username.toLowerCase();

    connectedUsersSet.add(loweredUsername);

    await socket.join(socket.id);

    ioServer.emit("users/refresh", { users: createUsersDataPayload() });

    console.log(LOG_MESSAGES.SOCKET_CONNECT(socket.id, username));
  });

  socket.on("peer/open", ({ peerId }) => {
    const userData = userDataToSocketBDM.getByValue(socket);

    if (!userData) return;

    const newUserData: UserData = { ...userData, peerId };

    updateConnectedUsersMap(newUserData, socket);
  });

  socket.on("users/fetch", ({ usernames }, sendUsers) => {
    const response = { users: createUsersDataPayload(usernames) };

    sendUsers(response);
  });

  socket.on("rooms/fetch", ({ roomIds }, sendRooms) => {
    const response = { rooms: createRoomsPayload(roomIds) };

    sendRooms(response);
  });

  socket.on("rooms/users/fetch", ({ roomId }, sendUsers) => {
    const response = { users: createRoomUsersDataPayload(roomId) };

    sendUsers(response);
  });

  socket.on("room/messages/fetch", ({ roomId }, sendMessages) => {
    // handle undefined values
    const messages = roomIdToMessages.get(roomId)!;

    const response = { messages };

    sendMessages(response);
  });

  socket.on("room/add", ({ roomFormData }, sendRoomId) => {
    const { name, size } = roomFormData;

    const roomId = generateRoomId();

    const room: Room = {
      id: roomId,
      name,
      size,
      connectedUsers: [],
    };

    roomsMap.set(roomId, room);

    roomIdToMessages.set(roomId, []);

    sendRoomId({ roomId });

    ioServer.emit("rooms/refresh", { rooms: createRoomsPayload() });

    console.log(LOG_MESSAGES.ROOM_CREATED(name));
  });

  socket.on("room/join", async ({ roomId }) => {
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
      message: {
        id: generateMessageId(),
        from: "server",
        to: roomId,
        content: `${userData.username} joined`,
      },
    });
    // --- we could merge these 2 events
    ioServer.in(roomId).emit("rooms/users/refresh", {
      users: createRoomUsersDataPayload(roomId),
    });
    ioServer.in(roomId).emit("room/refresh", { room });
    // ---
    socket.broadcast.emit("users/refresh", { users: createUsersDataPayload() });
    socket.broadcast.emit("rooms/refresh", { rooms: createRoomsPayload() });

    console.log(LOG_MESSAGES.USER_JOINED(userData.username, room.name));
  });

  socket.on("room/leave", makeHandleSocketLeavingRoom(socket));

  socket.on("message/send", ({ message }) => {
    const { to: roomId } = message;

    // handle undefined values
    const prevMessages = roomIdToMessages.get(roomId)!;

    prevMessages.push(message);

    const newMessages = [...prevMessages];

    roomIdToMessages.set(roomId, newMessages);

    ioServer.in(roomId).emit("room/message/send", { message });
  });

  socket.on("disconnect", async reason => {
    const user = userDataToSocketBDM.getByValue(socket);

    if (!user) return;

    const { username } = user;

    const loweredUsername = username.toLowerCase();

    if (user.roomSummary) {
      await makeHandleSocketLeavingRoom(socket)({
        roomId: user.roomSummary.id,
      });
    }

    connectedUsersSet.delete(loweredUsername);
    userDataToSocketBDM.deleteByValue(socket);
    usernameToUserData.delete(user.username);
    socketIdToSocket.delete(socket.id);

    socket.broadcast.emit("users/refresh", { users: createUsersDataPayload() });

    console.log(
      LOG_MESSAGES.SOCKET_DISCONNECT(socket.id, user.username, reason),
    );
  });
});

//=================//

httpServer.listen(NETWORK.SERVER_PORT, "0.0.0.0", () => {
  console.log(`Server running at ${NETWORK.SERVER_URL}`);
});
