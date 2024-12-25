import ItemShopModal from "@/components/gameComponents/buynfts";
import CountdownToHarvest from "@/components/growthTimer";
import {
  getTreeByUser,
  getUserByToken,
  getUserTreeByUser,
  setTimeCountDown
} from "@/utils/authServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const tokenGoogle = localStorage.getItem("tokenGoogle");
    if (tokenGoogle) {
      try {
        const parsedToken = JSON.parse(tokenGoogle);
        const loadUserData = async () => {
          try {
            const resp = await getUserByToken(parsedToken);
            console.log(resp)
            setUser(resp);
          } catch (error) {
            console.error("Failed to fetch user details:", error);
          }
        };
        loadUserData();
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
  }, []);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("tokenGoogle"));
    const loadTreeByUser = async () => {
      try {
        if (user?.sub) {
          const resp = await getTreeByUser(user.sub);
          setTreeAsset(resp);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const loadUserTreeByToken = async () => {
      try {
        const resp = await getUserTreeByUser(token);
        setUserTree(resp);
      } catch (error) {
        console.log(error);
      }
    };
    loadTreeByUser();
    loadUserTreeByToken();
  }, [user?.sub]);

  useEffect(() => {
    if (userTree?.time_countdown) {
      const storedHarvestTime = localStorage.getItem("harvest-time");
      const currentTime = Date.now();
      const harvestTime =
        parseInt(storedHarvestTime) + parseInt(userTree.time_countdown);
      if (currentTime < harvestTime) {
        setIsCountdownActive(true);
      }
    }
  }, [userTree]);

  const handleBasketClick = () => {
    navigate("/game-shopping");
  };

  const handleShovelClick = () => {
    setShovelClicked((prev) => !prev);
  };

  const handleWateringCanUse = async () => {
    const token = JSON.parse(localStorage.getItem("tokenGoogle"));
    try {
      if (user?.userId) {
        const resp = await setTimeCountDown(token, true);
        console.log(resp);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComplete = () => {
    setIsFruitReady(true);
    setIsCountdownActive(false);
  };

  const handleHarvestComplete = () => {
    alert("Cây đã ra quả! Đã đến lúc thu hoạch.");
    setIsCountdownActive(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* Level Image */}
      <div className="">
        <img
          className="absolute top-12 left-7 w-12 h-12 z-10 bg-white px-1 py-1 rounded-full"
          src="/assets/images/treelevel.png"
          alt="image-level"
        />
        <span className="absolute top-[90px] left-7 text-black z-20 font-montserrat font-bold bg-white text-center w-12 text-[12px] rounded-xl">
          LV 3
        </span>
      </div>

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
          time_countdown={userTree.time_countdown}
          onComplete={handleHarvestComplete}
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
            className={`absolute top-1/2 left-12 transform translate-y-full ${
              shovelClicked ? "block" : "hidden"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default GameHome;
