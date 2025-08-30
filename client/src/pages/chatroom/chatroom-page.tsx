import NotFoundPage from "@client/components/common/not-found-page.tsx";
import { Button } from "@client/components/ui/button.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@client/components/ui/tabs.tsx";
import { CHATROOM_TAB_NAMES } from "@client/lib/constants.ts";
import {
  CHATROOM_CONTENT_HEIGHT,
  CHATROOM_FOOTER_HEIGHT,
  MAIN_HEIGHT,
} from "@client/lib/css-constants.ts";
import { cn } from "@client/lib/utils.ts";
import { useSocket } from "@client/providers/socket-provider.tsx";
import type { ChatroomParams, ChatroomTabNames } from "@client/types.ts";
import { type Room } from "@shared/types.ts";
import { ClipboardCopyIcon, XIcon } from "lucide-react";
import * as React from "react";
import { useParams } from "react-router";
import RoomControls from "./components/room-controls.tsx";
import RoomInfo from "./components/room-info.tsx";
import UserControls from "./components/user-controls.tsx";

const ChatroomPage = () => {
  // How to know if room exists?
  const { roomId } = useParams<ChatroomParams>();

  const [room, setRoom] = React.useState<Room | null>(null);
  const [tabValue, setTabValue] = React.useState<ChatroomTabNames>(
    CHATROOM_TAB_NAMES.DETAILS,
  );

  const tabContentElementRef = React.useRef<null | HTMLDivElement>(null);
  const isTabContentOpenRef = React.useRef<boolean>(false);

  const { socket } = useSocket();

  React.useEffect(() => {
    if (!socket) return;
    if (!roomId) return;

    void (async () => {
      const room = await socket.emitWithAck("room/fetch", roomId);

      setRoom(room);
    })();
  }, []);

  if (!socket) return null;
  if (!room) return <NotFoundPage />;

  // This might need fixin
  const handleTabContentOpen = () => {
    const { current: tabContentElement } = tabContentElementRef;

    if (!tabContentElement) return;

    if (!isTabContentOpenRef.current) {
      tabContentElement.style.width = "360px";
      isTabContentOpenRef.current = !isTabContentOpenRef.current;

      return;
    }

    tabContentElement.style.width = "0px";
    isTabContentOpenRef.current = !isTabContentOpenRef.current;
  };

  return (
    <main className={MAIN_HEIGHT}>
      <div className="size-full flex flex-col overflow-hidden flex-nowrap text-nowrap">
        <section className={cn(CHATROOM_CONTENT_HEIGHT, "flex size-full")}>
          <div className="bg-red-800 h-full w-full transition-size"></div>

          <div>
            <Tabs
              ref={tabContentElementRef}
              className={"bg-emerald-800 h-full shrink-0 transition-size"}
              style={{ width: "0px" }}
              value={tabValue}
              onValueChange={setTabValue}
            >
              <TabsList className="hidden">
                <TabsTrigger value={CHATROOM_TAB_NAMES.DETAILS}></TabsTrigger>

                <TabsTrigger value={CHATROOM_TAB_NAMES.USERS}></TabsTrigger>

                <TabsTrigger value={CHATROOM_TAB_NAMES.CHAT}></TabsTrigger>

                <TabsTrigger
                  value={CHATROOM_TAB_NAMES.HOST_CONTROLS}
                ></TabsTrigger>
              </TabsList>

              {/* ================== */}

              <TabsContent value={CHATROOM_TAB_NAMES.DETAILS}>
                <div className="flex flex-col p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span>Meeting details</span>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleTabContentOpen}
                    >
                      <XIcon className="size-fit" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p>Joining info</p>

                    <p>https://meet.google.com/jph-hkne-cdo</p>

                    <Button>
                      <ClipboardCopyIcon />
                      <span>Copy joining info</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value={CHATROOM_TAB_NAMES.USERS}>
                <div className="flex flex-col p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span>Connected users</span>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleTabContentOpen}
                    >
                      <XIcon className="size-fit" />
                    </Button>
                  </div>

                  <div>RENDER CONNECTED USER CARDS</div>
                </div>
              </TabsContent>

              <TabsContent value={CHATROOM_TAB_NAMES.CHAT}>
                <div className="flex flex-col p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span>in-call messages</span>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleTabContentOpen}
                    >
                      <XIcon className="size-fit" />
                    </Button>
                  </div>

                  <div>RENDER MESSAGES BOX</div>

                  <div>RENDER MESSAGE INPUT</div>
                </div>
              </TabsContent>

              <TabsContent value={CHATROOM_TAB_NAMES.HOST_CONTROLS}>
                <div className="flex flex-col p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span>Host Controls</span>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleTabContentOpen}
                    >
                      <XIcon className="size-fit" />
                    </Button>
                  </div>

                  <span className="text-wrap h-20">
                    Use these host settings to keep control of your meeting.
                    Only hosts have access to these controls.
                  </span>

                  <h1 className="text-wrap">WE MIGHT NOT NEED THIS!</h1>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section
          className={cn(
            CHATROOM_FOOTER_HEIGHT,
            "main-container flex items-center bg-blue-800",
          )}
        >
          <div className="w-1/3">
            <RoomInfo room={room} />
          </div>

          <div className="w-1/3">
            <UserControls room={room} />
          </div>

          <div className="w-1/3">
            <RoomControls
              isTabContentOpenRef={isTabContentOpenRef}
              handleTabContentOpen={handleTabContentOpen}
              setTabValue={setTabValue}
              tabValue={tabValue}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default ChatroomPage;
