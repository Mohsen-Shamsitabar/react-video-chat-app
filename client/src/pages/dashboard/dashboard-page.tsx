import { Button } from "@client/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@client/components/ui/dialog.tsx";
import { Separator } from "@client/components/ui/separator.tsx";
import { MAIN_HEIGHT } from "@client/lib/css-constants.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import * as React from "react";
import AllRoomsContainer from "./components/all-rooms-container.tsx";
import AllUsersContainer from "./components/all-users-container.tsx";
import NewRoomForm from "./components/new-room-form.tsx";

const DashboardPage = () => {
  const dialogTriggerRef = React.useRef<null | HTMLButtonElement>(null);

  const { socket } = useSocket();

  const handleCreateRoom = () => {
    const { current: dialogTrigger } = dialogTriggerRef;

    if (!dialogTrigger) return;

    dialogTrigger.click();
  };

  if (!socket) return null;

  return (
    <main className={MAIN_HEIGHT}>
      <Dialog>
        <DialogTrigger
          ref={dialogTriggerRef}
          className="hidden"
        ></DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create room</DialogTitle>

            <DialogDescription>
              Fill the form below to create a new room for you and your friends
              to chat in.
            </DialogDescription>

            <NewRoomForm />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="main-container flex size-full py-12">
        <section className="w-1/4 h-full flex flex-col">
          <h3 className="mb-6 shrink-0 h-9">Online users:</h3>

          <AllUsersContainer />
        </section>

        <Separator
          orientation="vertical"
          className="mr-6"
        />

        <section className="w-3/4 h-full flex flex-col">
          <div className="flex mb-6 justify-between shrink-0 h-9">
            <h3>Rooms:</h3>

            <Button onClick={handleCreateRoom}>Create new room</Button>
          </div>

          <AllRoomsContainer />
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
