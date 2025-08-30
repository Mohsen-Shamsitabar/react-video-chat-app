import { Button } from "@client/components/ui/button.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { useRoom } from "@client/providers/room-provider.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import {
  EllipsisVerticalIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  ScreenShareIcon,
  ScreenShareOffIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router";

const UserControls = () => {
  const room = useRoom();

  const [isMicOn, setIsMicOn] = React.useState(false);
  const [isVideoOn, setIsVideoOn] = React.useState(false);
  const [isScreenShareOn, setIsScreenShareOn] = React.useState(false);

  const { socket } = useSocket();

  const navigate = useNavigate();

  if (!room) return null;
  if (!socket) return null;

  const handleMicClick = () => {
    setIsMicOn(c => !c);

    return;
  };

  const handleVideoClick = () => {
    setIsVideoOn(c => !c);

    return;
  };

  const handleScreenShareClick = () => {
    setIsScreenShareOn(c => !c);

    return;
  };

  const handleUserSettingsClick = () => {
    return;
  };

  const handleLeaveRoomClick = () => {
    socket.emit("room/leave", room.id);
    void navigate(PAGE_ROUTES.DASHBOARD);
  };

  const renderMicIcon = () => {
    if (isMicOn) return <MicIcon className="size-fit" />;

    return <MicOffIcon className="size-fit stroke-destructive" />;
  };

  const renderVideoIcon = () => {
    if (isVideoOn) return <VideoIcon className="size-fit" />;

    return <VideoOffIcon className="size-fit stroke-destructive" />;
  };

  const renderScreenShareIcon = () => {
    if (isScreenShareOn) return <ScreenShareIcon className="size-fit" />;

    return <ScreenShareOffIcon className="size-fit stroke-destructive" />;
  };

  return (
    <div className="flex justify-center items-center gap-x-2">
      <Button
        size="icon"
        variant="default"
        onClick={handleMicClick}
      >
        {renderMicIcon()}
      </Button>

      <Button
        size="icon"
        variant="default"
        onClick={handleVideoClick}
      >
        {renderVideoIcon()}
      </Button>

      <Button
        size="icon"
        variant="default"
        onClick={handleScreenShareClick}
      >
        {renderScreenShareIcon()}
      </Button>

      <Button
        size="icon"
        variant="default"
        onClick={handleUserSettingsClick}
      >
        <EllipsisVerticalIcon className="size-fit" />
      </Button>

      <Button
        size="icon"
        variant="destructive"
        className="hover:bg-red-500!"
        onClick={handleLeaveRoomClick}
      >
        <PhoneOffIcon className="size-fit" />
      </Button>
    </div>
  );
};

export default UserControls;
