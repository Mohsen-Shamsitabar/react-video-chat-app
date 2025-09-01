import { Button } from "@client/components/ui/button.tsx";
import { Input } from "@client/components/ui/input.tsx";
import { SendIcon } from "lucide-react";
import ContentHeader from "./content-header.tsx";

type Props = {
  handleTabContentOpen: () => void;
};

const ChatContentTexts = () => {
  return (
    <div className="w-full">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio, velit
      commodi, quidem ex debitis, cumque nam veniam doloremque vero tempore hic.
      Impedit temporibus consectetur voluptatibus incidunt dignissimos
      recusandae porro error. Lorem ipsum dolor sit amet consectetur,
      adipisicing elit. Optio, velit commodi, quidem ex debitis, cumque nam
      veniam doloremque vero tempore hic. Impedit temporibus consectetur
      voluptatibus incidunt dignissimos recusandae porro error. Lorem ipsum
      dolor sit amet consectetur, adipisicing elit. Optio, velit commodi, quidem
      ex debitis, cumque nam veniam doloremque vero tempore hic. Impedit
      temporibus consectetur voluptatibus incidunt dignissimos recusandae porro
      error. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio,
      velit commodi, quidem ex debitis, cumque nam veniam doloremque vero
      tempore hic. Impedit temporibus consectetur voluptatibus incidunt
      dignissimos recusandae porro error. Lorem ipsum dolor sit amet
      consectetur, adipisicing elit. Optio, velit commodi, quidem ex debitis,
      cumque nam veniam doloremque vero tempore hic. Impedit temporibus
      consectetur voluptatibus incidunt dignissimos recusandae porro error.
      veniam doloremque vero tempore hic. Impedit temporibus consectetur
      voluptatibus incidunt dignissimos recusandae porro error. Lorem ipsum
      dolor sit amet consectetur, adipisicing elit. Optio, velit commodi, quidem
      ex debitis, cumque nam veniam doloremque vero tempore hic.
    </div>
  );
};

const ChatContentInput = () => {
  return (
    <div className="flex items-center">
      <Input />

      <Button size="icon">
        <SendIcon className="icon" />
      </Button>
    </div>
  );
};

const ChatContent = (props: Props) => {
  const { handleTabContentOpen } = props;

  return (
    <div className="flex flex-col p-4 size-full overflow-scroll">
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
