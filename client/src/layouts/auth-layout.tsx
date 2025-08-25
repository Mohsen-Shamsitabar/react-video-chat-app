import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { useLoginStatus } from "@client/lib/hooks.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { NETWORK, SOCKET_CHANNEL_NAMES } from "@shared/constants.ts";
import * as React from "react";
import { Outlet, useNavigate } from "react-router";
import { io } from "socket.io-client";

const AuthLayout = () => {
  const { isLogged, username } = useLoginStatus();

  const { socket, setSocket } = useSocket();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLogged) {
      void navigate(PAGE_ROUTES.HOMEPAGE);
      return;
    }

    //=== SOCKET ===//

    const socket = io(NETWORK.SERVER_URL);

    socket.on("connect", () => {
      console.log(
        `Socket '${socket.id}' with username '${username}' connected`,
      );

      socket.emit(SOCKET_CHANNEL_NAMES.USER_LOGIN, username);

      setSocket(socket);
    });

    return () => {
      socket.off("connect");
    };
  }, [isLogged]);

  if (!socket) return null;

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;
