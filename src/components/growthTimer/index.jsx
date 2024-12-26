import { claimPoint, setTimeCountDown } from "@/utils/authServices";
import { useEffect, useState } from "react";

const PopupThongBao = ({ hienThi, dongLai, points }) => {
  if (!hienThi) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-fadeIn">
        <div className="text-center">
          <img
            src="/assets/images/tree-coin.png"
            alt="Hình quả"
            className="w-20 h-20 mx-auto mb-4 animate-bounce"
          />
          <h2 className="text-3xl font-bold text-green-600 mb-2">Chúc mừng!</h2>
          <p className="text-gray-700 text-xl mb-6">
            Bạn đã nhận được{" "}
            <span className="text-yellow-500 font-bold">+{points} PTC</span>
          </p>
          <button
            onClick={dongLai}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

function CountdownToHarvest({
  time_countdown,
  watering,
  onComplete,
  isClaimed,
  setIsClaimed,
  points,
  onClaimSuccess
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
    if (timeLeft <= 0 && watering === true && !isCompleted && !isClaimed) {
      setIsCompleted(true);
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 1);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, watering, isCompleted, isClaimed, onComplete]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClaim = async () => {
    console.log(`Claimed ${points} points!`);
    const token = JSON.parse(localStorage.getItem("tokenGoogle"));
    try {
      await setTimeCountDown(token, false);
      await claimPoint(token, points);
      setIsClaimed(true); 
      onClaimSuccess(true);
      setIsCompleted(false)
    } catch (error) {
      console.log(error);
    }
  };

  // if (isClaimed) {
  //   return null;
  // }

  return (
    <div className="absolute left-1/2 bottom-28 -translate-x-1/2 flex flex-col items-center space-y-4 w-64">

      {!isCompleted ? (
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
        <div className="relative flex flex-col items-center space-y-4 w-96">
          <img
            src="/assets/images/point-coin.png"
            alt="Point Coin"
            className="absolute -top-96 w-full animate-float"
          />
          <button
            onClick={handleClaim}
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-transform transform hover:scale-105 shadow-lg"
          >
            Claim Reward
          </button>
        </div>
      )}
    </div>
  );
}

export default CountdownToHarvest;
