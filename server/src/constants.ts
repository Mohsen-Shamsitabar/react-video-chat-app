import type { UserId } from "@shared/types.ts";
import { coloredText } from "./utils.ts";

export const LOG_MESSAGES = {
  SOCKET_CONNECT: (socketId: string, userId: UserId) =>
    `Socket ${coloredText(socketId, "yellow")} with userId ${coloredText(userId, "yellow")} ${coloredText("connected", "green")}`,
  SOCKET_DISCONNECT: (socketId: string, userId: UserId, reason: string) =>
    `Socket ${coloredText(socketId, "yellow")} with userId ${coloredText(userId, "yellow")} ${coloredText("disconnected", "red")} reason: ${reason}.`,
  ROOM_CREATED: (roomName: string) =>
    `Room ${coloredText(roomName, "gray")} ${coloredText("created", "green")}`,
  ROOM_DELETED: (roomName: string) =>
    `Room ${coloredText(roomName, "gray")} ${coloredText("deleted", "red")}`,
  USER_JOINED: (username: string, roomName: string) =>
    `User ${coloredText(username, "magenta")} ${coloredText("Joined", "green")} Room ${coloredText(roomName, "gray")}`,
  USER_LEFT: (username: string, roomName: string) =>
    `User ${coloredText(username, "magenta")} ${coloredText("Left", "red")} Room ${coloredText(roomName, "gray")}`,
};
