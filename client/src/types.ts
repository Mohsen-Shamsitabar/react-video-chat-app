import type { RoomId } from "@shared/types.ts";
import type { CHATROOM_PARAM_NAME, PAGE_ROUTES } from "./lib/constants.ts";

export type ChatroomParams = {
  [CHATROOM_PARAM_NAME]: RoomId;
};

export type AllPagePaths = (typeof PAGE_ROUTES)[keyof typeof PAGE_ROUTES];
