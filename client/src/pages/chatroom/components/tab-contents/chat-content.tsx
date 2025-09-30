import { Button } from "@client/components/ui/button.tsx";
import { Input } from "@client/components/ui/input.tsx";
import { cn } from "@client/lib/utils.ts";
import { useActiveUser } from "@client/providers/active-user-provider.tsx";
import { useRoom } from "@client/providers/room-provider.tsx";
import { useSocket } from "@client/providers/socket-provider.tsx";
import { type Message } from "@shared/types.ts";
import { generateMessageId } from "@shared/utils.ts";
import { SendIcon } from "lucide-react";
import * as React from "react";
import ContentHeader from "./content-header.tsx";

type MessageContainerProps = {
  message: Message;
};

const MessageContainer = (props: MessageContainerProps) => {
  const { message } = props;

  if (message.from === "server") {
    return (
      <div className="flex items-center">
        <div className="h-[1px] flex-1 bg-border flex items-center justify-center"></div>
        <div className="my-auto w-fit text-center px-2">{message.content}</div>
        <div className="h-[1px] flex-1 bg-border flex items-center justify-center"></div>
      </div>
    );
  }

  const { username: activeUsername } = useActiveUser();

  const isSameAuthor = React.useMemo(() => activeUsername === message.from, []);

  return (
    <div
      className={cn(
        "w-full flex wrap-anywhere",
        isSameAuthor ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex flex-col size-fit bg-accent px-3 py-2",
          isSameAuthor
            ? "rounded-l-lg rounded-br-lg"
            : "rounded-r-lg rounded-bl-lg",
        )}
      >
        <span
          className={cn(
            "text-sm text-chart-3",
            isSameAuthor ? "hidden" : "text-start",
          )}
        >
          {message.from}
        </span>

        <p className="text-base">{message.content}</p>
      </div>
    </div>
  );
};

const ChatContentMessages = () => {
  const { socket } = useSocket();
  const room = useRoom();

  const containerRef = React.useRef<null | HTMLDivElement>(null);

  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (!socket) return;
    if (!room) return;

    void (async () => {
      const fetchedMessages = await socket.emitWithAck(
        "room/messages/fetch",
        room.id,
      );

      setMessages(fetchedMessages);
    })();

    socket.on("room/message/send", message =>
      setMessages(c => [...c, message]),
    );

    return () => {
      socket.off("room/message/send");
    };
  }, []);

  React.useEffect(() => {
    const { current: container } = containerRef;

    if (!container) return;

    container.scroll({ behavior: "smooth", top: 100 * messages.length });
  }, [messages]);

  if (!socket) return null;
  if (!room) return null;

  const renderMessages = () => {
    return messages.map(message => (
      <MessageContainer
        key={message.id}
        message={message}
      />
    ));
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 overflow-y-auto p-4 gap-y-4"
    >
      {renderMessages()}
    </div>
  );
};

const ChatContentInput = () => {
  const { socket } = useSocket();
  const room = useRoom();
  const { username: activeUsername } = useActiveUser();

  const [text, setText] = React.useState("");

  if (!socket) return null;
  if (!room) return null;
  if (!activeUsername) return null;

  const handleMessageChange:
    | React.ChangeEventHandler<HTMLInputElement>
    | undefined = event => {
    const value = event.target.value;

    setText(value);
  };

  const handleSendMessage:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined = event => {
    event.preventDefault();

    const filteredText = text.trim();

    if (filteredText.length <= 0) {
      setText("");
      return;
    }

    const message: Message = {
      id: generateMessageId(),
      from: activeUsername,
      to: room.id,
      content: filteredText,
    };

    socket.emit("message/send", message);
    setText("");
  };

  return (
    <form className="flex items-center px-4 py-1">
      <Input
        className="rounded-r-none"
        value={text}
        onChange={handleMessageChange}
      />

      <Button
        size="icon"
        className="border-l-0 rounded-l-none"
        type="submit"
        onClick={handleSendMessage}
      >
        <SendIcon className="icon" />
      </Button>
    </form>
  );
};

type ChatContentProps = {
  setIsTabContentOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatContent = (props: ChatContentProps) => {
  const { setIsTabContentOpen } = props;

  return (
    <div className="size-full flex flex-col">
      <ContentHeader
        title="Room messages"
        setIsTabContentOpen={setIsTabContentOpen}
      />

      <ChatContentMessages />

      <ChatContentInput />
    </div>
  );
};

export default ChatContent;
