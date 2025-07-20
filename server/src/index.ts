import { NETWORK, SOCKET_CHANNELS } from "@shared/constants.ts";
import { type LoginFormSchema } from "@shared/login-form-schema.ts";
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

  socket.on(SOCKET_CHANNELS.LOGIN, (username: LoginFormSchema["username"]) => {
    connectedUsersMap.set(username, socket);

    const loweredUsername = username.toLowerCase();

    connectedUsersSet.add(loweredUsername);
  });

  socket.on("disconnect", reason => {
    console.log(LOG_MESSAGES.SOCKET_DISCONNECT(socket.id, reason));

    const username = connectedUsersMap.getByValue(socket);

    if (!username) return;

    const loweredUsername = username.toLowerCase();

    connectedUsersSet.delete(loweredUsername);
    connectedUsersMap.deleteByKey(username);
  });
});

//=================//

httpServer.listen(NETWORK.SERVER_PORT, () => {
  console.log(`Server running at ${NETWORK.SERVER_URL}`);
});
