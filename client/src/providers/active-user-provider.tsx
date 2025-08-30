import { type UserData } from "@shared/types.ts";
import { createContext, useContext, useState } from "react";

type ActiveUserProviderProps = {
  children: React.ReactNode;
  username: null | UserData["username"];
};

type ActiveUserProviderState = {
  username: ActiveUserProviderProps["username"];
  setUsername: (username: ActiveUserProviderProps["username"]) => void;
};

const initialState: ActiveUserProviderState = {
  username: null,
  setUsername: () => null,
};

const ActiveUserContext = createContext<ActiveUserProviderState>(initialState);

const ActiveUserProvider = ({
  children,
  ...props
}: ActiveUserProviderProps) => {
  const [username, setUsername] =
    useState<ActiveUserProviderProps["username"]>(null);

  return (
    <ActiveUserContext.Provider
      {...props}
      value={{ username, setUsername }}
    >
      {children}
    </ActiveUserContext.Provider>
  );
};

const useActiveUser = () => {
  const context = useContext(ActiveUserContext);

  if (!context) {
    throw new Error("useActiveUser must be used within a ActiveUserProvider");
  }

  return context;
};

export { ActiveUserProvider, useActiveUser };
