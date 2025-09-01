import type { Message, Room } from "@shared/types.ts";

export const roomIdToMessages = new Map<Room["id"], Message[]>();
