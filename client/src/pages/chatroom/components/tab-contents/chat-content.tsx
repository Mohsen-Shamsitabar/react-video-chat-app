import { Button } from "@client/components/ui/button.tsx";
import { Input } from "@client/components/ui/input.tsx";
import { ScrollArea } from "@client/components/ui/scroll-area.tsx";
import { SendIcon } from "lucide-react";
import ContentHeader from "./content-header.tsx";

type Props = {
  handleTabContentOpen: () => void;
};

const ChatContentTexts = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <ScrollArea>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur,
        dolorum numquam fuga nisi natus modi aliquam sequi molestias! Harum
        voluptates ut quis magnam numquam accusantium, ipsam et exercitationem
        ducimus molestiae! Lorem, ipsum dolor sit amet consectetur adipisicing
        elit. Tenetur, dolorum numquam fuga nisi natus modi aliquam sequi
        molestias! Harum voluptates ut quis magnam numquam accusantium, ipsam et
        exercitationem ducimus molestiae! exercitationem ducimus molestiae!
        exercitationem ducimus molestiae! exercitationem ducimus molestiae!
        exercitationem ducimus molestiae! exercitationem ducimus molestiae!
        exercitationem ducimus molestiae! exercitationem ducimus molestiae!
        exercitationem ducimus molestiae! exercitationem ducimus molestiae!
        exercitationem ducimus molestiae! exercitationem ducimus molestiae!
        exercitationem ducimus molestiae! exercitationem ducimus molestiae!
      </ScrollArea>
    </div>
  );
};

const ChatContentInput = () => {
  return (
    <div className="flex items-center px-4 py-1">
      <Input className="rounded-r-none" />

      <Button
        size="icon"
        className="border-l-0 rounded-l-none"
      >
        <SendIcon className="icon" />
      </Button>
    </div>
  );
};

const ChatContent = (props: Props) => {
  const { handleTabContentOpen } = props;

  return (
    <div className="size-full flex flex-col">
      <ContentHeader
        title="Room messages"
        handleTabContentOpen={handleTabContentOpen}
      />

      <ChatContentTexts />

      <ChatContentInput />
    </div>
  );
};

export default ChatContent;
