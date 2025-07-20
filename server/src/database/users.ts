import { type LoginFormSchema } from "@shared/login-form-schema.ts";
import { BiDirectionalMap } from "@shared/utils.ts";
import { type Socket } from "socket.io";

const connectedUsersMap = new BiDirectionalMap<
  LoginFormSchema["username"],
  Socket
>();

/**
 * Lowercase of all the connected users, to check name duplicates.
 */
const connectedUsersSet = new Set<LoginFormSchema["username"]>();

export { connectedUsersMap, connectedUsersSet };
