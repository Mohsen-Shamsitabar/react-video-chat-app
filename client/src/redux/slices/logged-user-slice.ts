import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LoggedUserState = {
  username: string;
};

const initialState: LoggedUserState = {
  username: "",
};

const loggedUserSlice = createSlice({
  name: "logged-user",
  initialState,
  reducers: {
    setUsername: (
      state,
      action: PayloadAction<LoggedUserState["username"]>,
    ) => ({ ...state, username: action.payload }),
  },
});

const loggedUserAction = { ...loggedUserSlice.actions };

const loggedUserReducer = loggedUserSlice.reducer;

export {
  loggedUserAction,
  loggedUserReducer,
  loggedUserSlice,
  type LoggedUserState,
};
