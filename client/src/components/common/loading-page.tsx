import { MAIN_HEIGHT } from "@client/lib/css-constants.ts";
import { cn } from "@client/lib/utils.ts";
import LoadingRing from "./loading-ring/loading-ring.tsx";

const LoadingPage = () => {
  return (
    <main className={cn("!flex flex-col items-center", MAIN_HEIGHT)}>
      <div className="main-container size-full flex flex-col justify-center items-center">
        <LoadingRing size={64} />
      </div>
    </main>
  );
};

export default LoadingPage;
