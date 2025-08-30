import { Button } from "@client/components/ui/button.tsx";
import { CHATROOM_TAB_NAMES } from "@client/lib/constants.ts";
import type { ChatroomTabNames } from "@client/types.ts";
import {
  CircleAlertIcon,
  CogIcon,
  MessageCircleMoreIcon,
  UsersIcon,
} from "lucide-react";

type Props = {
  handleTabContentOpen: () => void;
  isTabContentOpenRef: React.RefObject<boolean>;
  tabValue: ChatroomTabNames;
  setTabValue: React.Dispatch<React.SetStateAction<ChatroomTabNames>>;
};

const RoomControls = (props: Props) => {
  const { handleTabContentOpen, isTabContentOpenRef, setTabValue, tabValue } =
    props;

  const handleTabClick = (targetTab: ChatroomTabNames) => {
    if (tabValue === targetTab) {
      handleTabContentOpen();
      return;
    }

    setTabValue(targetTab);

    if (!isTabContentOpenRef.current) {
      handleTabContentOpen();
    }
  };

  return (
    <div className="flex items-center justify-end gap-x-2">
      <Button
        onClick={() => handleTabClick(CHATROOM_TAB_NAMES.DETAILS)}
        size="icon"
      >
        <CircleAlertIcon className="size-fit" />
      </Button>

      <Button
        onClick={() => handleTabClick(CHATROOM_TAB_NAMES.USERS)}
        size="icon"
      >
        <UsersIcon className="size-fit" />
      </Button>

      <Button
        onClick={() => handleTabClick(CHATROOM_TAB_NAMES.CHAT)}
        size="icon"
      >
        <MessageCircleMoreIcon className="size-fit" />
      </Button>

      <Button
        onClick={() => handleTabClick(CHATROOM_TAB_NAMES.HOST_CONTROLS)}
        size="icon"
      >
        <CogIcon className="size-fit" />
      </Button>
    </div>
  );
};

export default RoomControls;
