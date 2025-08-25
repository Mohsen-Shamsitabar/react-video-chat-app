import { NETWORK, SOCKET_CHANNEL_NAMES } from "@shared/constants.ts";
import { type NewRoomFormSchema } from "@shared/new-room-form-schema.ts";
import { type Room, type UserData } from "@shared/types.ts";
import { generateRoomId, generateUserId } from "@shared/utils.ts";
import cors from "cors";
import express from "express";
import http from "http";
import { Server as IoServer, type Socket } from "socket.io";
import { LOG_MESSAGES } from "./constants.ts";
import roomsMap from "./database/rooms.ts";
import {
  connectedUsersMap,
  connectedUsersSet,
  updateConnectedUsersMap,
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

const ioServer = new IoServer(httpServer, {
  cors: {
    origin: "*",
  },
});

const createUsersDataPayload = () => {
  return Array.from(connectedUsersMap.keys()).sort(
    (user1, user2) =>
      user1.username.charCodeAt(0) - user2.username.charCodeAt(0),
  );
};

const createRoomsPayload = () => {
  return Array.from(roomsMap.values()).sort(
    (room1, room2) => room1.name.charCodeAt(0) - room2.name.charCodeAt(0),
  );
};

const makeHandleSocketLeavingRoom =
  (socket: Socket) => async (roomId: Room["id"]) => {
    const userData = connectedUsersMap.getByValue(socket);

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

    ioServer.emit(SOCKET_CHANNEL_NAMES.USERS_REFRESH, createUsersDataPayload());
    ioServer.emit(SOCKET_CHANNEL_NAMES.ROOMS_REFRESH, createRoomsPayload());

    console.log(LOG_MESSAGES.USER_LEFT(userData.username, room.name));
  };

ioServer.on("connection", socket => {
  socket.on(
    SOCKET_CHANNEL_NAMES.USER_LOGIN,
    async (username: UserData["username"]) => {
      const userId = generateUserId();

      const userData: UserData = {
        id: userId,
        username,
        roomSummary: null,
      };

      connectedUsersMap.set(userData, socket);

      const loweredUsername = username.toLowerCase();

      connectedUsersSet.add(loweredUsername);

      await socket.join(socket.id);

      ioServer.emit(
        SOCKET_CHANNEL_NAMES.USERS_REFRESH,
        createUsersDataPayload(),
      );

      console.log(LOG_MESSAGES.SOCKET_CONNECT(socket.id, userId));
    },
  );

  socket.on(SOCKET_CHANNEL_NAMES.USERS_FETCH, () => {
    ioServer
      .in(socket.id)
      .emit(SOCKET_CHANNEL_NAMES.USERS_REFRESH, createUsersDataPayload());
  });

  socket.on(SOCKET_CHANNEL_NAMES.ROOMS_FETCH, () => {
    ioServer
      .in(socket.id)
      .emit(SOCKET_CHANNEL_NAMES.ROOMS_REFRESH, createRoomsPayload());
  });

  socket.on(SOCKET_CHANNEL_NAMES.ROOM_FETCH, (roomId: Room["id"]) => {
    const room = roomsMap.get(roomId) ?? null;

    // ROOM MIGHT NOT EXIST!

    ioServer.in(socket.id).emit(SOCKET_CHANNEL_NAMES.ROOM_REFRESH, room);
  });

  socket.on(
    SOCKET_CHANNEL_NAMES.ROOM_ADD,
    (roomData: NewRoomFormSchema, sendAck: (roomId: Room["id"]) => void) => {
      const { name, size } = roomData;

      const roomId = generateRoomId();

      const room: Room = {
        id: roomId,
        name,
        size,
        connectedUsers: [],
      };

      roomsMap.set(roomId, room);

      sendAck(roomId);

      ioServer.emit(SOCKET_CHANNEL_NAMES.ROOMS_REFRESH, createRoomsPayload());

      console.log(LOG_MESSAGES.ROOM_CREATED(name));
    },
  );

  socket.on(SOCKET_CHANNEL_NAMES.ROOM_JOIN, async (roomId: Room["id"]) => {
    const userData = connectedUsersMap.getByValue(socket);

    if (!userData) return;

    const room = roomsMap.get(roomId);

    if (!room) return;

    await socket.join(roomId);

    userData.roomSummary = {
      id: room.id,
      name: room.name,
    };

    room.connectedUsers.push(userData.id);

    socket.broadcast.emit(
      SOCKET_CHANNEL_NAMES.USERS_REFRESH,
      createUsersDataPayload(),
    );

    socket.broadcast.emit(
      SOCKET_CHANNEL_NAMES.ROOMS_REFRESH,
      createRoomsPayload(),
    );

    console.log(LOG_MESSAGES.USER_JOINED(userData.username, room.name));
  });

  socket.on(
    SOCKET_CHANNEL_NAMES.ROOM_LEAVE,
    makeHandleSocketLeavingRoom(socket),
  );

  socket.on("disconnect", async reason => {
    const user = connectedUsersMap.getByValue(socket);

    if (!user) return;

    const { username } = user;

    const loweredUsername = username.toLowerCase();

    if (user.roomSummary) {
      await makeHandleSocketLeavingRoom(socket)(user.roomSummary.id);
    }

    connectedUsersSet.delete(loweredUsername);
    connectedUsersMap.deleteByValue(socket);

    socket.broadcast.emit(
      SOCKET_CHANNEL_NAMES.USERS_REFRESH,
      createUsersDataPayload(),
    );

    console.log(LOG_MESSAGES.SOCKET_DISCONNECT(socket.id, user.id, reason));
  });
});

//=================//

httpServer.listen(NETWORK.SERVER_PORT, () => {
  console.log(`Server running at ${NETWORK.SERVER_URL}`);
});
