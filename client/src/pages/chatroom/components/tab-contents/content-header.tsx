import { Button } from "@client/components/ui/button.tsx";
import { XIcon } from "lucide-react";

type Props = {
  handleTabContentOpen: () => void;
  title: string;
};

const ContentHeader = (props: Props) => {
  const { handleTabContentOpen, title } = props;

  return (
    <div className="flex items-center justify-between mb-4 overflow-hidden text-nowrap">
      <span className="text-xl font-semibold">{title}</span>

      <Button
        size="icon"
        variant="ghost"
        onClick={handleTabContentOpen}
      >
        <XIcon className="size-fit" />
      </Button>
    </div>
  );
};

export default ContentHeader;
