import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "@shared/types.ts";

type UserState = UserData;
const initialState: UserState = {
  username: "",
  status: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<UserState["username"]>) => ({
      ...state,
      username: action.payload,
    }),
    setStatus: (state, action: PayloadAction<UserState["status"]>) => ({
      ...state,
      status: action.payload,
    }),
  },
});

const userAction = { ...userSlice.actions };

const userReducer = userSlice.reducer;

export { userAction, userReducer, userSlice, type UserState };
