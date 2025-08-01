import type { LoginFormSchema } from "./login-form-schema.ts";

export type LoginResponseBody = {
  message: string;
};

export type UserData = LoginFormSchema & {
  status: string;
};
