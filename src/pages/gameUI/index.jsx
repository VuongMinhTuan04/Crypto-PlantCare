import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeaderBoard from "../leaderboard/leader";
import SettingsPage from "../settingform";
import Wallet from "../wallet";
import GameHome from "./GameHome";
import ShopPage from "./GameShopping";

function GameScreen() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);
  const gameHomeOptions = [
    {
      id: 1,
      route: "/game-playing",
      backgroundImage: "/assets/images/image.png",
      iconImage: "/assets/images/image 14.png",
    },
    {
      id: 2,
      route: "/game-playing/leader-board",
      backgroundImage: "/assets/images/image.png",
      iconImage: "/assets/images/crown.png",
    },
    {
      id: 3,
      route: "/game-playing/wallet",
      backgroundImage: "/assets/images/image.png",
      iconImage: "/assets/images/wallet.png",
    },
    {
      id: 4,
      route: "/game-playing/activities",
      backgroundImage: "/assets/images/image.png",
      iconImage: "/assets/images/settings.png",
    },  
  ];

  const handleEventOptionClick = (option) => {
    setActiveButton(option.id);

    if (option.route === "/game-playing/activities") {
      navigate(option.route);
    } else {
      // Nếu không, chuyển đến trang mới
      navigate(option.route);
    }
  };

  const { pathname } = useLocation();

  const renderScreen = () => {
    switch (pathname) {
      case "/game-playing":
        return <GameHome />;
      case "/game-shopping":
        return <ShopPage />;
      case "/game-playing/leader-board":
        return <LeaderBoard />;
      case "/game-playing/wallet":
        return <Wallet />;
      case "/game-playing/activities":
        return <SettingsPage />;
      default:
        return <GameHome />;
    }
  };
  return (
    <div className="w-full h-full bg-gray-100 shadow-lg overflow-hidden flex items-center justify-center relative">
      <div className="w-full h-full bg-background-game bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center">
        {renderScreen()}
      </div>
      {/* Event Options List */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {gameHomeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleEventOptionClick(option)}
            className={`w-12 h-12 relative flex items-center justify-center
            transform transition-transform duration-200 rounded-full
            ${activeButton === option.id ? "shadow-full shadow-red-700" : "scale-100"}`}
          >
            <img
              src={option.backgroundImage}
              alt={`event-background-${option.id}`}
              className="absolute w-full h-full object-cover"
            />
            <img
              src={option.iconImage}
              alt={`event-icon-${option.id}`}
              className="absolute w-6 h-6 z-10 object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameScreen;
