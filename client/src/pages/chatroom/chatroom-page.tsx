import { Button } from "@client/components/ui/button.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import type { ChatroomParams } from "@client/types.ts";
import { SOCKET_CHANNEL_NAMES } from "@shared/constants.ts";
import { type Room } from "@shared/types.ts";
import * as React from "react";
import { useNavigate, useParams } from "react-router";

const ChatroomPage = () => {
  // How to know if room exists?
  const { roomId } = useParams<ChatroomParams>();

  const [room, setRoom] = React.useState<Room | null>(null);

  const { socket } = useSocket();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!socket) return;

    socket.emit(SOCKET_CHANNEL_NAMES.ROOM_FETCH, roomId);

    socket.on(SOCKET_CHANNEL_NAMES.ROOM_REFRESH, (room: Room | null) =>
      setRoom(room),
    );

    return () => {
      socket.off(SOCKET_CHANNEL_NAMES.ROOM_REFRESH);
    };
  }, []);

  if (!socket) return null;
  if (!room) return null;

  const handleLeaveRoom = () => {
    socket.emit(SOCKET_CHANNEL_NAMES.ROOM_LEAVE, room.id);
    void navigate(PAGE_ROUTES.DASHBOARD);
  };

  return (
    <div>
      <h1>{`Room name: ${room.name}`}</h1>

      <Button onClick={handleLeaveRoom}>Leave room</Button>
    </div>
  );
};

export default ChatroomPage;
