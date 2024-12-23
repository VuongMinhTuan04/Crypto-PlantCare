import { getAllItems } from "@/utils/authServices";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Shop item data structure
const ITEM_CONFIGS = {
  quantities: [
    { quantity: "1", price: 1 },
    { quantity: "4", price: 4 },
    { quantity: "9", price: 8 }
  ],
  positions: {
    "Normal Fertilizer": "-top-2 -left-[5px]",
    "SuperFertilizer": "-top-2 -left-[4px]",
    "VIP Fertilizer": "-top-2 -left-[4px]",
  }
};

const transformApiData = (apiItems) => {
  const transformedItems = [];
  let currentId = 1;

  apiItems.forEach(apiItem => {
    // Create three variants for each item (different quantities)
    ITEM_CONFIGS.quantities.forEach(({ quantity, price }) => {
      transformedItems.push({
        id: currentId++,
        name: apiItem.name,
        icon: apiItem.icon_img,
        price: Number(apiItem.price) * price, // Multiply base price by quantity multiplier
        background: "/assets/images/Ellipse-50.png",
        available: true,
        quantity: quantity,
        position: ITEM_CONFIGS.positions[apiItem.name] || "-top-3 -left-[10px]" // Default position if not specified
      });
    });
  });

  return transformedItems;
};
const ShopItem = ({ item, isActive, onClick }) => (
  <div
    className="relative w-12 h-12 cursor-pointer"
    title={item.name}
    onClick={onClick}
  >
    <div className={`absolute ${item.position} w-14 h-14`}>
      <img
        src={item.icon}
        alt={item.name}
        className={`w-full h-full object-contain ${
          !item.available && "opacity-50"
        } ${
          isActive ? "filter drop-shadow-[0_0_8px_rgba(255,255,255,1)]" : ""
        } transition-filter duration-200`}
      />
    </div>
    <span
      className={`flex space-x-1 items-center absolute text-black font-bold bg-white rounded-full ${
        item.quantity >= 9
          ? "w-14 h-5 -bottom-3 -right-1"
          : item.quantity >= 4
          ? "w-12 h-5 -bottom-3 right-0"
          : "w-10 h-5 -bottom-3 right-1"
      } text-center text-[12px] font-sans`}
    >
      <span
        className={`flex justify-between ${
          item.quantity >= 9 ? "ml-3" : item.quantity >= 4 ? "ml-2.5" : "ml-2"
        }`}
      >
        {item.price}
      </span>
      <img
        className="w-4 h-4 z-10 bg-white rounded-full"
        src="/assets/images/tree-coin.png"
        alt="tree coin"
      />
    </span>
    <span className="absolute text-white font-bold bg-green-500 rounded-full w-5 h-5 -top-1 -right-1 text-center text-[12px]">
      x{item.quantity}
    </span>
  </div>
);
const BalanceDisplay = ({ balance = 0 }) => (
  <div className="w-20 h-8 bg-gray-300 absolute top-0 right-0 flex items-center rounded-full">
    <img
      className="w-8 h-8 z-10 bg-white px-1 py-1 rounded-full"
      src="/assets/images/tree-coin.png"
      alt="solana balance"
    />
    <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
      {balance}
    </span>
  </div>
);

const ShopPage = () => {
  const [shopItems, setShopItems] = useState([]);

  const navigate = useNavigate();
  const userBalance = 20;
  const [activeItemId, setActiveItemId] = useState(null);

  const handleItemClick = (itemId) => {
    setActiveItemId(itemId === activeItemId ? null : itemId);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const resp = await getAllItems();
      const transformedItems = transformApiData(resp);
      setShopItems(transformedItems);
    } catch (error) {
      console.log(error);
    }
  };


  
  const handleBuy = () => {
    const selectedItem = shopItems.find((item) => item.id === activeItemId);
    if (selectedItem) {
      console.log("Buying item:", {
        id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: selectedItem.quantity,
      });
    } else {
      console.log("Please select an item to buy");
    }
  };

  return (
    <div className="bg-background-lg-shop bg-cover bg-center bg-no-repeat sm:py-20 py-12 px-8 w-full h-full relative">
      {/* Header Section */}
      <div className="flex relative -top-6 h-19">
        <BalanceDisplay balance={userBalance} />
        <div>
          <button
            onClick={() => navigate("/game-playing")}
            className="hover:opacity-80 transition-opacity"
          >
            <ArrowLeftCircleIcon className="size-8 hover:bg-green-600 transition duration-300 rounded-full" />
          </button>
        </div>
      </div>

      {/* Shop Grid */}
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-6 place-items-center h-96 relative top-14 md:relative md:top-0 sm:relative sm:-top-12">
          {shopItems.map((item) => (
            <ShopItem
              key={item.id}
              item={item}
              isActive={activeItemId === item.id}
              onClick={() => handleItemClick(item.id)}
            />
          ))}
        </div>

        {/* Buy Button */}
        <div className="text-center relative top-32 sm:relative sm:top-10">
          <button
            onClick={handleBuy}
            className={`w-80 py-2 px-4 rounded-full font-bold transition duration-300 ${
              activeItemId
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!activeItemId}
          >
            BUY
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
