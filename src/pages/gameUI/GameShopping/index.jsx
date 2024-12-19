import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

// Shop item data structure
const SHOP_ITEMS = [
  {
    id: 1,
    name: "Water Potion",
    icon: "/assets/images/icons8-water-100 1.png",
    price: 3,
    background: "/assets/images/Ellipse-50.png",
    available: true,
    quantity: "1",
  },
  {
    id: 2,
    name: "Fire Potion",
    icon: "/assets/images/icons8-water-100 1.png",
    price: 5,
    background: "/assets/images/Ellipse-50.png",
    available: true,
    quantity: "4",
  },
  {
    id: 3,
    name: "Earth Potion",
    icon: "/assets/images/icons8-water-100 1.png",
    price: 4,
    background: "/assets/images/Ellipse-50.png",
    available: false,
    quantity: "8",
  },
  {
    id: 4,
    name: "Wind Potion",
    icon: "/assets/images/icons8-water-100 1.png",
    price: 6,
    background: "/assets/images/Ellipse-50.png",
    available: true,
    quantity: "1",
  },
  {
    id: 5,
    name: "Lightning Potion",
    icon: "/assets/images/icons8-water-100 1.png",
    price: 8,
    background: "/assets/images/Ellipse-50.png",
    available: true,
    quantity: "4",
  },
  {
    id: 6,
    name: "Ice Potion",
    icon: "/assets/images/icons8-water-100 1.png",
    price: 7,
    background: "/assets/images/Ellipse-50.png",
    available: true,
    quantity: "8",
  },
  {
    id: 7,
    name: "Dark Potion",
    icon: "/assets/images/icons8-water-100 1.png",
    price: 10,
    background: "/assets/images/Ellipse-50.png",
    available: false,
    quantity: "1",
  },
  {
    id: 8,
    name: "Light Potion",
    icon: "/assets/images/icons8-water-100 1.png",
    price: 9,
    background: "/assets/images/Ellipse-50.png",
    available: true,
    quantity: "4",
  },
  {
    id: 9,
    name: "Nature Potion",
    icon: "/assets/images/icons8-water-100 1.png",
    price: 5,
    background: "/assets/images/Ellipse-50.png",
    available: true,
    quantity: "8",
  },
];

const ShopItem = ({ item }) => (
  <div className="relative w-12 h-12 cursor-pointer" title={item.name}>
    <div className="absolute left-0 w-full h-full">
      <img
        src={item.background}
        alt={`${item.name} background`}
        className={`w-full h-full object-cover ${
          !item.available && "opacity-50"
        }`}
      />
    </div>
    <div className="absolute top-2 left-2 w-8 h-8 z-10">
      <img
        src={item.icon}
        alt={item.name}
        className={`w-full h-full object-contain ${
          !item.available && "opacity-50"
        }`}
      />
    </div>
    <span className="flex space-x-1 items-center absolute text-black font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
      <span className="ml-2">{item.price}</span>
      <img
        className="w-4 h-4 z-10 bg-white rounded-full"
        src="/assets/images/solana-icon.png"
        alt="solana icon"
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
      src="/assets/images/solana-icon.png"
      alt="solana balance"
    />
    <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
      {balance}
    </span>
  </div>
);

const ShopPage = () => {
  const navigate = useNavigate();
  const userBalance = 20; // Example balance

  const handleBuy = () => {
    // Handle buy logic here
    console.log("Buying items...");
  };

  return (
    <div className="bg-background-shop bg-cover bg-center bg-no-repeat py-20 px-8 w-full h-full relative">
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
        <div className="grid grid-cols-3 gap-6 place-items-center h-96">
          {SHOP_ITEMS.map((item) => (
            <ShopItem key={item.id} item={item} />
          ))}
        </div>

        {/* Buy Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleBuy}
            className="bg-white w-full hover:bg-green-600 hover:text-white transition duration-300 text-green-500 font-bold py-2 px-4 rounded-full"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
