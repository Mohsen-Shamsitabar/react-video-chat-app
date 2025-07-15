import { ERROR_MESSAGES } from "@shared/constants.ts";
import { z } from "zod";

const loginFormSettings = {
  min: 4,
  max: 16,
  inputType: "text",
  regex: /^[a-zA-Z0-9_]*$/,
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
