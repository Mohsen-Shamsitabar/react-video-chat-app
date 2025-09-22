import { LoadingPage, NotFoundPage } from "@client/components/common/index.ts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@client/components/ui/tabs.tsx";
import { CHATROOM_TAB_NAMES, PAGE_ROUTES } from "@client/lib/constants.ts";
import {
  CHATROOM_CONTENT_HEIGHT,
  CHATROOM_FOOTER_HEIGHT,
  MAIN_HEIGHT,
} from "@client/lib/css-constants.ts";
import { cn } from "@client/lib/utils.ts";
import { RoomProvider } from "@client/providers/room-provider.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import type { ChatroomParams, ChatroomTabNames } from "@client/types.ts";
import { type Room, type UserData } from "@shared/types.ts";
import * as React from "react";
import { useNavigate, useParams } from "react-router";
import RoomControls from "./components/controls/room-controls.tsx";
import RoomInfo from "./components/controls/room-info.tsx";
import UserControls from "./components/controls/user-controls.tsx";
import ChatContent from "./components/tab-contents/chat-content.tsx";
import DetailsContent from "./components/tab-contents/details-content.tsx";
import HostContent from "./components/tab-contents/host-content.tsx";
import UsersContent from "./components/tab-contents/users-content.tsx";
import VideoSection from "./components/Video-section.tsx";

const ChatroomPage = () => {
  // How to know if room exists?
  const { roomId } = useParams<ChatroomParams>();

  const [room, setRoom] = React.useState<Room | null | undefined>(undefined);
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isVideoOn, setIsVideoOn] = React.useState(true);
  const [isScreenShareOn, setIsScreenShareOn] = React.useState(false);
  const [tabValue, setTabValue] = React.useState<ChatroomTabNames>(
    CHATROOM_TAB_NAMES.DETAILS,
  );

  const [mediaStream, setMediaStream] = React.useState<null | MediaStream>(
    null,
  );

  const [connectedUsersData, setConnectedUsersData] = React.useState<
    UserData[]
  >([]);

  const tabContentElementRef = React.useRef<null | HTMLDivElement>(null);
  const isTabContentOpenRef = React.useRef<boolean>(false);

  const { socket } = useSocket();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!socket) return;
    if (!roomId) {
      setRoom(null);
      return;
    }

    void (async () => {
      await navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          setMediaStream(stream);
        });
    })();

    void (async () => {
      const room = await socket.emitWithAck("rooms/fetch", [roomId]);

      setRoom(room[0]);
    })();

    void (async () => {
      const users = await socket.emitWithAck("rooms/users/fetch", roomId);

      setConnectedUsersData(users);
    })();

    socket.on("rooms/users/refresh", users => setConnectedUsersData(users));
    socket.on("room/refresh", room => setRoom(room));

    return () => {
      socket.off("room/refresh");
      socket.off("rooms/users/refresh");

      if (!mediaStream) return;
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    };
  }, []);

  if (!socket) return null;
  if (typeof room === "undefined" || !mediaStream) return <LoadingPage />;
  if (!room) return <NotFoundPage />;

  const handleMicClick = () => {
    setIsMicOn(c => !c);

    if (!mediaStream) return;

    mediaStream.getAudioTracks()[0]!.enabled =
      !mediaStream.getAudioTracks()[0]!.enabled;

    return;
  };

  const handleVideoClick = () => {
    setIsVideoOn(!isVideoOn);

    if (!mediaStream) return;

    mediaStream.getVideoTracks().forEach(track => {
      track.enabled = !isVideoOn;
    });

    return;
  };

  const handleScreenShareClick = () => {
    setIsScreenShareOn(c => !c);

    return;
  };

  const handleLeaveRoomClick = () => {
    socket.emit("room/leave", room.id);
    void navigate(PAGE_ROUTES.DASHBOARD);
  };

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
            <div className="h-full w-full transition-size">
              <VideoSection
                isMicOn={isMicOn}
                isVideoOn={isVideoOn}
                isScreenShareOn={isScreenShareOn}
                mediaStream={mediaStream}
                connectedUsersData={connectedUsersData}
              />
            </div>

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
                className="border-l-2 bg-sidebar overflow-hidden"
                value={CHATROOM_TAB_NAMES.DETAILS}
              >
                <DetailsContent handleTabContentOpen={handleTabContentOpen} />
              </TabsContent>

              <TabsContent
                className="border-l-2 bg-sidebar overflow-hidden"
                value={CHATROOM_TAB_NAMES.USERS}
              >
                <UsersContent
                  connectedUsersData={connectedUsersData}
                  handleTabContentOpen={handleTabContentOpen}
                />
              </TabsContent>

              <TabsContent
                className="border-l-2 bg-sidebar overflow-hidden"
                value={CHATROOM_TAB_NAMES.CHAT}
              >
                <ChatContent handleTabContentOpen={handleTabContentOpen} />
              </TabsContent>

              <TabsContent
                className="border-l-2 bg-sidebar overflow-hidden"
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
              <UserControls
                isMicOn={isMicOn}
                isVideoOn={isVideoOn}
                isScreenShareOn={isScreenShareOn}
                handleMicClick={handleMicClick}
                handleVideoClick={handleVideoClick}
                handleScreenShareClick={handleScreenShareClick}
                handleLeaveRoomClick={handleLeaveRoomClick}
              />
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
