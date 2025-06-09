import { LucideClockAlert } from "lucide-react"; // or your correct import
import React, { useEffect, useState } from "react";

const TimeUntilMidnight: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // sets time to 00:00:00 of next day

    const diffMs = midnight.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
  };

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeUntilMidnight());
    update();

    const interval = setInterval(update, 60000); // update every 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <LucideClockAlert className="w-4 h-4"/>
      <span className="text-[11px]">{timeLeft.hours} hour{timeLeft.hours !== 1 ? "s" : ""} : {timeLeft.minutes} minute{timeLeft.minutes !== 1 ? "s" : ""} left!</span>
    </div>
  );
};

export default TimeUntilMidnight;
