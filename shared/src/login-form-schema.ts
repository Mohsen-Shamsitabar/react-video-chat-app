import { ERROR_MESSAGES, textRegex } from "@shared/constants.ts";
import { z } from "zod";

const usernameFieldSettings = {
  min: 4,
  max: 16,
  inputType: "text",
  regex: textRegex,
} as const;

const loginFormUsernameField = z
  .string()
  .min(usernameFieldSettings.min, {
    error: ERROR_MESSAGES.tooShort(usernameFieldSettings.min),
  })
  .max(usernameFieldSettings.max, {
    error: ERROR_MESSAGES.tooLong(usernameFieldSettings.max),
  })
  .regex(usernameFieldSettings.regex, {
    error: ERROR_MESSAGES.invalid(usernameFieldSettings.inputType),
  });

const loginFormSchema = z.object({
  username: loginFormUsernameField,
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export { loginFormSchema, loginFormUsernameField, type LoginFormSchema };
