import { TimeDisplayer } from "@client/components/common/index.ts";
import { useRoom } from "@client/providers/room-provider.tsx";

const RoomInfo = () => {
  const room = useRoom();

  if (!room) return null;

  return (
    <div className="flex items-center justify-start space-x-6">
      <TimeDisplayer />
      <span>|</span>
      <span>{room.id}</span>
    </div>
  );
};

export default RoomInfo;
