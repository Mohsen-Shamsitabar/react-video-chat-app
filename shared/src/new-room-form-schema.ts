import { z } from "zod";
import { ERROR_MESSAGES, textRegex } from "./constants.ts";

const roomNameFieldSettings = {
  min: 4,
  max: 16,
  inputType: "text",
  regex: textRegex,
} as const;

const roomNameField = z
  .string()
  .min(roomNameFieldSettings.min, {
    error: ERROR_MESSAGES.tooShort(roomNameFieldSettings.min),
  })
  .max(roomNameFieldSettings.max, {
    error: ERROR_MESSAGES.tooLong(roomNameFieldSettings.max),
  })
  .regex(roomNameFieldSettings.regex, {
    error: ERROR_MESSAGES.invalid(roomNameFieldSettings.inputType),
  });

const newRoomFormSchema = z.object({
  name: roomNameField,
  size: z.number(),
});

type NewRoomFormSchema = z.infer<typeof newRoomFormSchema>;

export { newRoomFormSchema, roomNameField, type NewRoomFormSchema };
