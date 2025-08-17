import type { LoginFormSchema } from "./login-form-schema.ts";
import { type NewRoomFormSchema } from "./new-room-form-schema.ts";

export type LoginResponseBody = {
  message: string;
};

export type AddRoomResponseBody = {
  message: string;
};

//========================================

export type MessageId = `MSG_${string}`;
export type RoomId = `ROOM_${string}`;
export type UserId = `USER_${string}`;

export type UserData = LoginFormSchema & {
  id: UserId;
  roomId: RoomId | null;
};

export type Message = {
  id: MessageId;
  from: UserId;
  context: string;
};

export type Room = NewRoomFormSchema & {
  id: RoomId;
  connectedUsers: Set<UserData["id"]>;
};

export type LoginChannelData = UserData["username"];
