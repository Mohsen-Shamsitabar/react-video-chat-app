import type { RoomId } from "@shared/types.ts";
import type {
  CHATROOM_PARAM_NAME,
  CHATROOM_TAB_NAMES,
  PAGE_ROUTES,
} from "./lib/constants.ts";

export type ChatroomParams = {
  [CHATROOM_PARAM_NAME]: RoomId;
};

export type AllPagePaths = (typeof PAGE_ROUTES)[keyof typeof PAGE_ROUTES];

export type ChatroomTabNames =
  | (typeof CHATROOM_TAB_NAMES)[keyof typeof CHATROOM_TAB_NAMES]
  | (string & {});
