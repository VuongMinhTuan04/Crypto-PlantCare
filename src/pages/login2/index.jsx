import { useNavigate } from "react-router-dom";

const FoundWallet = () => {
  const navigate = useNavigate()
  const icons = [
    {
      id: 1,
      buttonText: '',
      iconImage: '/assets/images/Rectangle 10.png',
    },
    {
      id: 2,
      buttonText: 'SQL',
      iconImage: '/assets/images/Rectangle-9.png',
    },
  ];

  return (
    <div className="flex flex-col items-center bg-background-green h-full justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">Found the wallet</h1>
      <h4 className="text-xl font-bold text-gray-800 mx-5 text-center">
        To get started, you’ll need some SOL on BASE
      </h4>
      <p className="text-gray-600 text-sm text-center m-5">
        Click Deposit in your wallet or use the Deposit SOL function to transfer SOL from PLANTCARE.
        Make sure to have at least 0.015 SOL in your balance to proceed.
      </p>

      {/* Amount Input with SQL Icon */}
      <div className="w-80 bg-gray-100 p-2 rounded-full mb-4 flex items-center">
        <input
          type="text"
          value="1000.0"
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
          className="w-full text-sm text-gray-700 focus:outline-none bg-green-200"
        />
        <button className="ml-2">
          <img src={icons[0].iconImage} alt={icons[0].buttonText} className="w-5 h-5" />
        </button>
      </div>

      {/* Deposit Button */}
      <button
        onClick={() => (navigate('/game-login/solana/deposite'))}
        className="bg-green-600 text-white font-bold py-2 px-4 rounded-full w-80"
      >
        DEPOSIT
      </button>
    </div>
  );
};

export default FoundWallet;
