import { updateLevel } from "@/utils/authServices";
import { useEffect, useState } from "react";

const levels = [
  { level: 1, maxExp: 20, points: 5 },
  { level: 2, maxExp: 100, points: 6 },
  { level: 3, maxExp: 200, points: 7 },
  { level: 4, maxExp: 300, points: 8 },
  { level: 5, maxExp: 400, points: 9 },
  { level: 6, maxExp: 500, points: 10 },
  { level: 7, maxExp: 600, points: 11 },
  { level: 8, maxExp: 700, points: 12 },
  { level: 9, maxExp: 800, points: 13 },
  { level: 10, maxExp: 900, points: 14 },
];

const LevelDisplay = ({ userTree, onLevelUp }) => {
  console.log(userTree);
  // Lấy thông tin level hiện tại
  const currentLevel = levels.find(
    (level) => level.level === Number(userTree.level)
  );

  // Lấy thông tin level tiếp theo
  const nextLevel = levels.find((level) => level.level === userTree.level + 1);

  const currentExp = Number(userTree.exp);
  const maxExp = currentLevel?.maxExp || 20;

  // Tính phần trăm tiến độ (giới hạn ở 100%)
  const percentage = Math.min((currentExp / maxExp) * 100, 100);

  const [levelChecked, setLevelChecked] = useState(false);

  useEffect(() => {
    const checkAndUpdateLevel = async () => {
      if (currentExp >= maxExp && !levelChecked) {
        setLevelChecked(true);
        const leveledUp = await checkLevelUp();
        if (leveledUp) {
          onLevelUp(); 
        }
      }
    };

    checkAndUpdateLevel();
    setLevelChecked(false)
  }, [userTree.exp, onLevelUp, levelChecked]); // Đảm bảo thêm `onLevelUp` vào dependencies

  const checkLevelUp = async () => {
    if (currentExp < maxExp) {
      return false; // Không đủ exp để lên level
    }

    const token = JSON.parse(localStorage.getItem("tokenGoogle"));
    if (!token) return false;

    try {
      const response = await updateLevel(token);
      console.log("Level up success:", response);
      return true; // Lên cấp thành công
    } catch (error) {
      console.error("Level up failed:", error);
      return false; // Lên cấp thất bại
    }
  };

  return (
    <div className="relative">
      {/* Hiển thị ảnh level */}
      <div>
        <img
          className="absolute top-12 left-7 w-12 h-12 z-10 bg-white px-1 py-1 rounded-full"
          src="/assets/images/treelevel.png"
          alt="image-level"
        />
        <span className="absolute top-[90px] left-7 text-black z-20 font-montserrat font-bold bg-white text-center w-12 text-[12px] rounded-xl">
          LV {currentLevel?.level || 0}
        </span>
      </div>

      {/* Thanh tiến trình */}
      <div className="absolute top-[115px] left-6 w-14 bg-gray-300 h-4 rounded-xl overflow-hidden">
        <div
          className="bg-green-500 h-full rounded-xl"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Hiển thị EXP */}
      <span className="absolute top-[118px] left-7 text-black z-20 font-montserrat text-[8px]">
        {currentExp} / {maxExp} EXP
      </span>
    </div>
  );
};

export default LevelDisplay;
