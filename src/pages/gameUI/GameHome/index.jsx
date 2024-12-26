import ItemShopModal from "@/components/gameComponents/buynfts";
import CountdownToHarvest from "@/components/growthTimer";
import LevelDisplay from "@/components/leveldisplay";
import { levels } from "@/constants/levels";
import {
  getTreeByUser,
  getUserByToken,
  getUserTreeByUser,
  setTimeCountDown,
} from "@/utils/authServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PopupThongBao = ({ hienThi, dongLai, tieuDe, noiDung }) => {
  if (!hienThi) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="text-center">
          <img
            src="/assets/images/tree-coin.png"
            alt="Hình quả"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-green-600 mb-2">{tieuDe}</h2>
          <p className="text-gray-600 text-lg mb-6">{noiDung}</p>
          <button
            onClick={dongLai}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

function GameHome() {
  const navigate = useNavigate();
  const [shovelClicked, setShovelClicked] = useState(false);
  const [NFTs, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [treeAsset, setTreeAsset] = useState([]);
  const [isFruitReady, setIsFruitReady] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [userTree, setUserTree] = useState(null);
  const [currencies, setCurrencies] = useState({
    PTC: 0,
    SOL: 0,
  });
  const [isClaimed, setIsClaimed] = useState(false); // Thêm trạng thái isClaimed
  const [reload, setReload] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [currentPoints, setCurrentPoints] = useState(0);
  const [hienThiPopup, setHienThiPopup] = useState(false);
  const [daNhanThongBao, setDaNhanThongBao] = useState(false);

  useEffect(() => {
    loadUserTreeByToken();
  }, [user?.sub]);

  const loadUserTreeByToken = async () => {
    const token = JSON.parse(localStorage.getItem("tokenGoogle"));
    try {
      const resp = await getUserTreeByUser(token);
      setUserTree(resp);
    } catch (error) {
      console.log(error);
    }
  };

  // Update points when userTree changes
  useEffect(() => {
    if (userTree) {
      const currentLevel = levels.find(
        (level) => level.level === Number(userTree.level)
      );
      setCurrentPoints(currentLevel?.points || 0);
    }
  }, [userTree]);

  const handleShopItemClick = () => {
    setReload((prev) => !prev);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const tokenGoogle = localStorage.getItem("tokenGoogle");
    const parsedToken = JSON.parse(tokenGoogle);
    try {
      const resp = await getUserByToken(parsedToken);
      console.log(resp);
      setUser(resp);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("tokenGoogle"));
    const loadData = async () => {
      try {
        if (user?.sub) {
          const [treeResp, userTreeResp] = await Promise.all([
            getTreeByUser(user.sub),
            getUserTreeByUser(token),
          ]);
          setTreeAsset(treeResp);
          setUserTree(userTreeResp);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [user?.sub, reload]);

  const handleBasketClick = () => {
    navigate("/game-shopping");
  };

  const handleShovelClick = () => {
    setShovelClicked((prev) => !prev);
  };

  const handleLevelUp = async () => {
    const token = JSON.parse(localStorage.getItem("tokenGoogle"));
    try {
      const updatedTree = await getUserTreeByUser(token);
      setUserTree(updatedTree); 
      const currentLevel = levels.find(
        (level) => level.level === Number(updatedTree.level)
      );
      setCurrentPoints(currentLevel?.points || 0);
    } catch (error) {
      console.error("Failed to update user tree:", error);
    }
  };

  const showNotificationWithMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleWateringCanUse = async () => {
    const token = JSON.parse(localStorage.getItem("tokenGoogle"));
    try {
      if (userTree.watering === false) {
        const resp = await setTimeCountDown(token, true);
        console.log(resp.updatedUserTree);
        const updatedUserTreeData = await getUserTreeByUser(token);
        setUserTree(updatedUserTreeData);

        setIsCountdownActive(true);
        setIsClaimed(false);
      } else {
        showNotificationWithMessage("Đã tưới nước");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComplete = () => {
    setIsFruitReady(true);
    setIsCountdownActive(false);
  };

  const [claimSuccess, setClaimSuccess] = useState(false);
  const handleHarvestComplete = () => {
    console.log(isClaimed);
    if (!isClaimed && !daNhanThongBao) {
      // Chỉ hiện popup nếu chưa claim và chưa nhận thông báo
      setHienThiPopup(true);
      setIsCountdownActive(false);
    }
  };

  const handleClaimSuccess = (claimed) => {
    if (claimed) {
      setClaimSuccess(true);
      loadUserData()
      loadUserTreeByToken()
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Level Image */}
      {userTree && (
        <LevelDisplay userTree={userTree} onLevelUp={handleLevelUp} />
      )}
      {/* SOL và SAO */}
      <div className="flex">
        <div className="w-20 h-8 bg-gray-200 absolute top-14 right-5 flex items-center rounded-full">
          <img
            className="w-8 h-8 z-10 bg-white px-1 py-1 rounded-full"
            src="/assets/images/tree-coin.png"
            alt="currency-icon"
          />
          <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
            {user?.points}
          </span>
        </div>
      </div>

      {/* Tree Image */}
      <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] flex items-center justify-center">
        <img
          src={treeAsset?.imageUrl || ""}
          alt="tree-image"
          className="max-w-full h-auto object-contain"
        />
      </div>
      {userTree?.time_countdown && (
        <CountdownToHarvest
          key={userTree.time_countdown}
          time_countdown={userTree.time_countdown}
          watering={userTree.watering}
          onComplete={handleHarvestComplete}
          isClaimed={isClaimed} // Truyền isClaimed xuống CountdownToHarvest
          setIsClaimed={setIsClaimed} // Truyền setIsClaimed xuống CountdownToHarvest
          points={currentPoints}
          onClaimSuccess={handleClaimSuccess}
        />
      )}
      {/* Basket Button */}
      <div className="relative top-20">
        <button
          onClick={handleBasketClick}
          className="absolute top-6 right-4 w-12 h-12 flex items-center justify-center transform transition-transform duration-200"
        >
          <img
            src="/assets/images/Ellipse-42.png"
            alt="basket-background"
            className="absolute w-full h-full object-cover"
          />
          <img
            src="/assets/images/icons8-basket-48 1.png"
            alt="basket-icon"
            className="absolute w-8 h-8 z-10 object-contain"
          />
        </button>
      </div>

      {/* Shovel Button */}
      <div className="relative top-20">
        <button
          onClick={handleShovelClick}
          className={`absolute top-20 right-4 w-12 h-12 flex items-center justify-center 
          transform transition-transform duration-200 
          ${shovelClicked ? "scale-90" : "scale-100"}`}
        >
          <img
            src="/assets/images/Ellipse-47.png"
            alt="shovel-background"
            className="absolute w-full h-full object-cover"
          />
          <img
            src="/assets/images/icons8-fertilizer-64 2.png"
            alt="shovel-icon"
            className="absolute w-6 h-6 z-10 object-contain"
          />
        </button>

        <div className="absolute top-20 right-[70px]">
          <ItemShopModal
            show={shovelClicked}
            onWateringCanUse={handleWateringCanUse}
            onShopItemClick={handleShopItemClick}
            className={`absolute top-1/2 left-12 transform translate-y-full ${
              shovelClicked ? "block" : "hidden"
            }`}
          />
        </div>
      </div>
      {showNotification && (
        <div className="fixed top-4 right-1/2 translate-x-1/2 bg-green-500 text-white p-4 rounded shadow z-50">
          {notificationMessage}
        </div>
      )}
      {/* Thêm vào trước thẻ div đóng cuối cùng */}
      <PopupThongBao
        hienThi={hienThiPopup}
        dongLai={() => setHienThiPopup(false)}
        tieuDe={"Thông báo mới !!"}
        noiDung={" Cây của bạn đã ra quả! Bạn có thể thu hoạch ngay bây giờ."}
      />
      <PopupThongBao
        hienThi={claimSuccess}
        dongLai={() => setClaimSuccess(false)}
        tieuDe={"Bạn nhận được"}
        noiDung={`+ ${currentPoints} PTC`}
      />
    </div>
  );
}

export default GameHome;
