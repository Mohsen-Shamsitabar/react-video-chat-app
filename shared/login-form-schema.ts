import { ERROR_MESSAGES, textRegex } from "@shared/constants.ts";
import { z } from "zod";

const loginFormSettings = {
  min: 4,
  max: 16,
  inputType: "text",
  regex: textRegex,
} as const;

const loginFormSchema = z.object({
  username: z
    .string()
    .min(loginFormSettings.min, {
      error: ERROR_MESSAGES.tooShort(loginFormSettings.min),
    })
    .max(loginFormSettings.max, {
      error: ERROR_MESSAGES.tooLong(loginFormSettings.max),
    })
    .regex(loginFormSettings.regex, {
      error: ERROR_MESSAGES.invalid(loginFormSettings.inputType),
    }),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export { loginFormSchema, type LoginFormSchema };
