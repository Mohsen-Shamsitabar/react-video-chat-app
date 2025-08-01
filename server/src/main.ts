import { NETWORK, SOCKET_CHANNELS } from "@shared/constants.ts";
import { type UserData } from "@shared/types.ts";
import cors from "cors";
import express from "express";
import http from "http";
import { Server as IoServer } from "socket.io";
import { LOG_MESSAGES } from "./constants.ts";
import { connectedUsersMap, connectedUsersSet } from "./database/users.ts";
import { registerLoginRoute } from "./routes/post.ts";

const expressApp = express();

expressApp.use(express.json(), cors());

//=== ROUTES ===//

registerLoginRoute(expressApp);

//==============//

const httpServer = http.createServer(expressApp);

//=== SOCKET.IO ===//

const ioServer = new IoServer(httpServer, {
  cors: {
    origin: "*",
  },
});

ioServer.on("connection", socket => {
  console.log(LOG_MESSAGES.SOCKET_CONNECT(socket.id));

  socket.on(SOCKET_CHANNELS.LOGIN, (userData: UserData) => {
    connectedUsersMap.set(userData, socket);

    const { username } = userData;

    const loweredUsername = username.toLowerCase();

    connectedUsersSet.add(loweredUsername);

    socket.emit(
      SOCKET_CHANNELS.GET_LOGGED_USERS,
      Array.from(connectedUsersMap.keys()),
    );

    socket.broadcast.emit(
      SOCKET_CHANNELS.GET_LOGGED_USERS,
      Array.from(connectedUsersMap.keys()),
    );
  });

  socket.on("disconnect", reason => {
    const user = connectedUsersMap.getByValue(socket);

    if (!user) return;

    console.log(LOG_MESSAGES.SOCKET_DISCONNECT(socket.id, reason));

    const { username } = user;

    const loweredUsername = username.toLowerCase();

    connectedUsersSet.delete(loweredUsername);
    connectedUsersMap.deleteByValue(socket);

    /*used both "emit" and "broadcast.emit" to make sure everyone (current user included)
    has recieved the message.*/

    socket.emit(
      SOCKET_CHANNELS.GET_LOGGED_USERS,
      Array.from(connectedUsersMap.keys()),
    );

    socket.broadcast.emit(
      SOCKET_CHANNELS.GET_LOGGED_USERS,
      Array.from(connectedUsersMap.keys()),
    );
  });
});

//=================//

httpServer.listen(NETWORK.SERVER_PORT, () => {
  console.log(`Server running at ${NETWORK.SERVER_URL}`);
});
