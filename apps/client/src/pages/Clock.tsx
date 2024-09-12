import React, { useEffect, useState } from "react";

const MatrixClock = ({ ianaTimezone }:any) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat("en-US", {
        timeZone: ianaTimezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setTime(formattedTime);
    };

    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, [ianaTimezone]);

  return (
    <div className="digital-clock text-2xl font-mono tracking-widest">
      {time}
    </div>
  );
};

export default MatrixClock;