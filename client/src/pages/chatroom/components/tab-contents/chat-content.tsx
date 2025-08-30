import ContentHeader from "./content-header.tsx";

type Props = {
  handleTabContentOpen: () => void;
};

const ChatContent = (props: Props) => {
  const { handleTabContentOpen } = props;

  return (
    <div className="flex flex-col p-4">
      <ContentHeader
        title="Room messages"
        handleTabContentOpen={handleTabContentOpen}
      />

      <div>RENDER MESSAGES BOX</div>

      <div>RENDER MESSAGE INPUT</div>
    </div>
  );
};

export default ChatContent;
