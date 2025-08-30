import { LoadingPage, NotFoundPage } from "@client/components/common/index.ts";
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
import { RoomProvider } from "@client/providers/room-provider.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import type { ChatroomParams, ChatroomTabNames } from "@client/types.ts";
import { type Room } from "@shared/types.ts";
import * as React from "react";
import { useParams } from "react-router";
import RoomControls from "./components/controls/room-controls.tsx";
import RoomInfo from "./components/controls/room-info.tsx";
import UserControls from "./components/controls/user-controls.tsx";
import ChatContent from "./components/tab-contents/chat-content.tsx";
import DetailsContent from "./components/tab-contents/details-content.tsx";
import HostContent from "./components/tab-contents/host-content.tsx";
import UsersContent from "./components/tab-contents/users-content.tsx";

const ChatroomPage = () => {
  // How to know if room exists?
  const { roomId } = useParams<ChatroomParams>();

  const [room, setRoom] = React.useState<Room | null | undefined>(undefined);
  const [tabValue, setTabValue] = React.useState<ChatroomTabNames>(
    CHATROOM_TAB_NAMES.DETAILS,
  );

  const tabContentElementRef = React.useRef<null | HTMLDivElement>(null);
  const isTabContentOpenRef = React.useRef<boolean>(false);

  const { socket } = useSocket();

  React.useEffect(() => {
    if (!socket) return;
    if (!roomId) {
      setRoom(null);
      return;
    }

    void (async () => {
      const room = await socket.emitWithAck("rooms/fetch", [roomId]);

      setRoom(room[0]);
    })();
  }, []);

  if (!socket) return null;
  if (typeof room === "undefined") return <LoadingPage />;
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
      <RoomProvider room={room}>
        <div className="size-full flex flex-col overflow-hidden">
          <section className={cn(CHATROOM_CONTENT_HEIGHT, "flex size-full")}>
            <div className="bg-red-800 h-full w-full transition-size"></div>

            <Tabs
              ref={tabContentElementRef}
              className={"h-full shrink-0 transition-size"}
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

              <TabsContent
                className="border-l-2 bg-sidebar"
                value={CHATROOM_TAB_NAMES.DETAILS}
              >
                <DetailsContent handleTabContentOpen={handleTabContentOpen} />
              </TabsContent>

              <TabsContent
                className="border-l-2 bg-sidebar"
                value={CHATROOM_TAB_NAMES.USERS}
              >
                <UsersContent handleTabContentOpen={handleTabContentOpen} />
              </TabsContent>

              <TabsContent
                className="border-l-2 bg-sidebar"
                value={CHATROOM_TAB_NAMES.CHAT}
              >
                <ChatContent handleTabContentOpen={handleTabContentOpen} />
              </TabsContent>

              <TabsContent
                className="border-l-2 bg-sidebar"
                value={CHATROOM_TAB_NAMES.HOST_CONTROLS}
              >
                <HostContent handleTabContentOpen={handleTabContentOpen} />
              </TabsContent>
            </Tabs>
          </section>

          <section
            className={cn(
              CHATROOM_FOOTER_HEIGHT,
              "main-container flex items-center border-t-2",
            )}
          >
            <div className="w-1/3">
              <RoomInfo />
            </div>

            <div className="w-1/3">
              <UserControls />
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
      </RoomProvider>
    </main>
  );
};

export default ChatroomPage;
