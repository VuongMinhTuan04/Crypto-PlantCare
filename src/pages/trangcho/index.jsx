import Loading from "@/components/loading";
import TransitionWrapper from "@/components/motion";
import { userDetail } from "@/utils/authServices";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GameWaitingPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("/api/placeholder/200/200");
  const [NFTs, setNFTs] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    dataUser();
    // UserNFTs();
  }, []);

  const dataUser = async () => {
    const currentUser = JSON.parse(localStorage.getItem("tokenGoogle"));
    if (currentUser === null) {
      return;
    }
    console.log(currentUser.user);
    setUser(currentUser.user);
    try {
      const resp = await userDetail(currentUser.user.sub);
      setNFTs(resp.data);
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tokenGoogle");
    navigate("/game-login");
  };

  const handleEnterGame = () => {
    if (NFTs.some((nft) => nft.type === "UniqueAsset")) {
      navigate("/game-playing");  
    } else {
      navigate("/game-login/solana/deposite/mint"); 
    }
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập quá trình tải
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 giây

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden font-montserrat">
      {/* Video Background */}
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
        {/* Content Container */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-4">
          {/* User Image */}
          <img
            src={user.picture}
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
