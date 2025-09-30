import { useActiveUser } from "@client/providers/active-user-provider.tsx";
import { usePeer } from "@client/providers/peer-provider.tsx";
import { useRoom } from "@client/providers/room-provider.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { type UserData } from "@shared/types.ts";
import { type DataConnection } from "peerjs";
import * as React from "react";

type ConnectionData = {
  type: "toggle-audio" | "toggle-video";
  state: boolean;
};

type Props = {
  isMicOn: boolean;
  isVideoOn: boolean;
  isScreenShareOn: boolean;
  mediaStream: MediaStream;
  connectedUsersData: UserData[];
};

const VideoSection = (props: Props) => {
  const {
    isMicOn,
    isScreenShareOn,
    isVideoOn,
    mediaStream,
    connectedUsersData,
  } = props;

  const { socket } = useSocket();
  const { peer } = usePeer();
  const room = useRoom();

  const { username: activeUsername } = useActiveUser();

  const [connection, setConnection] = React.useState<null | DataConnection>(
    null,
  );

  const [partnerMediaStream, setPartnerMediaStream] =
    React.useState<null | MediaStream>(null);

  const [isPartnerVideoMuted, setIsPartnerVideoMuted] = React.useState(false);
  const [isPartnerAudioMuted, setIsPartnerAudioMuted] = React.useState(false);

  const myVideoRef = React.useRef<HTMLVideoElement>(null);
  const partnerVideoRef = React.useRef<HTMLVideoElement>(null);

  // ONLY WORKS IN ROOMS WITH THE SIZE OF 2!
  const partnerUserData = connectedUsersData.filter(
    userData => userData.username !== activeUsername,
  )[0];

  React.useEffect(() => {
    if (!myVideoRef.current) return;

    myVideoRef.current.srcObject = mediaStream;

    return () => {};
  }, [mediaStream, isVideoOn, isScreenShareOn, isMicOn]);

  React.useEffect(() => {
    if (!partnerVideoRef.current) return;
    if (!partnerMediaStream) return;

    partnerVideoRef.current.srcObject = partnerMediaStream;
  }, [partnerMediaStream, isPartnerVideoMuted, isPartnerAudioMuted]);

  React.useEffect(() => {
    if (!peer) return;
    if (!socket) return;

    peer.on("connection", connection => setConnection(connection));
    peer.on("call", call => {
      call.answer(mediaStream);

      call.on("stream", stream => setPartnerMediaStream(stream));
    });

    if (connectedUsersData.length === 2) {
      if (!partnerUserData) return;
      if (!partnerUserData.peerId) return;

      const newConnection = peer.connect(partnerUserData.peerId);

      setConnection(newConnection);

      const call = peer.call(partnerUserData.peerId, mediaStream);

      call.on("stream", stream => setPartnerMediaStream(stream));
    }

    return () => {
      peer.off("connection");
      peer.off("call");
      connection?.close();
    };
  }, [mediaStream]);

  React.useEffect(() => {
    if (!connection) return;

    void (async () => {
      const micData: ConnectionData = {
        type: "toggle-audio",
        state: !isMicOn,
      };

      await connection.send(micData);
    })();
  }, [isMicOn, connection]);

  React.useEffect(() => {
    if (!connection) return;

    void (async () => {
      const videoData: ConnectionData = {
        type: "toggle-video",
        state: !isVideoOn,
      };

      await connection.send(videoData);
    })();
  }, [isVideoOn, connection]);

  React.useEffect(() => {
    if (!connection) return;

    const handleData = (data: ConnectionData) => {
      if (data.type === "toggle-audio") {
        setIsPartnerAudioMuted(data.state);
      } else if (data.type === "toggle-video") {
        setIsPartnerVideoMuted(data.state);
      }
    };

    connection.on("data", handleData as () => void);

    return () => {
      connection.off("data", handleData as () => void);
    };
  }, [connection]);

  if (!peer) return null;
  if (!socket) return null;
  if (!activeUsername) return null;

  const renderSelfVideo = () => {
    return (
      <div className="relative bg-black rounded-lg shadow-lg overflow-hidden">
        <video
          ref={myVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-auto"
        />

        <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
          You ({activeUsername})
        </p>

        {!isVideoOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-lg">
            Camera Off
          </div>
        )}

        {!isMicOn && (
          <p className="absolute bottom-2 right-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            Mic Off
          </p>
        )}
      </div>
    );
  };

  const renderPartnerVideo = () => {
    if (!partnerUserData) return null;

    return (
      <div className="relative bg-black rounded-lg shadow-lg overflow-hidden">
        <video
          ref={partnerVideoRef}
          autoPlay
          playsInline
          className="w-full h-auto"
        />

        <p className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
          {partnerUserData.username}
        </p>

        {isPartnerVideoMuted && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-lg">
            Camera Off
          </div>
        )}

        {isPartnerAudioMuted && (
          <p className="absolute bottom-2 right-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            Mic Off
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="size-full">
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        {renderSelfVideo()}

        {renderPartnerVideo()}
      </div>
    </div>
  );
};

export default VideoSection;
