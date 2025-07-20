import { API_ROUTES, NETWORK } from "@shared/constants.ts";
import { type LoginFormSchema } from "@shared/login-form-schema.ts";
import { type LoginResponseBody } from "@shared/types.ts";

type LoginResult = {
  message: string;
  error: boolean;
};

export const login = async (data: LoginFormSchema): Promise<LoginResult> => {
  const res = await fetch(`${NETWORK.SERVER_URL}${API_ROUTES.LOGIN}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = (await res.json()) as LoginResponseBody;

  if (!res.ok) {
    return { message: body.message, error: true };
  }

  return { message: body.message, error: false };
};
