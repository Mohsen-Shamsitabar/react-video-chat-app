import { Button } from "@client/components/ui/button.tsx";
import { XIcon } from "lucide-react";

type Props = {
  setIsTabContentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

const ContentHeader = (props: Props) => {
  const { setIsTabContentOpen, title } = props;

  return (
    <div className="flex items-center justify-between overflow-hidden text-nowrap border-b-2 px-4 py-1">
      <span className="text-xl font-semibold">{title}</span>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsTabContentOpen(c => !c)}
      >
        <XIcon className="icon" />
      </Button>
    </div>
  );
};

export default ContentHeader;
