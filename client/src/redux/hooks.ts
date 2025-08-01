import { useDispatch, useSelector } from "react-redux";
import { userAction } from "./slices/user-slice.ts";
import type { AppDispatch, RootState } from "./store.ts";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

//====================================================================//

export const useResetRedux = () => {
  const appDispatch = useAppDispatch();

  appDispatch(userAction.setStatus(""));
  appDispatch(userAction.setUsername(""));
};
