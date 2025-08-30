import { type UserData } from "@shared/types.ts";
import { BiDirectionalMap } from "@shared/utils.ts";
import { type Socket } from "socket.io";

export const userToSocketBDM = new BiDirectionalMap<UserData, Socket>();

export const socketIdToSocket = new Map<string, Socket>();

export const userIdToUser = new Map<UserData["id"], UserData>();

/**
 * Lowercase of all the connected users, to check name duplicates.
 */
export const connectedUsersSet = new Set<UserData["username"]>();

export const updateConnectedUsersMap = (
  newUserData: UserData,
  socket: Socket,
) => {
  userToSocketBDM.deleteByValue(socket);
  userToSocketBDM.set(newUserData, socket);

  // maybe we dont need to delete it, we could just set it.
  userIdToUser.delete(newUserData.id);
  userIdToUser.set(newUserData.id, newUserData);
};
