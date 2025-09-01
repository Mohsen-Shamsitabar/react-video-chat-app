import UserCard from "@client/components/common/user-card.tsx";
import { useRoom } from "@client/providers/room-provider.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { type UserData } from "@shared/types.ts";
import * as React from "react";
import ContentHeader from "./content-header.tsx";

type Props = {
  handleTabContentOpen: () => void;
};

const UsersContent = (props: Props) => {
  const { handleTabContentOpen } = props;

  const [connectedUsers, setConnectedUsers] = React.useState<UserData[]>([]);

  const { socket } = useSocket();

  const room = useRoom();

  React.useEffect(() => {
    if (!socket) return;
    if (!room) return;

    void (async () => {
      const users = await socket.emitWithAck("rooms/users/fetch", room.id);

      setConnectedUsers(users);
    })();

    socket.on("rooms/users/refresh", users => setConnectedUsers(users));

    return () => {
      socket.off("rooms/users/refresh");
    };
  }, []);

  if (!socket) return null;
  if (!room) return null;

  const renderUsers = () => {
    return connectedUsers.map(user => (
      <li key={user.username}>
        <UserCard {...user} />
      </li>
    ));
  };

  return (
    <div className="flex flex-col p-4">
      <ContentHeader
        title="Connected users"
        handleTabContentOpen={handleTabContentOpen}
      />

      <ol>{renderUsers()}</ol>
    </div>
  );
};

export default UsersContent;
