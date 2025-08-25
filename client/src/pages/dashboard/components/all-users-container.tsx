import { ScrollArea } from "@client/components/ui/scroll-area.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { SOCKET_CHANNEL_NAMES } from "@shared/constants.ts";
import { type UserData } from "@shared/types.ts";
import * as React from "react";
import UserCard from "./user-card.tsx";

const AllUsersContainer = () => {
  const { socket } = useSocket();

  const [allUsers, setAllUsers] = React.useState<UserData[]>([]);

  React.useEffect(() => {
    if (!socket) return;

    socket.emit(SOCKET_CHANNEL_NAMES.USERS_FETCH);

    socket.on(SOCKET_CHANNEL_NAMES.USERS_REFRESH, (users: UserData[]) => {
      setAllUsers(users);
    });

    return () => {
      socket.off(SOCKET_CHANNEL_NAMES.USERS_REFRESH);
    };
  }, []);

  if (!socket) return null;

  const renderUserCards = () => {
    return allUsers.map(user => (
      <UserCard
        key={user.username}
        {...user}
      />
    ));
  };

  return (
    <ScrollArea className="size-full overflow-auto pr-6">
      {renderUserCards()}
    </ScrollArea>
  );
};

export default AllUsersContainer;
