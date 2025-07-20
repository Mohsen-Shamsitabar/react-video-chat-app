import { coloredText } from "./utils.ts";

export const LOG_MESSAGES = {
  SOCKET_CONNECT: (socketId: string) =>
    `SOCKET:${coloredText(socketId, "yellow")} ${coloredText("connected!", "green")}`,
  SOCKET_DISCONNECT: (socketId: string, reason: string) =>
    `SOCKET:${coloredText(socketId, "yellow")} ${coloredText("disconnected!", "red")} reason: ${reason}.`,
};
