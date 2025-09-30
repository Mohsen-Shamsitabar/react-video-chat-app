import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { useLoginStatus } from "@client/lib/hooks.ts";
import { usePeer } from "@client/providers/peer-provider.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { NETWORK, PEER_PATH, SOCKET_PATH } from "@shared/constants.ts";
import {
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@shared/types.ts";
import { Peer } from "peerjs";
import * as React from "react";
import { Outlet, useNavigate } from "react-router";
import { io, type Socket } from "socket.io-client";

const AuthLayout = () => {
  const { isLogged, username } = useLoginStatus();

  const { socket, setSocket } = useSocket();

  const { peer, setPeer } = usePeer();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLogged) {
      void navigate(PAGE_ROUTES.HOMEPAGE);
      return;
    }

    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      NETWORK.SERVER_URL,
      { path: SOCKET_PATH },
    );

    newSocket.on("connect", () => {
      console.log(
        `Socket '${newSocket.id}' with username '${username}' connected`,
      );

      newSocket.emit("user/login", { username });

      setSocket(newSocket);
    });

    //==========================

    const newPeer = new Peer({
      host: new URL(NETWORK.SERVER_URL).hostname, // localhost
      port: NETWORK.PEER_PORT,
      path: PEER_PATH,
    });

    newPeer.on("open", peerId => {
      console.log(`Peer '${peerId}' with username '${username}' connected`);

      setPeer(newPeer);

      if (!newSocket.connected) return;

      newSocket.emit("peer/open", { peerId });
    });

    return () => {
      newSocket.disconnect();
      newPeer.destroy();
    };
  }, [isLogged]);

  if (!socket) return null;
  if (!peer) return null;

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;
