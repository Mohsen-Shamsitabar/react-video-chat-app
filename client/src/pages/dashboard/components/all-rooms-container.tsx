import { ScrollArea } from "@client/components/ui/scroll-area.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import type { Room } from "@shared/types.ts";
import * as React from "react";
import RoomCard from "./room-card.tsx";

const AllRoomsContainer = () => {
  const { socket } = useSocket();

  const [rooms, setRooms] = React.useState<Room[]>([]);

  React.useEffect(() => {
    if (!socket) return;

    void (async () => {
      const rooms = await socket.emitWithAck("rooms/fetch");

      setRooms(rooms);
    });

    socket.on("rooms/refresh", (rooms: Room[]) => setRooms(rooms));

    return () => {
      socket.off("rooms/refresh");
    };
  }, [socket]);

  if (!socket) return null;

  const renderRooms = () => {
    return rooms.map(room => (
      <RoomCard
        key={room.id}
        room={room}
      />
    ));
  };

  return (
    <ScrollArea className="size-full overflow-auto flex flex-col pr-6">
      {renderRooms()}
    </ScrollArea>
  );
};

export default AllRoomsContainer;
