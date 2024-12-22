import { useState } from "react";
import Notification from "../notifications";

const ItemShopModal = ({ show, onClose }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const itemData = [
    {
      id: 1,
      image: "/assets/images/water-drops.png",
      name: "Watering Can",
      backgroundImage: "/assets/images/Ellipse-50.png",
      icon: "/assets/images/watering-can.png",
    },
    {
      id: 2,
      image: "/assets/images/box.png",
      name: "Supply Box",
      backgroundImage: "/assets/images/Ellipse-50.png",
      icon: "/assets/images/fertilizer.png",
    },
    {
      id: 3,
      image: "/assets/images/scale.png",
      name: "Magic Scale",
      backgroundImage: "/assets/images/Ellipse-50.png",
      icon: "/assets/images/fertilizer-2.png",
    },


  ];

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleUseClick = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 1000); // Thông báo hiển thị trong 3 giây
  };

  return (
    <div className={`inset-0 flex ${show ? "block" : "hidden"}`}>
      {showNotification && <Notification />}
      <div className="bg-green-400 rounded-lg shadow-lg p-1 w-full max-w-[200px] text-black">
        <div className="grid grid-cols-3">
          {itemData.map((item) => (
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
                <span className="absolute text-white font-bold bg-green-500 rounded-full w-5 h-5 -top-2 -right-0 text-center text-[12px]">
                  x3
                </span>
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
              className="bg-green-500 hover:bg-green-600 text-white w-full font-bold py-2 px-4 rounded mt-4"
            >
              USE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemShopModal;
