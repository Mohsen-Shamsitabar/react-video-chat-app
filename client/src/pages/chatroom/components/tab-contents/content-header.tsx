import { Button } from "@client/components/ui/button.tsx";
import { XIcon } from "lucide-react";

type Props = {
  handleTabContentOpen: () => void;
  title: string;
};

const ContentHeader = (props: Props) => {
  const { handleTabContentOpen, title } = props;

  return (
    <div className="flex items-center justify-between overflow-hidden text-nowrap border-b-2 px-4 py-1">
      <span className="text-xl font-semibold">{title}</span>

      <Button
        size="icon"
        variant="ghost"
        onClick={handleTabContentOpen}
      >
        <XIcon className="icon" />
      </Button>
    </div>
  );
};

export default ContentHeader;
