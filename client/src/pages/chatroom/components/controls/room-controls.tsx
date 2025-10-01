import { Button } from "@client/components/ui/button.tsx";
import { CHATROOM_TAB_NAMES } from "@client/lib/constants.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import type { ChatroomTabNames } from "@client/types.ts";
import {
  CircleAlertIcon,
  CogIcon,
  MessageCircleMoreIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";

type Props = {
  setIsTabContentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTabContentOpen: boolean;
  tabValue: ChatroomTabNames;
  setTabValue: React.Dispatch<React.SetStateAction<ChatroomTabNames>>;
};

const RoomControls = (props: Props) => {
  const { setIsTabContentOpen, isTabContentOpen, setTabValue, tabValue } =
    props;

  const [notifCounter, setNotifCounter] = React.useState(0);

  const isNotifCounterActive = React.useMemo(() => {
    return !isTabContentOpen || (isTabContentOpen && tabValue !== "CHAT");
  }, [isTabContentOpen, tabValue]);

  const { socket } = useSocket();

  React.useEffect(() => {
    if (!isNotifCounterActive) return;
    if (!socket) return;

    const notifHandler = () => setNotifCounter(c => c + 1);

    // socket is also listening to this event name on another component!
    socket.on("room/message/send", notifHandler);

    return () => {
      socket.off("room/message/send", notifHandler);
    };
  }, [isNotifCounterActive]);

  const renderNotifCounter = () => {
    if (notifCounter <= 0) return null;

    return (
      <span className="fixed bottom-0 ml-8 font-light text-xs size-5 rounded-full bg-destructive">
        {notifCounter}
      </span>
    );
  };

  const handleTabClick = (targetTab: ChatroomTabNames) => {
    if (targetTab === "CHAT") {
      setNotifCounter(0);
    }

    if (tabValue === targetTab) {
      setIsTabContentOpen(c => !c);
      return;
    }

    setTabValue(targetTab);

    if (!isTabContentOpen) {
      setIsTabContentOpen(c => !c);
    }
  };

  return (
    <div className="flex items-center justify-end gap-x-2">
      <Button
        onClick={() => handleTabClick(CHATROOM_TAB_NAMES.DETAILS)}
        size="icon"
      >
        <CircleAlertIcon className="icon" />
      </Button>

      <Button
        onClick={() => handleTabClick(CHATROOM_TAB_NAMES.USERS)}
        size="icon"
      >
        <UsersIcon className="icon" />
      </Button>

      <Button
        onClick={() => handleTabClick(CHATROOM_TAB_NAMES.CHAT)}
        size="icon"
        className="relative"
      >
        <MessageCircleMoreIcon className="icon" />

        {renderNotifCounter()}
      </Button>

      <Button
        onClick={() => handleTabClick(CHATROOM_TAB_NAMES.HOST_CONTROLS)}
        size="icon"
      >
        <CogIcon className="icon" />
      </Button>
    </div>
  );
};

export default RoomControls;
