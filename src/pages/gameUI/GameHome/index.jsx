import ItemShopModal from "@/components/gameComponents/buynfts";
import CountdownToHarvest from "@/components/growthTimer";
import {
  getUserBySub,
  userDetail,
  userDetailGoogle,
} from "@/utils/authServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GameHome() {
  const navigate = useNavigate();
  const [shovelClicked, setShovelClicked] = useState(false);
  const [NFTs, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [treeAsset, setTreeAsset] = useState(null);
  const [isFruitReady, setIsFruitReady] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [currencies, setCurrencies] = useState({
    PTC: 0,
    SOL: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokenGoogle = localStorage.getItem("tokenGoogle");
        if (!tokenGoogle) return;

        const parsedToken = JSON.parse(tokenGoogle);
        const userResp = await userDetailGoogle(parsedToken);
        setUser(userResp.user);

        if (!userResp.user?.userId) return;

        // Fetch NFTs and user points
        const [nftResp, userResp2] = await Promise.all([
          userDetail(userResp.user.userId),
          getUserBySub(userResp.user.userId)
        ]);

        const fetchedNFTs = nftResp.data || [];
        setNFTs(fetchedNFTs);

        // Update currencies
        setCurrencies({
          PTC: userResp2.points || 0,
          SOL: fetchedNFTs.find(nft => nft.type === "Currency" && nft.item.id === "SOL")?.quantity || 0
        });

        // Set tree asset
        const treeTypes = ["Green Giant Tree", "Golden Giant Tree", "Purple Giant Tree"];
        const availableTree = fetchedNFTs.find(
          nft => nft.type === "UniqueAsset" && treeTypes.includes(nft.item?.name)
        );
        if (availableTree) setTreeAsset(availableTree);

      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    checkExistingCountdown();
  }, []);

  const checkExistingCountdown = () => {
    const storedHarvestTime = localStorage.getItem("harvest-time");
    if (storedHarvestTime) {
      const currentTime = Date.now();
      const harvestTime = parseInt(storedHarvestTime) + 5 * 60 * 60 * 1000;
      if (currentTime < harvestTime) {
        setIsCountdownActive(true);
      }
    }
  };

  // Rest of the component remains the same
  const handleBasketClick = () => {
    navigate("/game-shopping");
  };

  const handleShovelClick = () => {
    setShovelClicked(prev => !prev);
  };

  const handleWateringCanUse = () => {
    const storedHarvestTime = localStorage.getItem("harvest-time");
    if (storedHarvestTime) {
      const currentTime = Date.now();
      const harvestTime = parseInt(storedHarvestTime) + 5 * 60 * 60 * 1000;

      if (currentTime < harvestTime) {
        alert("Bạn đã tưới nước rồi! Hãy đợi đến khi cây ra quả.");
        return false;
      }
    }

    setIsCountdownActive(true);
    const currentTime = Date.now();
    localStorage.setItem("harvest-time", currentTime.toString());
    return true;
  };

  const handleComplete = () => {
    setIsFruitReady(true);
    setIsCountdownActive(false);
  };

  const handleHarvestComplete = () => {
    alert("Cây đã ra quả! Đã đến lúc thu hoạch.");
    setIsCountdownActive(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

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
        <div className="w-20 h-8 bg-gray-200 absolute top-14 right-28 flex items-center rounded-full">
          <img
            className="w-8 h-8 z-10 bg-white px-1 py-1 rounded-full"
            src="/assets/images/solana-icon.png"
            alt="currency-icon"
          />
          <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
            {currencies.SOL}
          </span>
        </div>
        <div className="w-20 h-8 bg-gray-200 absolute top-14 right-5 flex items-center rounded-full">
          <img
            className="w-8 h-8 z-10 bg-white px-1 py-1 rounded-full"
            src="/assets/images/tree-coin.png"
            alt="currency-icon"
          />
          <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
            {currencies.PTC}
          </span>
        </div>
      </div>

      {/* Tree Image */}
      <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] flex items-center justify-center">
        <img
          src={treeAsset?.item?.imageUrl || ""}
          alt="tree-image"
          className="max-w-full h-auto object-contain"
        />
      </div>

      {isCountdownActive && (
        <CountdownToHarvest
          harvestDurationHours={5}
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