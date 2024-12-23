import {
  getAllItems,
  getAllPurchaseByUserId,
  userDetailGoogle,
} from "@/utils/authServices";
import { useEffect, useState } from "react";

const ItemShopModal = ({ show, onClose, onWateringCanUse }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [shopItems, setShopItems] = useState([]);
  const [user, setUser] = useState(null);
  const [userInventory, setUserInventory] = useState([]);

  // Fixed items that should always appear first
  const FIXED_ITEMS = [
    {
      id: 1,
      image: "/assets/images/water-drops.png",
      name: "Watering Can",
      backgroundImage: "/assets/images/Ellipse-50.png",
      icon: "/assets/images/watering-can.png",
      quantity: 0,
    },
  ];

  const transformApiData = (apiItems, userPurchases) => {
    return apiItems.map((item, index) => {
      // Find the user's purchase quantity for this item

      const userPurchase = userPurchases.find(
        (purchase) => purchase.itemId === item._id
      );
    console.log(userPurchase)

      return {
        id: item._id, // Start from id 2 since id 1 is reserved for Watering Can
        image: getImageForItem(item.name),
        name: item.name,
        backgroundImage: "/assets/images/Ellipse-50.png",
        icon: item.icon_img,
        quantity: userPurchase ? userPurchase.quantity : 0,
        time_dele: item.time_dele,
        itemId: item.id, // Keep the original item ID for reference
      };
    });
  };

  const getImageForItem = (name) => {
    const imageMap = {
      "Normal Fertilizer": "/assets/images/box.png",
      "SuperFertilizer": "/assets/images/scale.png",
      "VIP Fertilizer": "/assets/images/scale.png",
    };
    return imageMap[name] || "/assets/images/box.png";
  };

  useEffect(() => {
    const initializeData = async () => {
      await loadUser();
    };
    
    if (show) {
      initializeData();
    }
  }, [show]);

  useEffect(() => {
    if (user?.userId) {
      loadItems();
    }
  }, [user]);

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
      const [itemsResponse, purchasesResponse] = await Promise.all([
        getAllItems(),
        getAllPurchaseByUserId(user.userId)
      ]);

      
      setUserInventory(purchasesResponse);
      const transformedItems = transformApiData(itemsResponse, purchasesResponse);
      
      setShopItems([...FIXED_ITEMS, ...transformedItems]);
    } catch (error) {
      console.error("Failed to load items:", error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleUseClick = async () => {
    if (!selectedItem) return;

    if (selectedItem.quantity <= 0) {
      // Show error notification that item is not available
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 1000);
      return;
    }

    if (selectedItem.name === "Watering Can") {
      const canUseWater = onWateringCanUse();
      if (!canUseWater) return;
    }

    try {
      // Here you can add API call to use the item
      // await useItem(selectedItem.itemId, user.userId);
      
      // Update local state to reflect item usage
      setShopItems(prevItems => 
        prevItems.map(item => 
          item.id === selectedItem.id 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );

      // Show success notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 1000);
    } catch (error) {
      console.error("Failed to use item:", error);
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
              disabled={item.quantity <= 0}
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
                {item.quantity > 0 && (
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
              This is a description of the {selectedItem.name}.
            </p>
            <button
              onClick={handleUseClick}
              className={`w-full font-bold py-2 px-4 rounded mt-4 ${
                selectedItem.quantity > 0
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-400 cursor-not-allowed text-gray-200"
              }`}
              disabled={selectedItem.quantity <= 0}
            >
              {selectedItem.quantity > 0 ? "USE" : "OUT OF STOCK"}
            </button>
          </div>
        )}
        
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow">
            {selectedItem.quantity > 0 ? "Item used successfully!" : "Item not available"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemShopModal;