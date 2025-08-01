import { z } from "zod";
import { ERROR_MESSAGES, textRegex } from "./constants.ts";

const roomNameSettings = {
  min: 4,
  max: 16,
  inputType: "text",
  regex: textRegex,
} as const;

// const roomSizeSettings = {
//   min: 4,
//   max: 16,
//   inputType: "number",
//   regex: numberRegex,
// } as const;

const newRoomFormSchema = z.object({
  roomName: z
    .string()
    .min(roomNameSettings.min, {
      error: ERROR_MESSAGES.tooShort(roomNameSettings.min),
    })
    .max(roomNameSettings.max, {
      error: ERROR_MESSAGES.tooLong(roomNameSettings.max),
    })
    .regex(roomNameSettings.regex, {
      error: ERROR_MESSAGES.invalid(roomNameSettings.inputType),
    }),

  roomSize: z.number(),
});

type NewRoomFormSchema = z.infer<typeof newRoomFormSchema>;

export { newRoomFormSchema, type NewRoomFormSchema };
