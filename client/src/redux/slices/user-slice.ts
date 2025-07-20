import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoginFormSchema } from "@shared/login-form-schema.ts";

type UserState = LoginFormSchema;

const initialState: UserState = {
  username: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<UserState["username"]>) => ({
      ...state,
      username: action.payload,
    }),
  },
});

const userAction = { ...userSlice.actions };

const userReducer = userSlice.reducer;

export { userAction, userReducer, userSlice, type UserState };
