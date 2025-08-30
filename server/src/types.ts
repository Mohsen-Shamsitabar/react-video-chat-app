import type { LoginFormSchema } from "@shared/login-form-schema.ts";
import { type NewRoomFormSchema } from "@shared/new-room-form-schema.ts";
import type { AddRoomResponseBody, LoginResponseBody } from "@shared/types.ts";
import type { Request, Response } from "express";

export type LoginRequest = Request<unknown, unknown, LoginFormSchema>;
export type LoginResponse = Response<LoginResponseBody>;

export type AddRoomRequest = Request<unknown, unknown, NewRoomFormSchema>;
export type AddRoomResponse = Response<AddRoomResponseBody>;
