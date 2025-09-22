import { Button } from "@client/components/ui/button.tsx";
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

type Props = {
  isMicOn: boolean;
  isVideoOn: boolean;
  isScreenShareOn: boolean;

  handleMicClick: () => void;
  handleVideoClick: () => void;
  handleScreenShareClick: () => void;
  handleLeaveRoomClick: () => void;
};

const UserControls = (props: Props) => {
  const {
    isMicOn,
    isVideoOn,
    isScreenShareOn,
    handleMicClick,
    handleVideoClick,
    handleScreenShareClick,
    handleLeaveRoomClick,
  } = props;

  const { socket } = useSocket();

  if (!socket) return null;

  const handleUserSettingsClick = () => {
    return;
  };

  //==========RENDER==========//

  const renderMicIcon = () => {
    if (isMicOn) return <MicIcon className="icon" />;

    return <MicOffIcon className="size-fit stroke-destructive" />;
  };

  const renderVideoIcon = () => {
    if (isVideoOn) return <VideoIcon className="icon" />;

    return <VideoOffIcon className="size-fit stroke-destructive" />;
  };

  const renderScreenShareIcon = () => {
    if (isScreenShareOn) return <ScreenShareIcon className="icon" />;

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
        <EllipsisVerticalIcon className="icon" />
      </Button>

      <Button
        size="icon"
        variant="destructive"
        className="hover:bg-red-500!"
        onClick={handleLeaveRoomClick}
      >
        <PhoneOffIcon className="icon" />
      </Button>
    </div>
  );
};

export default UserControls;
