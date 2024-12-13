import ItemShopModal from "@/components/gameComponents/buynfts";
import { userDetail } from "@/utils/authServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GameHome() {
  const navigate = useNavigate();
  const [shovelClicked, setShovelClicked] = useState(false);
  const [NFTs, setNFTs] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    dataUser();
  }, []);

  const dataUser = async () => {
    setIsLoading(true); // Bắt đầu loading
    const currentUser = JSON.parse(localStorage.getItem("tokenGoogle"));
    if (currentUser === null) {
      setIsLoading(false);
      return;
    }
    
    try {
      setUser(currentUser.user);
      const resp = await userDetail(currentUser.user.sub);
      setNFTs(resp.data);
      setIsLoading(false); // Kết thúc loading khi đã có dữ liệu
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Kết thúc loading nếu có lỗi
    }
  };

  const handleBasketClick = () => {
    navigate("/game-shopping");
  };

  const handleShovelClick = () => {
    setShovelClicked((prev) => !prev);
  };

  // Xử lý an toàn cho việc lấy hình ảnh cây
  const treeAssets = NFTs.filter(
    (item) => item.type === "UniqueAsset" && item.item?.collection?.name === "Trees"
  );
  const treeAssetsArray = Array.isArray(treeAssets) 
    ? (treeAssets.length === 1 ? treeAssets[0] : treeAssets)
    : treeAssets;
  const treeImageUrl = treeAssetsArray?.item?.imageUrl || '';

  // Nếu đang loading, hiển thị loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }
  return (
    <div className="relative w-full h-full">
      {console.log(treeImageUrl)}
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
        <div className="w-20 h-8 bg-gray-300 absolute top-14 right-28 flex items-center rounded-full">
          <img
            className=" w-8 h-8 z-10 bg-white px-1 py-1 rounded-full"
            src="/assets/images/solana-icon.png"
            alt="image-level"
          />
          <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
            0
          </span>
        </div>
        <div className="w-20 h-8 bg-gray-300 absolute top-14 right-5 flex items-center rounded-full">
          <img
            className=" w-8 h-8 z-10 bg-white px-1 py-1 rounded-full"
            src="/assets/images/solana-icon.png"
            alt="image-level"
          />
          <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
            0
          </span>
        </div>
      </div>
      {/* Tree Image */}
      <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] flex items-center justify-center">
        <img
          src={treeImageUrl}
          alt="tree-image"
          className="max-w-full h-auto object-contain"
        />
      </div>
      {/* Basket Button */}
      <div className="relative">
        <button
          onClick={handleBasketClick}
          className={`absolute top-28 right-4 w-12 h-12 flex items-center justify-center 
          transform transition-transform duration-200 
         `}
        >
          <div className="absolute w-full h-full">
            <img
              src="/assets/images/Ellipse-42.png"
              alt="basket-background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute w-8 h-8 z-10">
            <img
              src="/assets/images/icons8-basket-48 1.png"
              alt="basket-icon"
              className="w-full h-full object-contain"
            />
          </div>
        </button>
        {/* ItemShopModal */}
      </div>

      {/* Shovel Button */}
      <div className="relative">
        <button
          onClick={handleShovelClick}
          className={`absolute top-44 right-4 w-12 h-12 flex items-center justify-center 
          transform transition-transform duration-200 
          ${shovelClicked ? "scale-90" : "scale-100"}`}
        >
          <div className="absolute w-full h-full">
            <img
              src="/assets/images/Ellipse-47.png"
              alt="shovel-background"
              className={`w-full h-full object-cover`}
            />
          </div>
          <div className="absolute w-6 h-6 z-10">
            <img
              src="/assets/images/icons8-fertilizer-64 2.png"
              alt="shovel-icon"
              className="w-full h-full object-contain"
            />
          </div>
        </button>
        <div className="absolute top-48 right-[70px] ">
          <ItemShopModal
            show={shovelClicked}
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
