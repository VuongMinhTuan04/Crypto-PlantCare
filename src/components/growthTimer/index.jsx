import { setTimeCountDown } from "@/utils/authServices";
import { useEffect, useState } from "react";

function CountdownToHarvest({
  time_countdown,
  onComplete,
  isClaimed,
  setIsClaimed,
}) {
  const TOTAL_SECONDS = 5 * 60 * 60; // 5 giờ tính bằng giây

  const [timeLeft, setTimeLeft] = useState(() => {
    if (!time_countdown) return 0;

    const currentTime = Date.now();
    const countdownTime = new Date(time_countdown).getTime();
    const remainingTime = Math.max(
      0,
      Math.floor((countdownTime - currentTime) / 1000)
    );

    return remainingTime;
  });

  const [isCompleted, setIsCompleted] = useState(false);

  // Tính phần trăm thời gian còn lại
  const progressPercentage = (timeLeft / TOTAL_SECONDS) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsCompleted(true);
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          setIsCompleted(true);
          onComplete();
        }
        return newTime;
      });
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

  const handleClaim = async () => {
    // Xử lý logic claim ở đây
    const token = JSON.parse(localStorage.getItem("tokenGoogle"));
    try {
      const resp = await setTimeCountDown(token, false);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }

    console.log("Claimed!");
    setIsClaimed(true); // Đánh dấu đã claim
  };

  if (isClaimed) {
    return null; // Nếu đã claim, không hiển thị gì cả
  }

  return (
    <div className="absolute left-1/2 bottom-28 -translate-x-1/2 flex flex-col items-center space-y-4 w-64">
      {!isCompleted ? (
        // Hiển thị progress bar khi chưa hoàn thành
        <div className="w-full bg-gray-200 rounded-xl h-8 overflow-hidden relative">
          <div
            className="h-full bg-green-600 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>
      ) : (
        // Hiển thị nút Claim khi đã hoàn thành
        <button
          onClick={handleClaim}
          className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-colors duration-300 shadow-lg transform hover:scale-105"
        >
          Claim Reward
        </button>
      )}
    </div>
  );
}

export default CountdownToHarvest;
