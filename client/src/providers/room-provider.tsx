import type { Room } from "@shared/types.ts";
import { createContext, useContext } from "react";

type RoomProviderProps = {
  children: React.ReactNode;
  room: Room | null;
};

type RoomProviderState = RoomProviderProps["room"];

const RoomProviderContext = createContext<RoomProviderState>(null);

const RoomProvider = ({ children, ...props }: RoomProviderProps) => {
  const { room } = props;

  return (
    <RoomProviderContext.Provider value={room}>
      {children}
    </RoomProviderContext.Provider>
  );
};

const useRoom = () => {
  const context = useContext(RoomProviderContext);

  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }

  return context;
};

export { RoomProvider, useRoom };
