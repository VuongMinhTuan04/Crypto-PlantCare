import Loading from "@/components/loading";
import TransitionWrapper from "@/components/motion";
import { userDetail, userDetailGoogle } from "@/utils/authServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GameWaitingPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [userImage, setUserImage] = useState("/api/placeholder/200/200");
  const [NFTs, setNFTs] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user details from Google
  useEffect(() => {
    const fetchGoogleUserDetails = async () => {
      try {
        const tokenGoogle = localStorage.getItem("tokenGoogle");
        if (tokenGoogle) {
          const parsedToken = JSON.parse(tokenGoogle);
          setToken(parsedToken);

          const resp = await userDetailGoogle(parsedToken);
          setUser(resp.user);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        // Xử lý lỗi, ví dụ chuyển hướng đến trang đăng nhập
        navigate("/game-login");
      }
    };

    fetchGoogleUserDetails();
  }, [navigate]);

  // Fetch user NFTs when user is available
  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (user?.userId) {
        try {
          setIsLoading(true);
          const resp = await userDetail(user.userId);
          console.log(resp);
          setNFTs(resp.data || []);
        } catch (error) {
          console.error("Failed to fetch user NFTs:", error);
          // Xử lý lỗi, có thể hiển thị thông báo cho người dùng
          setNFTs([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserNFTs();
  }, [user]);

  // Loading state management
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("tokenGoogle");
    navigate("/game-login");
  };

  const handleEnterGame = () => {
    const uniqueAssets = NFTs.filter((nft) => nft.type === "UniqueAsset").map((nft) => nft.item);
  
    const assetsTrees = uniqueAssets.filter((item) =>
      ["Green Giant Tree", "Golden Giant Tree", "Purple Giant Tree"].includes(item.name)
    );
  
    if (assetsTrees.length > 0) {
      console.log(assetsTrees);
      navigate("/game-playing");
    } else {
      console.log("No matching assets found.");
      navigate("/game-login/solana/deposite/mint");
    }
  };
  
  

  // Rendering loading state
  if (isLoading) {
    return <Loading />;
  }

  // Xử lý trường hợp không có user
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Vui lòng đăng nhập lại</p>
        <button
          onClick={() => navigate("/game-login")}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Đăng Nhập
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden font-montserrat">
      {/* Video Background - giữ nguyên như cũ */}
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 min-w-full min-h-full object-cover"
      >
        <source src="/assets/videos/background-cho.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 z-10"></div>

      <TransitionWrapper>
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4">
          {/* User Image */}
          <img
            src={user.picture || "/api/placeholder/200/200"}
            alt="User Profile"
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
          />

          {/* User Email */}
          <p className="text-xl font-semibold mb-6">
            {user.email || "player@example.com"}
          </p>

          {/* Buttons Container */}
          <div className="flex flex-col space-y-4 w-32">
            <button
              onClick={handleEnterGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full transition-colors duration-300 font-bold"
            >
              Vào Game
            </button>

            <button
              onClick={handleLogout}
              className="w-full underline font-montserrat hover:text-space-700 text-white py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      </TransitionWrapper>
    </div>
  );
};

export default GameWaitingPage;