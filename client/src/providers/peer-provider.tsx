import { type Peer } from "peerjs";
import { createContext, useContext, useState } from "react";

type PeerProviderProps = {
  children: React.ReactNode;
  peer: Peer | null;
};

type PeerProviderState = {
  peer: PeerProviderProps["peer"];
  setPeer: (peer: PeerProviderProps["peer"]) => void;
};

const initialState: PeerProviderState = {
  peer: null,
  setPeer: () => null,
};

const PeerProviderContext = createContext<PeerProviderState>(initialState);

const PeerProvider = ({ children, ...props }: PeerProviderProps) => {
  const [peer, setPeer] = useState<PeerProviderProps["peer"]>(null);

  return (
    <PeerProviderContext.Provider
      {...props}
      value={{ peer, setPeer }}
    >
      {children}
    </PeerProviderContext.Provider>
  );
};

const usePeer = () => {
  const context = useContext(PeerProviderContext);

  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }

  return context;
};

export { PeerProvider, usePeer };
