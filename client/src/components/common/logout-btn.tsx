import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.tsx";

const LogOutButton = () => {
  const handleLogOut = () => {
    return;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="h-6 w-6"
          variant="outline"
          size="icon"
          onClick={handleLogOut}
        >
          <LogOutIcon className="h-5 w-5 rotate-0 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent>Logout</TooltipContent>
    </Tooltip>
  );
};

export default LogOutButton;
