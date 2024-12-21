import { useEffect, useState } from "react";

function CountdownToHarvest({ harvestDurationHours = 5, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(() => {
      // Lấy thời gian thu hoạch từ localStorage
      const storedHarvestTime = localStorage.getItem("harvest-time");
      const currentTime = Date.now();
  
      if (storedHarvestTime) {
        // Tính thời gian còn lại
        return Math.max(0, Math.floor((storedHarvestTime - currentTime) / 1000));
      } else {
        // Lưu thời gian thu hoạch mới nếu chưa có
        const harvestTime = currentTime + harvestDurationHours * 60 * 60 * 1000;
        localStorage.setItem("harvest-time", harvestTime);
        return harvestDurationHours * 60 * 60;
      }
    });
  
    useEffect(() => {
      if (timeLeft <= 0) {
        // Khi đếm ngược hoàn tất
        onComplete();
        localStorage.removeItem("harvest-time");
        return;
      }
  
      // Cập nhật đồng hồ mỗi giây
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
  
      return () => clearInterval(timer); // Dọn dẹp khi component unmount
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
      <div className="flex flex-col items-center space-y-2">
        <div className="text-3xl font-bold text-green-800 bg-white px-8 py-2 rounded-xl shadow-lg">
          {formatTime(timeLeft)}
        </div>
        <p className="text-sm text-gray-500">Thời gian thu hoạch còn lại</p>
      </div>
    );
  }
  
  export default CountdownToHarvest;