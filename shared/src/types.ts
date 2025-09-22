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

export type Message = {
  id: MessageId;
  from: "server" | (UserData["username"] & {});
  to: RoomId;
  content: string;
};

export type Room = NewRoomFormSchema & {
  id: RoomId;
  connectedUsers: UserData["username"][];
};

export type RoomSummary = {
  id: Room["id"];
  name: Room["name"];
};

export type UserData = LoginFormSchema & {
  roomSummary: RoomSummary | null;
  socketId: string | null;
  peerId: string | null;
};

//======================< SOCKET >======================//

export type ServerToClientEvents = {
  // withAck: (d: string, callback: (e: number) => void) => void;
  "users/refresh": (users: UserData[]) => void;
  "rooms/refresh": (rooms: Room[]) => void;
  "room/refresh": (room: Room) => void;
  "rooms/users/refresh": (users: UserData[]) => void;
  "room/message/send": (message: Message) => void;
};

export type ClientToServerEvents = {
  "users/fetch": (
    usernames: UserData["username"][] | undefined,
    sendUsers: (users: UserData[]) => void,
  ) => void;
  "rooms/fetch": (
    roomIds: Room["id"][] | undefined,
    sendRooms: (rooms: Room[]) => void,
  ) => void;
  "rooms/users/fetch": (
    roomId: Room["id"],
    sendUsers: (users: UserData[]) => void,
  ) => void;
  "room/messages/fetch": (
    roomId: Room["id"],
    sendMessages: (messages: Message[]) => void,
  ) => void;

  //==================

  "user/login": (username: UserData["username"]) => void;
  "room/add": (
    roomFormData: NewRoomFormSchema,
    sendRoomId: (roomId: Room["id"]) => void,
  ) => void;
  "room/join": (roomId: Room["id"]) => void;
  "room/leave": (roomId: Room["id"]) => void;
  "message/send": (message: Message) => void;

  //==================

  "peer/open": (peerId: string) => void;
};

// used for inter-server communication
export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  username: UserData["username"];
};
