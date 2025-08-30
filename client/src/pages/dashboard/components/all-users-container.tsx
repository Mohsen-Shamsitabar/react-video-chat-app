import { ScrollArea } from "@client/components/ui/scroll-area.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { type UserData } from "@shared/types.ts";
import * as React from "react";
import { UserCard } from "../../../components/common/index.ts";

const AllUsersContainer = () => {
  const { socket } = useSocket();

  const [allUsers, setAllUsers] = React.useState<UserData[]>([]);

  React.useEffect(() => {
    if (!socket) return;

    void (async () => {
      const users = await socket.emitWithAck("users/fetch", undefined);

      setAllUsers(users);
    })();

    socket.on("users/refresh", (users: UserData[]) => {
      setAllUsers(users);
    });

    return () => {
      socket.off("users/refresh");
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
    <ScrollArea className="size-full overflow-y-scroll overflow-x-hidden">
      {renderUserCards()}
    </ScrollArea>
  );
};

export default AllUsersContainer;
