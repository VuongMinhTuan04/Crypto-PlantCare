import { createUser, userDetail, userDetailGoogle } from "@/utils/authServices";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const FoundWallet = () => {
  const { publicKey, disconnect } = useWallet();
  const [balance, setBalance] = useState(null);
  const [token, setToken] = useState("");
  const [user, setUser] = useState([]);
  const [userSOL, setUserSOL] = useState(null);

  useEffect(() => {
    // Kiểm tra và xử lý token Google
    const tokenGoogle = localStorage.getItem("tokenGoogle");
    if (tokenGoogle) {
      try {
        const parsedToken = JSON.parse(tokenGoogle);
        setToken(parsedToken);
        const loadUserData = async () => {
          try {
            const resp = await userDetailGoogle(parsedToken);
            setUser(resp.user);
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

  useEffect(() => {
    if (publicKey) {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      // Lấy số dư SOL
      const fetchBalance = async () => {
        const walletPublicKey = new PublicKey(publicKey);
        const lamports = await connection.getBalance(walletPublicKey);
        setBalance(lamports / 1e9); // Chuyển đổi từ lamports sang SOL
      };

      fetchBalance();
      // fetchTokens();
    }
  }, [publicKey]);

  const navigate = useNavigate();
  const icons = [
    {
      id: 1,
      buttonText: "",
      iconImage: "/assets/images/Rectangle 10.png",
    },
    {
      id: 2,
      buttonText: "SQL",
      iconImage: "/assets/images/Rectangle-9.png",
    },
  ];

  useEffect(() => {
    if (!user) {
      return; // Dừng ngay lập tức nếu không có user
    }

    const fetchUserSOLDetails = async () => {
      try {
        const resp = await userDetail(user.userId);
        if (resp.message?.message === "User not found") {
          return; // Dừng nếu user không tồn tại
        }
        setUserSOL(resp.data[0]);
      } catch (error) {
        console.log("Failed to fetch user SOL details:", error);
      }
    };

    fetchUserSOLDetails();
  }, [user]);

  const handleRegister = async () => {
    try {
      // Kiểm tra điều kiện trước khi đăng ký
      if (!publicKey) {
        alert("Vui lòng kết nối ví trước");
        return;
      }

      if (!user?.userId || !user?.email) {
        alert("Thông tin người dùng không đầy đủ");
        return;
      }

      // Kiểm tra số dư SOL tối thiểu
      if (balance < 0.015) {
        alert("Số dư SOL không đủ. Vui lòng nạp thêm.");
        return;
      }

      if (userSOL) {
        navigate("/game-login/waitinggame");
      } else {
        const resp = await createUser(user.userId, user.email, publicKey);
        if (resp.success) {
          alert("Đăng ký thành công");
        } else {
          if(resp.response?.data.message === "A user with that wallet address already exists") {
            alert("Ví này đã được sử dụng")
          }
        }
      }
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      alert("Có lỗi xảy ra khi đăng ký");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect(); // Đảm bảo gọi disconnect là một promise
      console.log("Disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  return (
    <div className="relative w-full h-full bg-background-green py-14 px-8">
      {!publicKey ? (
        <div className="w-full">
          {/* Nút để kết nối ví */}
          <WalletMultiButton />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-10">
            Found the wallet
          </h1>
          <h4 className="text-xl font-bold text-gray-800 mx-5 text-center">
            To get started, you’ll need some SOL on BASE
          </h4>
          <p className="text-gray-600 text-sm text-center m-5">
            Click Deposit in your wallet or use the Deposit SOL function to
            transfer SOL from PLANTCARE. Make sure to have at least 0.015 SOL in
            your balance to proceed.
          </p>

          {/* Amount Input with SQL Icon */}
          <div className="w-80 bg-gray-100 p-2 rounded-full mb-4 flex items-center">
            <input
              type="text"
              value={balance}
              className="w-full text-sm text-gray-700 focus:outline-none px-2 bg-transparent"
            />
            <img
              src={icons[1].iconImage}
              alt={icons[1].buttonText}
              className="w-5 h-5 ml-2" // Added margin-left to separate the icon from the input
            />
          </div>

          {/* Code Input */}
          <div className="w-80 flex items-center bg-green-200 border border-gray-300 rounded-full px-3 py-2 mb-4">
            <input
              type="text"
              placeholder="Enter code"
              value={publicKey}
              className="w-full text-sm text-gray-700 focus:outline-none bg-green-200"
            />
            <button className="ml-2">
              <img
                src={icons[0].iconImage}
                alt={icons[0].buttonText}
                className="w-5 h-5"
              />
            </button>
          </div>

          {/* Deposit Button */}
          <button
            onClick={handleRegister}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-full w-80"
          >
            DEPOSIT
          </button>
          <button
            onClick={handleDisconnect}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-full w-80 mt-5"
          >
            DISCONNECT
          </button>
        </div>
      )}
    </div>
  );
};

export default FoundWallet;
