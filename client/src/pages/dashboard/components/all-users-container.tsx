import { ScrollArea } from "@client/components/ui/scroll-area.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { SOCKET_CHANNELS } from "@shared/constants.ts";
import { type UserData } from "@shared/types.ts";
import * as React from "react";
import UserCard from "./user-card.tsx";

const AllUsersContainer = () => {
  const { socket } = useSocket();

  const [allUsers, setAllUsers] = React.useState<UserData[]>([]);

  React.useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_CHANNELS.GET_LOGGED_USERS, (users: UserData[]) => {
      setAllUsers(users);
    });

    return () => {
      socket.off(SOCKET_CHANNELS.GET_LOGGED_USERS);
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
