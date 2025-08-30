import { TimeDisplayer } from "@client/components/common/index.ts";
import { type Room } from "@shared/types.ts";

type Props = {
  room: Room;
};

const RoomInfo = (props: Props) => {
  const { room } = props;

  return (
    <div className="flex items-center justify-start space-x-6">
      <TimeDisplayer />
      <span>|</span>
      <span>{room.id}</span>
    </div>
  );
};

export default RoomInfo;
