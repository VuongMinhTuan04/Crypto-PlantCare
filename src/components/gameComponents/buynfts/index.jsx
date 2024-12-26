import {
  getAllItems,
  getAllPurchaseByUserId,
  updatePurchase,
  userDetailGoogle
} from "@/utils/authServices";
import { useEffect, useState } from "react";

const ItemShopModal = ({
  show,
  onClose,
  onWateringCanUse,
  onShopItemClick,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [shopItems, setShopItems] = useState([]);
  const [user, setUser] = useState(null);

  const WATERING_CAN = {
    id: 1,
    image: "/assets/images/water-drops.png",
    name: "Watering Can",
    backgroundImage: "/assets/images/Ellipse-50.png",
    icon: "/assets/images/watering-can.png",
    quantity: 1,
  };

  const FERTILIZER = [
    {
      id: 2,
      image: "/assets/images/fertilizer-3.png",
      name: "Normal Fertilizer",
      backgroundImage: "/assets/images/Ellipse-50.png",
      icon: "/assets/images/fertilizer-3.png",
      quantity: 0,
    },
    {
      id: 3,
      image: "/assets/images/fertilizer.png",
      name: "Super Fertilizer",
      backgroundImage: "/assets/images/Ellipse-50.png",
      icon: "/assets/images/fertilizer.png",
      quantity: 0,
    },
    {
      id: 4,
      image: "/assets/images/water-drops.png",
      name: "VIP Fertilizer",
      backgroundImage: "/assets/images/Ellipse-50.png",
      icon: "/assets/images/fertilizer-2.png",
      quantity: 0,
    },
  ];

  const transformApiData = (apiItems, userPurchases) => {
    let current = 1;
    return apiItems.map((item) => {
      const purchasesForItem = userPurchases.filter(
        (purchase) => purchase.itemId === item._id
      );
      const totalQuantity = purchasesForItem.reduce(
        (sum, purchase) => sum + purchase.totalRemaining,
        0
      );

      return {
        id: ++current,
        image: getImageForItem(item.name),
        name: item.name,
        backgroundImage: "/assets/images/Ellipse-50.png",
        icon: item.icon_img,
        quantity: totalQuantity,
        itemId: item._id,
        exp: item.exp,
      };
    });
  };

  const getImageForItem = (name) => {
    const imageMap = {
      "Normal Fertilizer": "/assets/images/box.png",
      SuperFertilizer: "/assets/images/scale.png",
      "VIP Fertilizer": "/assets/images/scale.png",
    };
    return imageMap[name] || "/assets/images/box.png";
  };

  useEffect(() => {
    if (show) {
      loadUser();
    }
  }, [show]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadUser = async () => {
    const tokenGoogle = localStorage.getItem("tokenGoogle");
    if (!tokenGoogle) return;

    try {
      const parsedToken = JSON.parse(tokenGoogle);
      const response = await userDetailGoogle(parsedToken);
      setUser(response.user);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const loadItems = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("tokenGoogle"));
      if (!token) {
        console.log("No token");
        return;
      }
      const [itemsResponse, purchasesResponse] = await Promise.all([
        getAllItems(),
        getAllPurchaseByUserId(token),
      ]);
      
      console.log(purchasesResponse);

      if (purchasesResponse.error) {
        setShopItems([WATERING_CAN, ...FERTILIZER]);
        return;
      }

      const transformedItems = transformApiData(
        itemsResponse,
        purchasesResponse.summary
      );

      setShopItems([WATERING_CAN, ...transformedItems]);
    } catch (error) {
      console.error("Failed to load items:", error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (item.name !== "Watering Can" && item.quantity <= 0) {
      showNotificationWithMessage("Bạn cần phải mua mới được dùng");
    }
  };

  const showNotificationWithMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleUseClick = async () => {
    if (!selectedItem) return;

    console.log(selectedItem);
    const token = JSON.parse(localStorage.getItem("tokenGoogle"));

    if (selectedItem.name === "Watering Can") {
      onWateringCanUse();
      return;
    }

    if (selectedItem.quantity <= 0) {
      showNotificationWithMessage("Bạn cần phải mua mới được dùng");
      return;
    }

    try {
      const resp = await updatePurchase(
        token,
        selectedItem.itemId,
        Number(selectedItem.exp)
      );
      console.log(resp);
      const remainingQuantity = resp.data.remainingQuantity || 0;

      setShopItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id
            ? { ...item, quantity: remainingQuantity }
            : item
        )
      );

      setSelectedItem((prev) => ({
        ...prev,
        quantity: remainingQuantity,
      }));

      if (remainingQuantity <= 0) {
        showNotificationWithMessage("Bạn đã dùng hết");
      } else {
        showNotificationWithMessage("Item used successfully!");
      }
      onShopItemClick();
    } catch (error) {
      console.error("Failed to use item:", error);
      showNotificationWithMessage("Failed to use item");
    }
  };

  if (!show) return null;

  return (
    <div className="inset-0 flex">
      <div className="bg-green-400 rounded-lg shadow-lg p-1 w-full max-w-[280px] text-black">
        <div className="grid grid-cols-4">
          {shopItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`rounded-lg p-2 transition-colors ${
                selectedItem?.id === item.id ? "bg-green-200" : ""
              }`}
            >
              <div className="relative w-12 h-12">
                <div className="absolute left-0 w-full h-full">
                  <img
                    src={item.backgroundImage}
                    alt={`${item.name} background`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 left-[10px] w-7 h-7 z-10">
                  <img
                    src={item.icon}
                    alt={`${item.name} icon`}
                    className="w-full h-full object-contain"
                  />
                </div>
                {item.name !== "Watering Can" && item.quantity >= 0 && (
                  <span className="absolute text-white font-bold bg-green-500 rounded-full w-5 h-5 -top-2 -right-0 text-center text-[12px]">
                    x{item.quantity}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        {selectedItem && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-md font-bold">{selectedItem.name}</h3>
            <p className="text-gray-600 text-sm">
              {selectedItem.name === "Watering Can"
                ? "Use to water your tree and start growing process"
                : `This is a description of the ${selectedItem.name}.`}
            </p>
            <button
              onClick={handleUseClick}
              className={`w-full font-bold py-2 px-4 rounded mt-4 ${
                selectedItem.name === "Watering Can" ||
                selectedItem.quantity > 0
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-400 cursor-not-allowed text-gray-200"
              }`}
              disabled={
                selectedItem.name !== "Watering Can" &&
                selectedItem.quantity <= 0
              }
            >
              USE
            </button>
          </div>
        )}

        {showNotification && (
          <div className="fixed top-4 right-1/2 translate-x-1/2 bg-green-500 text-white p-4 rounded shadow z-50">
            {notificationMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemShopModal;
