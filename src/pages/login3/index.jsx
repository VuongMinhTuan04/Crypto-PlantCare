import { useNavigate } from "react-router-dom";

const Swap = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center bg-background-green h-full justify-center py-8 px-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Swap</h1>
      <p className="text-gray-600 text-sm text-center mb-8 max-w-lg">
        You’ll need 10 $SOL to shake the tree. Swap some ETH for SOL tokens to
        get started!
      </p>

      {/* You Pay: and Balance on the same line */}
      <div className="w-full max-w-md mb-2 flex justify-between items-center px-2">
        <div className="flex items-center">
          <label className="text-sm text-gray-700 font-medium mr-2">
            You pay:
          </label>
        </div>
        <p className="text-sm text-gray-600">Balance: 1000.0 SOL</p>
      </div>

      {/* You Pay Input */}
      <div className="w-80 max-w-md mb-6 flex items-center border border-green-300 rounded-full  overflow-hidden">
        <input
          type="text"
          className="flex-grow border-0 focus:outline-none h-full px-4 text-lg text-gray-800"
          defaultValue={50}
        />
        <div className="flex items-center justify-center bg-green-300 border-l border-green-300 px-4 py-3">
          <img
            src="/assets/images/Rectangle-9.png"
            alt="SOL"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="w-full max-w-md mb-4 border-b-2 border-gray-300"></div>

      {/* You Pay: and Balance on the same line */}
      <div className="w-full max-w-md mb-2 flex justify-between items-center  px-2">
        <div className="flex items-center">
          <label className="text-sm text-gray-700 font-medium mr-2">
            You receive:
          </label>
        </div>
      </div>

      {/* You Pay Input */}
      <div className="w-80 max-w-md mb-6 flex items-center border border-green-300 rounded-full overflow-hidden">
        <input
          type="text"
          className="flex-grow border-0 focus:outline-none h-full px-4 text-lg text-gray-800"
          defaultValue={50}
        />
        <div className="flex items-center justify-center bg-green-300 border-l border-green-300 px-4 py-3">
          <img
            src="/assets/images/Rectangle-10.png"
            alt="SOL"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={() => navigate('/game-login/solana/deposite/mint')}
        className="bg-green-600 text-white font-bold py-3 px-8 rounded-full max-w-xl w-full mt-4 transition-all hover:bg-green-700"
      >
        SWAP
      </button>
    </div>
  );
};

export default Swap;
