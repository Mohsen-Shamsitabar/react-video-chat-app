import moment from "moment";
import * as React from "react";

const TimeDisplayer = () => {
  const [time, setTime] = React.useState(() => moment().format("h:mm A"));

  React.useEffect(() => {
    // Find a better way.
    const interval = setInterval(() => {
      setTime(moment().format("h:mm A"));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <span>{time}</span>
    </div>
  );
};

export default TimeDisplayer;
