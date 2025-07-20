import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { useUserStats } from "@client/lib/hooks.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { NETWORK, SOCKET_CHANNELS } from "@shared/constants.ts";
import * as React from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";

const ChatroomsPage = () => {
  const { isLogged, user } = useUserStats();

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
      console.log(`SOCKET:${socket.id} connected!`);

      socket.emit(SOCKET_CHANNELS.LOGIN, user.username);

      setSocket(socket);
    });

    return () => {
      socket.removeListener("connect");
      socket.removeListener(SOCKET_CHANNELS.LOGIN);
      setSocket(null);
    };
  }, [isLogged]);

  if (!isLogged || !socket) return null;

  return (
    <div>
      <h1>{user.username}</h1>
    </div>
  );
};

export default ChatroomsPage;
