import { Button } from "@client/components/ui/button.tsx";
import { PAGE_ROUTES } from "@client/lib/constants.ts";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBtnclick = () => {
    void navigate(PAGE_ROUTES.HOMEPAGE);
  };

  return (
    <main className="!flex flex-col items-center">
      <div className="main-container flex flex-col justify-center items-center">
        <h1 className="font-bold !text-8xl">Oops!</h1>

        <p className="font-semibold">404 - PAGE NOT FOUND</p>

        <p className="my-6 text-wrap text-center">
          The page you are looking for might have been removed, had its name
          changed or is temporairly unavailable.
        </p>

        <Button onClick={handleBtnclick}>GO TO HOMEPAGE</Button>
      </div>
    </main>
  );
};

export default NotFoundPage;
