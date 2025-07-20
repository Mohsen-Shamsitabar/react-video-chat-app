import { NETWORK } from "@shared/constants.ts";
import cors from "cors";
import express from "express";
import http from "http";
import { registerLoginRoute } from "./routes/post.ts";

const expressApp = express();

expressApp.use(express.json(), cors());

//=== ROUTES ===//

registerLoginRoute(expressApp);

//==============//

const httpServer = http.createServer(expressApp);

//=== SOCKET.IO ===//

// const ioServer = new IoServer(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });

// ioServer.on("connection", connectedSocked => {
//   console.log(`SOCKET:${connectedSocked.id} connected!`);
// });

//=================//

httpServer.listen(NETWORK.SERVER_PORT, () => {
  console.log(`Server running at ${NETWORK.SERVER_URL}`);
});
