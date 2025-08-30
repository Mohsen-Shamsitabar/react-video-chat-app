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
import { generateRoomId, generateUserId } from "@shared/utils.ts";
import cors from "cors";
import express from "express";
import http from "http";
import { Server as IoServer, type Socket } from "socket.io";
import { LOG_MESSAGES } from "./constants.ts";
import roomsMap from "./database/rooms.ts";
import {
  connectedUsersSet,
  socketIdToSocket,
  updateConnectedUsersMap,
  userIdToUser,
  userToSocketBDM,
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

const createUsersDataPayload = (userIds?: UserData["id"][]): UserData[] => {
  if (!userIds) {
    return Array.from(userToSocketBDM.keys()).sort(
      (user1, user2) =>
        user1.username.charCodeAt(0) - user2.username.charCodeAt(0),
    );
  }

  // handle undefined values.
  const result = userIds
    .map(userId => userIdToUser.get(userId)!)
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

  // handle undefined values.
  const allConnectedSocketIds = allRooms.get(roomId)!;

  // handle undefined values.
  const allConnectedSockets = Array.from(allConnectedSocketIds.keys()).map(
    socketId => socketIdToSocket.get(socketId)!,
  );

  const allConnectedUsers = allConnectedSockets
    .map(socket => userToSocketBDM.getByValue(socket)!)
    .sort(
      (user1, user2) =>
        user1.username.charCodeAt(0) - user2.username.charCodeAt(0),
    );

  return allConnectedUsers;
};

const makeHandleSocketLeavingRoom =
  (socket: Socket) => async (roomId: Room["id"]) => {
    const userData = userToSocketBDM.getByValue(socket);

    if (!userData) return;

    const room = roomsMap.get(roomId);

    if (!room) return;

    await socket.leave(roomId);

    const updatedUserData: UserData = { ...userData, roomSummary: null };

    updateConnectedUsersMap(updatedUserData, socket);

    const updatedRoomUsers = room.connectedUsers.filter(
      userId => userId !== userData.id,
    );

    room.connectedUsers = updatedRoomUsers;

    if (room.connectedUsers.length <= 0) {
      roomsMap.delete(room.id);
    }

    ioServer.emit("users/refresh", createUsersDataPayload());
    ioServer.emit("rooms/refresh", createRoomsPayload());
    ioServer
      .in(roomId)
      .emit("rooms/users/refresh", createRoomUsersDataPayload(roomId));

    console.log(LOG_MESSAGES.USER_LEFT(userData.username, room.name));
  };

ioServer.on("connection", socket => {
  socket.on("user/login", async (username: UserData["username"]) => {
    const userId = generateUserId();

    const userData: UserData = {
      id: userId,
      username,
      roomSummary: null,
    };

    userToSocketBDM.set(userData, socket);
    userIdToUser.set(userId, userData);
    socketIdToSocket.set(socket.id, socket);

    const loweredUsername = username.toLowerCase();

    connectedUsersSet.add(loweredUsername);

    await socket.join(socket.id);

    ioServer.emit("users/refresh", createUsersDataPayload());

    console.log(LOG_MESSAGES.SOCKET_CONNECT(socket.id, userId));
  });

  socket.on("users/fetch", (userIds, sendUsers) => {
    sendUsers(createUsersDataPayload(userIds));
  });

  socket.on("rooms/fetch", (roomIds, sendRooms) => {
    sendRooms(createRoomsPayload(roomIds));
  });

  socket.on("rooms/users/fetch", (roomId, sendUsers) => {
    sendUsers(createRoomUsersDataPayload(roomId));
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

      sendRoomId(roomId);

      ioServer.emit("rooms/refresh", createRoomsPayload());

      console.log(LOG_MESSAGES.ROOM_CREATED(name));
    },
  );

  socket.on("room/join", async (roomId: Room["id"]) => {
    const userData = userToSocketBDM.getByValue(socket);

    if (!userData) return;

    const room = roomsMap.get(roomId);

    if (!room) return;

    await socket.join(roomId);

    userData.roomSummary = {
      id: room.id,
      name: room.name,
    };

    room.connectedUsers.push(userData.id);

    ioServer
      .in(roomId)
      .emit("rooms/users/refresh", createRoomUsersDataPayload(roomId));
    socket.broadcast.emit("users/refresh", createUsersDataPayload());
    socket.broadcast.emit("rooms/refresh", createRoomsPayload());

    console.log(LOG_MESSAGES.USER_JOINED(userData.username, room.name));
  });

  socket.on("room/leave", makeHandleSocketLeavingRoom(socket));

  socket.on("disconnect", async reason => {
    const user = userToSocketBDM.getByValue(socket);

    if (!user) return;

    const { username } = user;

    const loweredUsername = username.toLowerCase();

    if (user.roomSummary) {
      await makeHandleSocketLeavingRoom(socket)(user.roomSummary.id);
    }

    connectedUsersSet.delete(loweredUsername);
    userToSocketBDM.deleteByValue(socket);
    userIdToUser.delete(user.id);
    socketIdToSocket.delete(socket.id);

    socket.broadcast.emit("users/refresh", createUsersDataPayload());

    console.log(LOG_MESSAGES.SOCKET_DISCONNECT(socket.id, user.id, reason));
  });
});

//=================//

httpServer.listen(NETWORK.SERVER_PORT, () => {
  console.log(`Server running at ${NETWORK.SERVER_URL}`);
});
