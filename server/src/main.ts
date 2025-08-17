import { NETWORK, SOCKET_CHANNEL_NAMES } from "@shared/constants.ts";
import { type NewRoomFormSchema } from "@shared/new-room-form-schema.ts";
import {
  type LoginChannelData,
  type Room,
  type UserData,
} from "@shared/types.ts";
import { generateRoomId, generateUserId } from "@shared/utils.ts";
import cors from "cors";
import express from "express";
import http from "http";
import { Server as IoServer, type Socket } from "socket.io";
import { LOG_MESSAGES } from "./constants.ts";
import roomsMap from "./database/rooms.ts";
import { connectedUsersMap, connectedUsersSet } from "./database/users.ts";
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

const makeHandleSocketLeavingRoom =
  (socket: Socket) => async (roomId: Room["id"]) => {
    const userData = connectedUsersMap.getByValue(socket);

    if (!userData) return;

    const room = roomsMap.get(roomId);

    if (!room) return;

    await socket.leave(roomId);

    userData.roomId = null;

    room.connectedUsers.delete(userData.id);

    if (room.connectedUsers.size <= 0) {
      roomsMap.delete(room.id);
    }

    console.log(LOG_MESSAGES.USER_LEFT(userData.username, room.name));
  };

ioServer.on("connection", socket => {
  socket.on(SOCKET_CHANNEL_NAMES.LOGIN, async (username: LoginChannelData) => {
    const userId = generateUserId();

    const userData: UserData = {
      id: userId,
      username,
      roomId: null,
    };

    connectedUsersMap.set(userData, socket);

    const loweredUsername = username.toLowerCase();

    connectedUsersSet.add(loweredUsername);

    await socket.join(loweredUsername);

    ioServer
      .in(loweredUsername)
      .emit(
        SOCKET_CHANNEL_NAMES.GET_LOGGED_USERS,
        Array.from(connectedUsersMap.keys()),
      );

    socket.broadcast.emit(
      SOCKET_CHANNEL_NAMES.GET_LOGGED_USERS,
      Array.from(connectedUsersMap.keys()),
    );

    console.log(LOG_MESSAGES.SOCKET_CONNECT(socket.id, userId));
  });

  socket.on(
    SOCKET_CHANNEL_NAMES.ADD_ROOM,
    (roomData: NewRoomFormSchema, ackSender: (roomId: Room["id"]) => void) => {
      const { name, size } = roomData;

      const roomId = generateRoomId();

      const room: Room = {
        id: roomId,
        name,
        size,
        connectedUsers: new Set([]),
      };

      roomsMap.set(roomId, room);

      ackSender(roomId);

      console.log(LOG_MESSAGES.ROOM_CREATED(name));
    },
  );

  socket.on(SOCKET_CHANNEL_NAMES.JOIN_ROOM, async (roomId: Room["id"]) => {
    const userData = connectedUsersMap.getByValue(socket);

    if (!userData) return;

    const room = roomsMap.get(roomId);

    if (!room) return;

    await socket.join(roomId);

    userData.roomId = roomId;

    room.connectedUsers.add(userData.id);

    console.log(LOG_MESSAGES.USER_JOINED(userData.username, room.name));
  });

  socket.on(
    SOCKET_CHANNEL_NAMES.LEAVE_ROOM,
    makeHandleSocketLeavingRoom(socket),
  );

  socket.on("disconnect", async reason => {
    const user = connectedUsersMap.getByValue(socket);

    if (!user) return;

    const { username } = user;

    const loweredUsername = username.toLowerCase();

    if (user.roomId) {
      await makeHandleSocketLeavingRoom(socket)(user.roomId);
    }

    connectedUsersSet.delete(loweredUsername);
    connectedUsersMap.deleteByValue(socket);

    socket.broadcast.emit(
      SOCKET_CHANNEL_NAMES.GET_LOGGED_USERS,
      Array.from(connectedUsersMap.keys()),
    );

    console.log(LOG_MESSAGES.SOCKET_DISCONNECT(socket.id, user.id, reason));
  });
});

//=================//

httpServer.listen(NETWORK.SERVER_PORT, () => {
  console.log(`Server running at ${NETWORK.SERVER_URL}`);
});
