import { useEffect, useState } from "react";

function CountdownToHarvest({ harvestDurationHours = 1, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedHarvestTime = localStorage.getItem("harvest-time");
    const currentTime = Date.now();

    if (storedHarvestTime) {
      const harvestTime =
        parseInt(storedHarvestTime) + harvestDurationHours * 60 * 60 * 1000;
      return Math.max(0, Math.floor((harvestTime - currentTime) / 1000));
    }
    return harvestDurationHours * 60 * 60;
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      localStorage.removeItem("harvest-time");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);


  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="absolute left-1/2 bottom-28 -translate-x-1/2 flex flex-col items-center space-y-2">
      <div className="text-3xl font-bold text-green-800 px-8 py-2 rounded-xl shadow-lg">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
}

export default CountdownToHarvest;
