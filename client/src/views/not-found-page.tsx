import { Button } from "@/components/ui/button.tsx";
import { ROUTES } from "@/lib/constants.ts";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBtnclick = () => {
    navigate(ROUTES.HOMEPAGE);
  };

  return (
    <main className="!flex flex-col justify-center items-center">
      <h1 className="font-bold !text-8xl">Oops!</h1>

      <p className="font-semibold">404 - PAGE NOT FOUND</p>

      <p className="my-6 text-wrap text-center">
        The page you are looking for might have been removed, had its name
        changed or is temporairly unavailable.
      </p>

      <Button
        className="cursor-pointer"
        onClick={handleBtnclick}
      >
        GO TO HOMEPAGE
      </Button>
    </main>
  );
};

export default NotFoundPage;
