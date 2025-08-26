import type { LoginFormSchema } from "./login-form-schema.ts";
import { type NewRoomFormSchema } from "./new-room-form-schema.ts";

//======================< REST API >======================//

export type LoginResponseBody = {
  message: string;
};

export type AddRoomResponseBody = {
  message: string;
};

//======================< DATA >======================//

export type MessageId = `MSG_${string}`;
export type RoomId = `ROOM_${string}`;
export type UserId = `USER_${string}`;

export type Room = NewRoomFormSchema & {
  id: RoomId;
  connectedUsers: UserId[];
};

export type RoomSummary = {
  id: Room["id"];
  name: Room["name"];
};

export type UserData = LoginFormSchema & {
  id: UserId;
  roomSummary: RoomSummary | null;
};

export type Message = {
  id: MessageId;
  from: UserId;
  context: string;
};

//======================< SOCKET >======================//

export type ServerToClientEvents = {
  // withAck: (d: string, callback: (e: number) => void) => void;
  "users/refresh": (users: UserData[]) => void;
  "rooms/refresh": (rooms: Room[]) => void;
};

export type ClientToServerEvents = {
  "user/login": (username: UserData["username"]) => void;
  "users/fetch": (sendUsers: (users: UserData[]) => void) => void;
  "room/add": (
    roomFormData: NewRoomFormSchema,
    sendRoomId: (roomId: Room["id"]) => void,
  ) => void;
  "room/join": (roomId: Room["id"]) => void;
  "room/leave": (roomId: Room["id"]) => void;
  "room/fetch": (
    roomId: Room["id"],
    sendRoom: (room: Room | null) => void,
  ) => void;
  "rooms/fetch": (sendRooms: (rooms: Room[]) => void) => void;
};

// used for inter-server communication
export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  username: UserData["username"];
  userId: UserData["id"];
};
