import { connectedUsersSet } from "@server/database/users.ts";
import type {
  AddRoomRequest,
  AddRoomResponse,
  LoginRequest,
  LoginResponse,
} from "@server/types.ts";
import { API_ROUTES, ERROR_MESSAGES } from "@shared/constants.ts";
import { loginFormSchema } from "@shared/login-form-schema.ts";
import { newRoomFormSchema } from "@shared/new-room-form-schema.ts";
import { type Express } from "express";
import { StatusCodes } from "http-status-codes";

const registerLoginRoute = (expressApp: Express) => {
  expressApp.post(API_ROUTES.LOGIN, (req: LoginRequest, res: LoginResponse) => {
    const body = req.body;

    const { error } = loginFormSchema.safeParse(body);

    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });

      return;
    }

    const { username } = body;

    const loweredUsername = username.toLowerCase();
    const alreadyLoggedIn = connectedUsersSet.has(loweredUsername);

    if (alreadyLoggedIn) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.taken("username") });

      return;
    }

    res.status(StatusCodes.OK).json({ message: "Successfully logged in." });
  });
};

const registerAddRoomRoute = (expressApp: Express) => {
  expressApp.post(
    API_ROUTES.ADD_ROOM,
    (req: AddRoomRequest, res: AddRoomResponse) => {
      const body = req.body;

      const { error } = newRoomFormSchema.safeParse(body);

      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });

        return;
      }

      res
        .status(StatusCodes.OK)
        .json({ message: "Room successfully created." });
    },
  );
};

export { registerAddRoomRoute, registerLoginRoute };
