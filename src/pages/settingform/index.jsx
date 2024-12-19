import { userDetailGoogle } from "@/utils/authServices";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [token, setToken] = useState('')
  useEffect(() => {
    // Kiểm tra và xử lý token Google
    const tokenGoogle = localStorage.getItem("tokenGoogle");
    if (tokenGoogle) {
      try {
        const parsedToken = JSON.parse(tokenGoogle);
        setToken(parsedToken)
        const loadUserData = async () => {
          try {
            const resp = await userDetailGoogle(parsedToken);
            setUser(resp.user);
            console.log(resp.user);
          } catch (error) {
            console.error("Failed to fetch user details:", error);
          }
        };
        loadUserData();
      } catch (error) {
        console.error("Invalid token format:", error);
      }
    }
  }, []);
  const logout = () => {
    localStorage.removeItem("tokenGoogle");
    navigate("/game-login");
  };

  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken)
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds

      // Lấy thời gian hiện tại
      const currentTime = Date.now();

      // Kiểm tra nếu token đã hết hạn
      if (currentTime > expirationTime) {
        return "Token has expired.";
      } else {
        return "Token is valid.";
      }
    } catch (error) {
      console.error("Invalid token:", error);
      return "Invalid token.";
    }
  };


  return (
    <div className="bg-background-green h-full w-full">
      {console.log(user)}
      <h1 className="text-2xl font-bold text-black pt-12 pl-11">Setting</h1>
      <div className="flex items-center justify-center w-full px-5 pt-10 relative ">
        {/* Phần nội dung chính */}
        <div className="p-6 rounded-lg w-full max-w-md">
          <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-4">
            <div className="flex items-center bg-white border border-white rounded-full p-3 w-full shadow-sm">
              <div className="relative">
                <img
                  src={user?.picture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                {/* Optional: Online status indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-4 flex-grow overflow-hidden">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {user?.name || "User Name"}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-4">
            {/* Phần chữ và ảnh với border trắng */}
            <div className="flex items-center justify-between bg-white border border-white rounded-full p-2 w-full">
              <span className="text-gray-700">Sound</span>
              <img
                src="/assets/images/image 71.png"
                alt="Sound"
                className="w-7 h-4"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button className="bg-pink-500 font-bold text-white px-4 py-2 rounded-full w-full">
              EXPORT WALLET
            </button>
            <button className="bg-orange-500 font-bold text-white px-4 py-2 rounded-full w-full">
              FAQ
            </button>
            <button
              onClick={logout}
              className="bg-gray-500 font-bold text-white px-4 py-2 rounded-full w-full"
            >
              LOG OUT
            </button>
            <button
              onClick={() => checkTokenExpiration(token)}
              className="bg-gray-500 font-bold text-white px-4 py-2 rounded-full w-full"
            >
              CHECKTOKEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
