import { getUserBySub, userDetail, userDetailGoogle } from "@/utils/authServices";
import {
  AdjustmentsHorizontalIcon,
  ArrowDownCircleIcon,
  CheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function truncateMiddle(text, startLength = 15, endLength = 4) {
  if (text.length <= startLength + endLength) {
    return text;
  }
  return `${text.slice(0, startLength)}...${text.slice(-endLength)}`;
}

const Popup = ({ onClose }) => {
  const { disconnect } = useWallet();
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold text-center mb-4">Confirm Logout</h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-around">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            onClick={() => {
              disconnect();
              onClose();
            }}
          >
            Log out
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function Wallet() {
  const [activeTab, setActiveTab] = useState(1); // 1 = Account, 2 = Swap, 3 = Reward
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [showPopup, setShowPopup] = useState(false);
  const [iconCopy, setIconCopy] = useState(false);
  const [balance, setBalance] = useState(null);
  const [treecoin, setTreecoin] = useState(0);

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


  // useEffect(() => {
  //   setUserId(localStorage.getItem('userId'));
  //   if(userId){
  //     console.log("Day la user Id: ",userId);
  //   }else{
  //     console.log("userId trong");
  //   }
    
    
  // }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIconCopy(true);
      setTimeout(() => setIconCopy(false), 2000);
    });
  };



  const [user, setUser] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  useEffect(() => {
    // Kiểm tra và xử lý token Google
    const tokenGoogle = localStorage.getItem("tokenGoogle");
    if (tokenGoogle) {
      try {
        const parsedToken = JSON.parse(tokenGoogle);
        const loadUserData = async () => {
          try {
            const resp = await userDetailGoogle(parsedToken);
            
            setUser(resp.user);
            setUserLoaded(true);
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

  const [userBySub, setUserBySub] = useState(null);

  useEffect(() => {
    // Chỉ gọi API khi userLoaded là true và user có userId
    if (userLoaded && user?.userId) {
      const fetchUserBySub = async () => {
        try {
          const resp = await getUserBySub(user.userId);
          if (!resp) {
            console.log("User not found");
            return;
          }
          console.log("Tim thay user: ", resp);
          setUserBySub(resp);
        } catch (error) {
          console.error("Failed to fetch user SOL details:", error);
        }
      };

      fetchUserBySub();
    }
  }, [userLoaded, user]);




  return (
    <div className="relative w-full h-full bg-background-green py-14 px-8">
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      {!publicKey ? (
        <div className="w-full">
          {/* Nút để kết nối ví */}
          <WalletMultiButton />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold text-black">Wallet</h1>
            <button onClick={() => setShowPopup(true)}>
              <AdjustmentsHorizontalIcon className="size-6 text-black" />
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              className={`px-4 py-2 w-24 h-10 rounded-full text-sm font-medium ${
                activeTab === 1
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-500 border border-green-500"
              }`}
              onClick={() => setActiveTab(1)}
            >
              Account
            </button>
            <button
              className={`px-4 py-2 w-24 h-10 rounded-full text-sm font-medium ${
                activeTab === 2
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-500 border border-green-500"
              }`}
              onClick={() => setActiveTab(2)}
            >
              Swap
            </button>
            <button
              className={`px-4 py-2 rounded-full w-24 h-10 text-sm font-medium ${
                activeTab === 3
                  ? "bg-green-500 text-white"
                  : "bg-white text-green-500 border border-green-500"
              }`}
              onClick={() => setActiveTab(3)}
            >
              Rewards
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 1 && (
            <div className="space-y-4 ">
              <div className="mb-6">
                <p className="text-sm text-gray-600">Fren pet wallet:</p>
                <div className="flex justify-between items-center mt-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                  <p className="truncate text-black text-sm">
                    {truncateMiddle(String(publicKey))}
                  </p>
                  <button
                    onClick={() => handleCopy(publicKey)}
                    className="ml-2 text-gray-500 hover:text-green-500 flex items-center"
                    title="Copy to clipboard"
                  >
                    {iconCopy ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <ClipboardDocumentIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="">
                <div className="flex justify-between items-center bg-white px-4 py-2 rounded-t-xl border-b-2 border-orange-600">
                  <span className="flex space-x-2 w-full relative text-sm font-medium">
                    <span className="text-black flex absolute right-0">
                      <img
                        src="/assets/images/tree-coin.png"
                        alt=""
                        className="size-5 mr-1"
                      />
                      PTC
                    </span>
                    <span className="text-black text-sm font-medium">
                      {!userBySub?'...':userBySub.points}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white px-4 py-2 rounded-b-xl ">
                  <span className="flex w-full relative space-x-2 text-sm font-medium">
                    <span className="text-black flex absolute right-0">
                      <img
                        src="/assets/images/solana-icon.png"
                        alt=""
                        className="size-5 mr-1"
                      />
                      SOL
                    </span>
                    <span className="text-black">{balance}</span>
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-black"></div>

              <div className="bg-white flex px-4 py-3 rounded-xl border border-gray-200 text-center">
                <p className="text-sm text-start pr-4 text-gray-600 mb-2">
                  Your code to invite friends and get 10% on their $SOL spent:
                </p>
                <p className="text-black font-medium mt-2">89q24tg</p>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="bg-white px-4 py-1 rounded-xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="my-6 border-t border-dashed border-black"></div>
                  <img
                    src="/assets/images/solana-icon.png"
                    alt=""
                    className="size-8"
                  />
                  <div>
                    <p className="text-gray-500 text-sm">Balance</p>
                    <p className="text-black font-bold">6.32492421 SOL</p>
                  </div>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-green-600"></div>
              <div className="grid grid-cols-1 items-center gap-1">
                <div className="px-2 rounded-md flex flex-col">
                  <p className="text-gray-500 text-[12px] text-start">
                    You Pay:{" "}
                  </p>
                  <div className="flex items-center w-full justify-center relative">
                    <input
                      placeholder="50.0"
                      className="w-full bg-transparent text-start text-black font-bold border-b-2 px-2 py-1 focus:outline-none focus:ring-0"
                    />
                    <span className="text-black flex absolute right-1">
                      <img
                        src="/assets/images/solana-icon.png"
                        alt=""
                        className="size-6"
                      />
                      SOL
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center text-gray-400 text-2xl">
                  <ArrowDownCircleIcon className="size-8 text-white my-3" />
                </div>
                <div className="bg-white px-4 py-1 rounded-full  border border-gray-200 flex flex-col">
                  <p className="text-gray-500 text-[12px]">Burn pet score:</p>
                  <div className="flex relative">
                    <p className="text-black font-bold flex">500.0</p>
                    <span className="text-black flex absolute right-0 bottom-2">
                      <img
                        src="/assets/images/tree-coin.png"
                        alt=""
                        className="size-6"
                      />
                      PTC
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <button className="w-full bg-gray-300 text-gray-500 font-bold text-sm py-3 rounded-full cursor-not-allowed">
                  CLAIM REWARDS
                </button>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="bg-white px-4 py-1 rounded-xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="my-6 border-t border-dashed border-black"></div>
                  <img
                    src="/assets/images/tree-coin.png"
                    alt=""
                    className="size-8"
                  />
                  <div>
                    <p className="text-gray-500 text-sm">Balance</p>
                    <p className="text-black font-bold">6.32492421 PTC</p>
                  </div>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-green-600"></div>
              <div className="grid grid-cols-1 items-center gap-1">
                <div className="px-2 rounded-md flex flex-col">
                  <p className="text-gray-500 text-[12px] text-start">
                    Burn pet score:{" "}
                  </p>
                  <div className="flex items-center w-full justify-center relative">
                    <input
                      placeholder="50.0"
                      className="w-full bg-transparent text-start text-black font-bold border-b-2 px-2 py-1 focus:outline-none focus:ring-0"
                    />
                    <span className="text-black flex absolute right-1">
                      <img
                        src="/assets/images/tree-coin.png"
                        alt=""
                        className="size-6"
                      />
                      PTC
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center text-gray-400 text-2xl">
                  <ArrowDownCircleIcon className="size-8 text-white my-3" />
                </div>
                <div className="bg-white px-4 py-1 rounded-full  border border-gray-200 flex flex-col">
                  <p className="text-gray-500 text-[12px]">You receicve:</p>
                  <div className="flex relative">
                    <p className="text-black font-bold flex">500.0</p>
                    <span className="text-black flex absolute right-0 bottom-2">
                      <img
                        src="/assets/images/solana-icon.png"
                        alt=""
                        className="size-6"
                      />
                      SOL
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <button className="w-full bg-gray-300 text-gray-500 font-bold text-sm py-3 rounded-full cursor-not-allowed">
                  CLAIM REWARDS
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Wallet;
