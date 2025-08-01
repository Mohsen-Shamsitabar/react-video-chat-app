import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@client/components/ui/avatar.tsx";
import { Card, CardContent } from "@client/components/ui/card.tsx";
import { cn } from "@client/lib/utils.ts";
import { useAppSelector } from "@client/redux/hooks.ts";
import { type UserData } from "@shared/types.ts";
import * as React from "react";

type Props = UserData;

const UserCard = (props: Props) => {
  const { username, status } = props;

  const loggedUser = useAppSelector(state => state.user);

  const isOwnCard = React.useMemo(
    () => loggedUser.username === username,
    [loggedUser],
  );

  const firstChar = React.useMemo(() => username[0]!, [username]);

  return (
    <Card className={cn("p-1 mb-2", isOwnCard ? "border-chart-2" : undefined)}>
      <CardContent className="flex items-center p-1">
        <Avatar className="mr-2">
          <AvatarImage src="/" />
          <AvatarFallback className="">{firstChar}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-center">
          <h5 className="text-sm">{username}</h5>
          <p className="text-xs text-sidebar-accent-foreground">{status}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
