import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { HEADER_HEIGHT } from "@client/lib/css-constants.ts";
import { useLoginStatus } from "@client/lib/hooks.ts";
import { cn } from "@client/lib/utils.ts";
import * as React from "react";
import { useLocation } from "react-router";
import { LogOutButton, ThemeToggler } from "./index.ts";

const Header = () => {
  const { pathname } = useLocation();
  const { isLogged } = useLoginStatus();

  const [context, setContext] = React.useState("");

  React.useEffect(() => {
    if (pathname.includes(PAGE_ROUTES.DASHBOARD)) {
      setContext("dashboard");
      return;
    }

    if (pathname.includes(PAGE_ROUTES.CHATROOM)) {
      setContext(`chatroom`);
      return;
    }

    setContext("");
  }, [pathname]);

  const renderLogOutBtn = () => {
    if (!isLogged) return null;

    return <LogOutButton />;
  };

  return (
    <header className={cn("!flex items-center border-b-2 py-1", HEADER_HEIGHT)}>
      <nav className="main-container flex justify-center items-center w-full">
        <div className="w-1/3 flex justify-start">{renderLogOutBtn()}</div>

        <div className="w-1/3 flex justify-center items-center">
          <h2>{context}</h2>
        </div>

        <div className="w-1/3 flex justify-end">
          <ThemeToggler />
        </div>
      </nav>
    </header>
  );
};

export default Header;
