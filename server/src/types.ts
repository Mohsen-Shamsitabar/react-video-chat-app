import type { LoginFormSchema } from "@shared/login-form-schema.ts";
import type { LoginResponseBody } from "@shared/types.ts";
import type { Request, Response } from "express";

export type LoginRequest = Request<unknown, unknown, LoginFormSchema>;
export type LoginResponse = Response<LoginResponseBody>;
