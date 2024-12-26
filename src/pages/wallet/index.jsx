import {
  converPointsToSol,
  converSolToPoints,
  getUserBySub,
  userDetailGoogle,
} from "@/utils/authServices";
import {
  AdjustmentsHorizontalIcon,
  ArrowDownCircleIcon,
  CheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

// Thêm vào đầu file của bạn
import { PopupThongBao } from "@/components/thongbao";

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
  const [balance, setBalance] = useState(0);
  const [treecoin, setTreecoin] = useState(0);
  const [solClaim, setSolClaim] = useState(0);
  const [solToTransfer, setSolToTransfer] = useState(0);
  const [isClaimEnabled, setIsClaimEnabled] = useState(false);
  const [isClaimEnabled2, setIsClaimEnabled2] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [pointsToConvert, setPointsToConvert] = useState(0);
  const [treePointsUser, setTreePointsUser] = useState(0);
  const [walletAddressNhan, setWalletAddressNhan] = useState("");
  const [user, setUser] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const [userBySub, setUserBySub] = useState(null);
  const [sol, setSol] = useState("");
  const [PTC, setPTC] = useState("");
  const [error, setError] = useState(false)
const [PTCSuccess, setPTCSuccess] = useState(false)
  useEffect(() => {
    if (!userBySub) {
      //alert("Ko tim thay userSub.points");
      return;
    }
    setTreePointsUser(userBySub.points);
  }, [userBySub]);

  useEffect(() => {
    if (!publicKey) {
      return;
    }
    setWalletAddress(publicKey);
  }, [publicKey]);

  useEffect(() => {
    setSolToTransfer(1);
  }, []);

  useEffect(() => {
    setPointsToConvert(200);
  }, []);

  useEffect(() => {
    if (!solToTransfer) {
      setTreecoin(0);
      return;
    }
    const solValue = parseFloat(solToTransfer);
    if (isNaN(solValue) || solValue <= 0) {
      setTreecoin(0);
    } else {
      setTreecoin(solToTransfer * 100);
    }
  }, [solToTransfer]);

  useEffect(() => {
    if (!pointsToConvert) {
      setSolClaim(0);
      return;
    }
    const solValue = parseFloat(pointsToConvert);
    if (isNaN(solValue) || solValue <= 0) {
      setSolClaim(0);
    } else {
      setSolClaim(pointsToConvert / 200);
    }
  }, [pointsToConvert]);

  useEffect(() => {
    setWalletAddressNhan("9We7ffkzoKcbNKoG7wU9gBUeN97256jTLtrsdS8eozKB");
  }, []);

  const [receivedPoints, setReceivedPoints] = useState(0);

  const sendSolTransaction = async () => {
    if (solToTransfer <= 0 || !walletAddress || !walletAddressNhan) {
      alert("Invalid input");
      return;
    }

    //setStatus('Initiating transaction...');

    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    const lamports = solToTransfer * 1000000000; // Chuyển SOL thành Lamports

    try {
      const { solana } = window;

      if (!solana || !solana.isPhantom) {
        alert("Please install Phantom wallet");
        return;
      }

      const { publicKey } = await solana.connect(); // Kết nối ví Phantom
      const senderPublicKey = new PublicKey(String(publicKey));
      const receiverPublicKey = new PublicKey(walletAddressNhan);

      // Lấy recentBlockhash từ mạng Solana
      const { blockhash } = await connection.getLatestBlockhash();

      // Tạo giao dịch
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: senderPublicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: receiverPublicKey,
          lamports: lamports,
        })
      );

      const signedTransaction = await solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Đợi xác nhận giao dịch
      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        alert("Transaction failed");
        return;
      }
      const tokenGoogle = JSON.parse(localStorage.getItem("tokenGoogle"));
      // Gọi API backend để tính điểm
      const response = await converSolToPoints(
        signature,
        walletAddress,
        solToTransfer,
        tokenGoogle
      );
      if (response.error) {
        console.log(response);

        return;
      }

      if (!response.points || !response.total || !response.sol) {
        return;
      }

      setTreePointsUser(response.total);
      setBalance((balance - response.sol).toFixed(5));
      setReceivedPoints(response.points);
      setPTC(response.points)
      setPTCSuccess(true)
      console.log("Thành công chuyển: ", response.sol);
      console.log("Nhận được: ", response.points + "points");
      console.log("Tổng: ", response.total + "points");
    } catch (err) {
      console.error("Transaction failed:", err);

      alert("Transaction failed");
    }
  };

  const [convertPointsSuccess, setConvertPointsSuccess] = useState(false);

  const convertPoints = async () => {
    if (pointsToConvert <= 0 || !walletAddress) {
      alert("Invalid input");
      return;
    }
    try {
      // Lấy token từ localStorage hoặc nơi lưu trữ token của bạn
      const token = JSON.parse(localStorage.getItem("tokenGoogle"));
      if (!token) {
        alert("Ko tim thay token");
        return;
      }

      // Gọi API với token trong header
      const response = await converPointsToSol(
        walletAddress,
        pointsToConvert,
        token
      );
      if(response.error === true) {
        setError(true)
        return;
      }
      console.log(response);
      if (response.points) {
        setTreePointsUser(response.points);
        console.log("Tong sol: ", parseFloat(balance + response.solToReceive));

        setBalance(balance + parseFloat(response.solToReceive));
        setSol(response.solToReceive);
        setConvertPointsSuccess(true);
      }
    } catch (err) {
      console.error("Conversion failed:", err);
    }
  };

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

  useEffect(() => {
    // Cập nhật trạng thái nút Claim

    setIsClaimEnabled(
      parseFloat(solToTransfer) > 0 && treecoin > 0 && solToTransfer < balance
    );
  }, [solToTransfer, treecoin, balance]);

  useEffect(() => {
    // Cập nhật trạng thái nút Claim
    setIsClaimEnabled2(parseFloat(pointsToConvert) > 0 && solClaim > 0);
  }, [pointsToConvert, solClaim]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIconCopy(true);
      setTimeout(() => setIconCopy(false), 2000);
    });
  };

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
            //console.log(resp.user);
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
    // Chỉ gọi API khi userLoaded là true và user có userId
    if (userLoaded && user?.userId) {
      const fetchUserBySub = async () => {
        try {
          const resp = await getUserBySub(user.userId);
          if (!resp) {
            //console.log("User not found");
            return;
          }
          //console.log("Tim thay user: ", resp);
          setUserBySub(resp);
          setUserLoaded(false);
        } catch (error) {
          console.error("Failed to fetch user SOL details:", error);
        }
      };

      fetchUserBySub();
    }
  }, [userLoaded, user, userBySub]);

  return (
    <div className="relative w-full h-full bg-background-green py-14 px-8">
      <PopupThongBao
        hienThi={convertPointsSuccess}
        dongLai={() => setConvertPointsSuccess(false)}
        tieuDe={"Thông báo"}
        noiDung={`Bạn nhận được ${sol} SOL`}
      />
      <PopupThongBao
        hienThi={PTCSuccess}
        dongLai={() => setPTCSuccess(false)}
        tieuDe={"Thông báo"}
        noiDung={`Bạn nhận được ${PTC} PTC`}
      />
      <PopupThongBao
        hienThi={error}
        dongLai={() => setError(false)}
        tieuDe={"Thông báo"}
        noiDung={`!!! Server đang bận. Vui lòng thử lại sau !!!`}
      />
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
                      {!treePointsUser
                        ? "..."
                        : parseFloat(treePointsUser).toFixed(2)}
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
                    <span className="text-black">
                      {!balance ? "..." : parseFloat(balance).toFixed(5)}
                    </span>
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
                    <p className="text-black font-bold">
                      {!balance ? "..." : parseFloat(balance).toFixed(5)}
                    </p>
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
                      onChange={(e) => {
                        //console.log("Input: ",e.target.value);

                        if (e.target.value === "") {
                          //console.log("ROnggg");

                          setSolToTransfer(0);
                          //console.log("SOl: ",solconver);
                          return;
                        }
                        setSolToTransfer(e.target.value);
                      }}
                      value={!solToTransfer ? "" : solToTransfer}
                      placeholder="Input SOL"
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
                  <p className="text-gray-500 text-[12px]">Points Received:</p>
                  <div className="flex relative">
                    <p className="text-black font-bold flex">
                      {!treecoin ? "..." : treecoin}
                    </p>
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
                <button
                  onClick={sendSolTransaction}
                  className={`w-full ${
                    isClaimEnabled
                      ? "bg-blue-500 text-white cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } font-bold text-sm py-3 rounded-full`}
                  disabled={!isClaimEnabled}
                >
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
                    <p className="text-black font-bold">
                      {!treePointsUser
                        ? "..."
                        : parseFloat(treePointsUser).toFixed(2)}{" "}
                      PTC
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-green-600"></div>
              <div className="grid grid-cols-1 items-center gap-1">
                <div className="px-2 rounded-md flex flex-col">
                  <p className="text-gray-500 text-[12px] text-start">
                    You Pay:
                  </p>
                  <div className="flex items-center w-full justify-center relative">
                    <input
                      onChange={(e) => {
                        //console.log("Input: ",e.target.value);

                        if (e.target.value === "") {
                          //console.log("ROnggg");

                          setPointsToConvert(0);
                          //console.log("SOl: ",solconver);
                          return;
                        }
                        setPointsToConvert(e.target.value);
                      }}
                      value={!pointsToConvert ? "" : pointsToConvert}
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
                    <p className="text-black font-bold flex">
                      {!solClaim ? "..." : solClaim}
                    </p>
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
                <button
                  onClick={convertPoints}
                  className={`w-full ${
                    isClaimEnabled2
                      ? "bg-blue-500 text-white cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } font-bold text-sm py-3 rounded-full`}
                  disabled={!isClaimEnabled2}
                >
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
