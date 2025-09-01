import { type UserData } from "@shared/types.ts";
import { BiDirectionalMap } from "@shared/utils.ts";
import { type Socket } from "socket.io";

export const userDataToSocketBDM = new BiDirectionalMap<UserData, Socket>();

export const socketIdToSocket = new Map<string, Socket>();

export const usernameToUserData = new Map<UserData["username"], UserData>();

/**
 * Lowercase of all the connected users, to check name duplicates.
 */
export const connectedUsersSet = new Set<UserData["username"]>();

export const updateConnectedUsersMap = (
  newUserData: UserData,
  socket: Socket,
) => {
  userDataToSocketBDM.deleteByValue(socket);
  userDataToSocketBDM.set(newUserData, socket);

  // maybe we dont need to delete it, we could just set it.
  usernameToUserData.delete(newUserData.username);
  usernameToUserData.set(newUserData.username, newUserData);
};
