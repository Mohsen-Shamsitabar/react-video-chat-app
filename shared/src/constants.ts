//=== == NETWORK == ===//

const DOMAIN_NAME = "http://localhost";
const IP_ADDRESS = "http://192.168.1.153";
const SERVER_PORT = 3001;
const CLIENT_PORT = 5173;

const PEER_PORT = 9000;

export const PEER_PATH = "/react-video-chat/peerjs";
export const SOCKET_PATH = "/react-video-chat/socketio";

export const NETWORK = {
  DOMAIN_NAME,
  IP_ADDRESS,
  SERVER_PORT,
  CLIENT_PORT,
  PEER_PORT,
  SERVER_URL: `${IP_ADDRESS}:${SERVER_PORT}`,
  CLIENT_URL: `${IP_ADDRESS}:${CLIENT_PORT}`,
  // SERVER_URL: `${DOMAIN_NAME}:${SERVER_PORT}`,
  // CLIENT_URL: `${DOMAIN_NAME}:${CLIENT_PORT}`,
} as const;

export const API_ROUTES = {
  LOGIN: "/users/login",
  ADD_ROOM: "/rooms/add",
} as const;

//=== == UTILS == ===//

export const textRegex = /^[a-zA-Z0-9_]*$/;
export const numberRegex = /^\d+$/;

export const ERROR_MESSAGES = {
  required: "This field is required!",
  invalid: (inputType: "text" | "email" | "number") => {
    switch (inputType) {
      case "text":
        return "Only letters, numbers, and underscores are allowed!";

      case "email":
        return "Please enter a valid email address!";

      case "number":
        return "Please enter a valid number!";

      default:
        return "Field is invalid!";
    }
  },
  tooShort: (min: number) =>
    `Please enter at least ${min} characters!` as const,
  tooLong: (max: number) =>
    `Please enter no more than ${max} characters!` as const,
  taken: (valueName: string) => `This ${valueName} is already in use!` as const,
} as const;
