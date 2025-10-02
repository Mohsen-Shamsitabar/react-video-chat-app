import { cn } from "@client/lib/utils.ts";
import classes from "./style.module.css";

type Props = {
  size?: number;
  className?: string;
};

const LoadingRing = ({ size = 32, className }: Props) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("stroke-primary", classes["spinner_V8m1"], className)}
    >
      <g>
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill="none"
          strokeWidth="3"
        ></circle>
      </g>
    </svg>
  );
};

export default LoadingRing;
