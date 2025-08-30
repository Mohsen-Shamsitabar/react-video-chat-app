import { Button } from "@client/components/ui/button.tsx";
import { NETWORK } from "@shared/constants.ts";
import { ClipboardCopyIcon } from "lucide-react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import ContentHeader from "./content-header.tsx";

type Props = {
  handleTabContentOpen: () => void;
};

const DetailsContent = (props: Props) => {
  const { handleTabContentOpen } = props;

  const location = useLocation();

  const chatroomPathname = `${NETWORK.CLIENT_URL}${location.pathname}`;

  const handleCopyClick = () => {
    void window.navigator.clipboard.writeText(chatroomPathname);
    toast("Page URL copied to clipboard.");
  };

  return (
    <div className="flex flex-col p-4">
      <ContentHeader
        title="Room details"
        handleTabContentOpen={handleTabContentOpen}
      />

      <div className="space-y-2">
        <p>Joining info</p>

        <p className="text-sm">{chatroomPathname}</p>

        <Button onClick={handleCopyClick}>
          <ClipboardCopyIcon />
          <span>Copy joining info</span>
        </Button>
      </div>
    </div>
  );
};

export default DetailsContent;
