import { levels } from "@/constants/levels";
import { updateLevel } from "@/utils/authServices";
import { useEffect, useState } from "react";

const LevelDisplay = ({ userTree, onLevelUp }) => {
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
          const leveledUp = await checkLevelUp();
        if (leveledUp) {
          onLevelUp();
        }
      }
    };

    checkAndUpdateLevel();
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
