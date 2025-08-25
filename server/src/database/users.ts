import { type UserData } from "@shared/types.ts";
import { BiDirectionalMap } from "@shared/utils.ts";
import { type Socket } from "socket.io";

const connectedUsersMap = new BiDirectionalMap<UserData, Socket>();

/**
 * Lowercase of all the connected users, to check name duplicates.
 */
const connectedUsersSet = new Set<UserData["username"]>();

const updateConnectedUsersMap = (newUserData: UserData, socket: Socket) => {
  connectedUsersMap.deleteByValue(socket);
  connectedUsersMap.set(newUserData, socket);
};

export { connectedUsersMap, connectedUsersSet, updateConnectedUsersMap };
