//=== == NETWORK == ===//

const DOMAIN_NAME = "http://localhost";
const IP_ADDRESS = "http://192.168.1.144";
const SERVER_PORT = 3001;
const CLIENT_PORT = 5173;

export const NETWORK = {
  DOMAIN_NAME,
  IP_ADDRESS,
  SERVER_PORT,
  CLIENT_PORT,
  SERVER_URL: `${DOMAIN_NAME}:${SERVER_PORT}`,
  CLIENT_URL: `${DOMAIN_NAME}:${CLIENT_PORT}`,
} as const;

export const API_ROUTES = {
  LOGIN: "/users/login",
} as const;

//=== == UTILS == ===//

export const ERROR_MESSAGES = {
  required: "This field is required!",
  invalid: (inputType: "text" | "email") => {
    switch (inputType) {
      case "text":
        return "Only letters, numbers, and underscores are allowed!";

      case "email":
        return "Please enter a valid email address!";

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
