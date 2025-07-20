import {
  type Action,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";
import { userReducer } from "./slices/user-slice.ts";

const appStore = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type AppStore = typeof appStore;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

export default appStore;
