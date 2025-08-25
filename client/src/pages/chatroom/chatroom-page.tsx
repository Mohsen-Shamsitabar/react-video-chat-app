import { Button } from "@client/components/ui/button.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import type { ChatroomParams } from "@client/types.ts";
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
    if (!roomId) return;

    socket.emit("room/fetch", roomId);

    socket.on("room/refresh", (room: Room | null) => setRoom(room));

    return () => {
      socket.off("room/refresh");
    };
  }, []);

  if (!socket) return null;
  if (!room) return null;

  const handleLeaveRoom = () => {
    socket.emit("room/leave", room.id);
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
