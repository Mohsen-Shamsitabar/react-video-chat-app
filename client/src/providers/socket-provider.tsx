import { createContext, useContext, useState } from "react";
import { type Socket } from "socket.io-client";

type SocketProviderProps = {
  children: React.ReactNode;
  socket: Socket | null;
};

type SocketProviderState = {
  socket: SocketProviderProps["socket"];
  setSocket: (socket: SocketProviderProps["socket"]) => void;
};

const initialState: SocketProviderState = {
  socket: null,
  setSocket: () => null,
};

const SocketProviderContext = createContext<SocketProviderState>(initialState);

const SocketProvider = ({ children, ...props }: SocketProviderProps) => {
  const [socket, setSocket] = useState<SocketProviderProps["socket"]>(null);

  return (
    <SocketProviderContext.Provider
      {...props}
      value={{ socket, setSocket }}
    >
      {children}
    </SocketProviderContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketProviderContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};

export { SocketProvider, useSocket };
