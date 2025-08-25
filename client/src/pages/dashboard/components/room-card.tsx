import { Card, CardContent } from "@client/components/ui/card.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { cn } from "@client/lib/utils.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import type { Room } from "@shared/types.ts";
import * as React from "react";
import { useNavigate } from "react-router";

type Props = {
  room: Room;
};

type MyEvents = "a" | "b" | "c";

const RoomCard = (props: Props) => {
  const { room } = props;
  const { socket } = useSocket();

  const navigate = useNavigate();

  const isRoomFull = React.useMemo(
    () => room.connectedUsers.length >= room.size,
    [room],
  );

  if (!socket) return null;

  const handleRoomClick = () => {
    // we MUST also handle this on server!
    if (isRoomFull) return;

    socket.emit("room/join", room.id);
    void navigate(`${PAGE_ROUTES.CHATROOM}/${room.id}`);
  };

  // WE NEED BETTER EVENTS FOR THIS.
  // FETCHING USERS WITH SOCKET.
  const renderConnectedUsers = () => {
    const joinedUsers = room.connectedUsers.join(", ");

    return (
      <div className="flex items-center justify-center">
        <span className="w-1/2 mr-auto overflow-hidden text-nowrap overflow-ellipsis text-xs text-sidebar-accent-foreground font-light">{`Connected: ${joinedUsers}`}</span>
        <div className="w-1/2 ml-auto"></div>
      </div>
    );
  };

  return (
    <Card
      onClick={handleRoomClick}
      className={cn(
        "p-1 mb-2 select-none",
        isRoomFull ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
      aria-disabled={isRoomFull}
    >
      <CardContent className="flex flex-col px-2 py-1">
        <div className="flex items-center justify-between size-full">
          <h5>{room.name}</h5>

          <span className="text-sm">{`${room.connectedUsers.length} / ${room.size}`}</span>
        </div>

        <div>{renderConnectedUsers()}</div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
