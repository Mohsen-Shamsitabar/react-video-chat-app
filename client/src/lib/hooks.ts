import { useActiveUser } from "@client/providers/active-user-provider.tsx";
import { loginFormUsernameField } from "@shared/login-form-schema.ts";
import { type UserData } from "@shared/types.ts";

type UserLoggedStats = {
  username: UserData["username"];
  isLogged: true;
};

type UserNotLoggedStats = {
  username: null;
  isLogged: false;
};

type UserStats = UserLoggedStats | UserNotLoggedStats;

export const useLoginStatus = (): UserStats => {
  const { username } = useActiveUser();

  if (!username) return { isLogged: false, username: null };

  const { success } = loginFormUsernameField.safeParse(username);

  if (!success) return { isLogged: false, username: null };

  return { isLogged: true, username };
};

//========================================================//
