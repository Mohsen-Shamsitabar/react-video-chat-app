import { Card, CardContent } from "@client/components/ui/card.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { cn } from "@client/lib/utils.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import type { Room, UserData } from "@shared/types.ts";
import * as React from "react";
import { useNavigate } from "react-router";

type Props = {
  room: Room;
};

const RoomCard = (props: Props) => {
  const { room } = props;
  const { socket } = useSocket();

  const navigate = useNavigate();

  const isRoomFull = React.useMemo(
    () => room.connectedUsers.length >= room.size,
    [room],
  );

  const [connectedUsersData, setConnectedUsersData] = React.useState<
    UserData[]
  >([]);

  React.useEffect(() => {
    if (!socket) return;

    void (async () => {
      const usersData = await socket.emitWithAck(
        "users/fetch",
        room.connectedUsers,
      );

      setConnectedUsersData(usersData);
    })();
  }, [room.connectedUsers]);

  if (!socket) return null;

  const renderConnectedUsers = () => {
    const joinedUsernames = connectedUsersData
      .map(user => user.username)
      .join(", ");

    return (
      <span className="overflow-hidden text-nowrap overflow-ellipsis text-xs text-sidebar-accent-foreground font-light">{`Connected: ${joinedUsernames}`}</span>
    );
  };

  const handleRoomClick = () => {
    // we MUST also handle this on server!
    if (isRoomFull) return;

    socket.emit("room/join", room.id);
    void navigate(`${PAGE_ROUTES.CHATROOM}/${room.id}`);
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
      <CardContent className="flex items-center justify-between px-2 py-1">
        <div className="flex flex-col">
          <h5>{room.name}</h5>

          {renderConnectedUsers()}
        </div>

        <span className="text-sm">{`${room.connectedUsers.length} / ${room.size}`}</span>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
