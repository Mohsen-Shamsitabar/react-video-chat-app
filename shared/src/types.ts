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
  time?: string;
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
  "users/refresh": (opts: { users: UserData[] }) => void;
  "rooms/refresh": (opts: { rooms: Room[] }) => void;
  "room/refresh": (opts: { room: Room }) => void;
  "rooms/users/refresh": (opts: { users: UserData[] }) => void;
  "room/message/send": (opts: { message: Message }) => void;
};

export type ClientToServerEvents = {
  "users/fetch": (
    opts: { usernames?: UserData["username"][] },
    sendUsers: (res: { users: UserData[] }) => void,
  ) => void;
  "rooms/fetch": (
    opts: { roomIds?: Room["id"][] },
    sendRooms: (res: { rooms: Room[] }) => void,
  ) => void;
  "rooms/users/fetch": (
    opts: { roomId: Room["id"] },
    sendUsers: (res: { users: UserData[] }) => void,
  ) => void;
  "room/messages/fetch": (
    opts: { roomId: Room["id"] },
    sendMessages: (res: { messages: Message[] }) => void,
  ) => void;

  //==================

  "user/login": (opts: { username: UserData["username"] }) => void;
  "room/add": (
    opts: { roomFormData: NewRoomFormSchema },
    sendRoomId: (res: { roomId: Room["id"] }) => void,
  ) => void;
  "room/join": (opts: { roomId: Room["id"] }) => void;
  "room/leave": (opts: { roomId: Room["id"] }) => void;
  "message/send": (opts: { message: Message }) => void;

  //==================

  "peer/open": (opts: { peerId: string }) => void;
};

// used for inter-server communication
export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  username: UserData["username"];
};
