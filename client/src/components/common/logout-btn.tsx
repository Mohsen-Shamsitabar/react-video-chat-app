import { useActiveUser } from "@client/providers/active-user-provider.tsx";
import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.tsx";

const LogOutButton = () => {
  const { setUsername } = useActiveUser();

  const handleLogOut = () => {
    setUsername(null);
    // Not optimal
    window.location.reload();
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
