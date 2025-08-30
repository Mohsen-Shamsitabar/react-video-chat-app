import type { Room } from "@shared/types.ts";

const roomsMap = new Map<Room["id"], Room>([]);

export default roomsMap;
