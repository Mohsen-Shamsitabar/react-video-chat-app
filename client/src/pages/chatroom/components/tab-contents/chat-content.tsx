import ContentHeader from "./content-header.tsx";

type Props = {
  handleTabContentOpen: () => void;
};

const ChatContentTexts = () => {
  return null;
};

const ChatContentInput = () => {
  return null;
};

const ChatContent = (props: Props) => {
  const { handleTabContentOpen } = props;

  return (
    <div className="flex flex-col p-4">
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
