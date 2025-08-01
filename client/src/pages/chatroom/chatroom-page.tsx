import { useLoginStatus } from "@client/lib/hooks.ts";
import type { ChatroomParams } from "@client/types.ts";
import * as React from "react";
import { useNavigate, useParams } from "react-router";

const ChatroomPage = () => {
  const { roomName } = useParams<ChatroomParams>();

  const { isLogged, user } = useLoginStatus();

  const navigate = useNavigate();

  React.useEffect(() => {}, []);

  return <div>{`Room name: ${roomName}`}</div>;
};

export default ChatroomPage;
