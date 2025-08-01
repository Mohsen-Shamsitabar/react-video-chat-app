import { Button } from "@client/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@client/components/ui/dialog.tsx";
import { ScrollArea } from "@client/components/ui/scroll-area.tsx";
import { Separator } from "@client/components/ui/separator.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { MAIN_HEIGHT } from "@client/lib/css-constants.ts";
import { useLoginStatus } from "@client/lib/hooks.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { NETWORK, SOCKET_CHANNELS } from "@shared/constants.ts";
import * as React from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import AllUsersContainer from "./components/all-users-container.tsx";
import NewRoomForm from "./components/new-room-form.tsx";

const DashboardPage = () => {
  // what happens when we get redirected to this page again?
  // will this WHOLE block get executed ?

  const { isLogged, user } = useLoginStatus();

  const { socket: currentSocket, setSocket } = useSocket();

  const dialogTriggerRef = React.useRef<null | HTMLButtonElement>(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLogged) {
      void navigate(PAGE_ROUTES.HOMEPAGE);
      return;
    }

    //=== SOCKET ===//

    const socket = io(NETWORK.SERVER_URL);

    socket.on("connect", () => {
      console.log(`SOCKET:${socket.id} connected!`);

      socket.emit(SOCKET_CHANNELS.LOGIN, user);

      setSocket(socket);
    });

    return () => {
      socket.off("connect");

      setSocket(null);
    };
  }, [isLogged]);

  if (!isLogged || !currentSocket) return null;

  const handleCreateRoom = () => {
    const { current: dialogTrigger } = dialogTriggerRef;

    if (!dialogTrigger) return;

    dialogTrigger.click();
  };

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
          <h3 className="mb-6">Online users:</h3>

          <AllUsersContainer />
        </section>

        <Separator
          orientation="vertical"
          className="mr-6"
        />

        <section className="w-3/4 h-full flex flex-col">
          <div className="flex mb-6 justify-between">
            <h3>Rooms:</h3>

            <Button onClick={handleCreateRoom}>Create new room</Button>
          </div>

          <ScrollArea className="size-full overflow-auto pr-6"></ScrollArea>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
