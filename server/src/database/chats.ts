import type { ChatMessage, Room } from "@shared/types.ts";

export const roomIdToChatMap = new Map<Room["id"], ChatMessage[]>();
