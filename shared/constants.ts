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
  tooShort: (min: number) => `Please enter at least ${min} characters!`,
  tooLong: (max: number) => `Please enter no more than ${max} characters!`,
  taken: "This value is already in use.",
} as const;
