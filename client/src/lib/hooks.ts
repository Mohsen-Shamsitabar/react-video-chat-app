import { useAppSelector } from "@client/redux/hooks.ts";
import { type UserState } from "@client/redux/slices/user-slice.ts";

type UserLoggedStats = {
  user: UserState;
  isLogged: true;
};

type UserNotLoggedStats = {
  user: null;
  isLogged: false;
};

type UserStats = UserLoggedStats | UserNotLoggedStats;

export const useLoginStatus = (): UserStats => {
  const user = useAppSelector(state => state.user);

  const { username } = user;

  if (typeof username !== "string") {
    return { isLogged: false, user: null };
  }

  if (username.length <= 0) {
    return { isLogged: false, user: null };
  }

  return { isLogged: true, user };
};

//========================================================//
