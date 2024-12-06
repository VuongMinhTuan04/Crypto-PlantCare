function LeaderBoard() {
  return (
    <div className="relative w-full h-full bg-background-green py-14 px-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-black">Leaderboard</h1>
        <div>
          <div className="w-20 h-8 bg-gray-300 absolute top-14 right-28 flex items-center rounded-full">
            <img
              className=" w-8 h-8 z-10 bg-white px-1 py-1 rounded-full"
              src="/assets/images/solana-icon.png"
              alt="image-level"
            />
            <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
              0
            </span>
          </div>
          <div className="w-20 h-8 bg-gray-300 absolute top-14 right-5 flex items-center rounded-full">
            <img
              className=" w-8 h-8 z-10 bg-white px-1 py-1 rounded-full"
              src="/assets/images/solana-icon.png"
              alt="image-level"
            />
            <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
              0
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">Rankings</p>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-green-50 rounded-full p-3">
          <div className="flex items-center space-x-3">
            <span className="text-amber-500 text-lg">🥇</span>
            <span className="font-medium text-black text-base">
              Jonathan.eth
            </span>
          </div>
          <span className="text-gray-500 text-base">3450 pts</span>
          {/* <button className="bg-green-500 text-white px-4 py-1 rounded-md text-sm">Destroy</button> */}
        </div>

        <div className="flex justify-between items-center bg-green-50 rounded-full p-3">
          <div className="flex items-center space-x-3">
            <span className="text-amber-500">🥈</span>
            <span className="font-medium text-black">Jonathan.eth</span>
          </div>
          <span className="text-gray-500">3450 pts</span>
          {/* <button className="bg-green-500 text-white px-4 py-1 rounded-md text-sm">Destroy</button> */}
        </div>

        <div className="flex justify-between items-center bg-green-50 rounded-full p-3">
          <div className="flex items-center space-x-3">
            <span className="text-amber-500">🥉</span>
            <span className="font-medium text-black">Jonathan.eth</span>
          </div>
          <span className="text-gray-500">3450 pts</span>
          {/* <button className="bg-green-500 text-white px-4 py-1 rounded-md text-sm">Destroy</button> */}
        </div>
        <div className="flex justify-between items-center bg-green-50 rounded-full p-3">
          <div className="flex items-center space-x-3">
            <span className="text-black">#4</span>
            <span className="font-medium text-black">Jonthoo</span>
          </div>
          <span className="text-gray-500">3450 pts</span>
          {/* <button className="bg-green-500 text-white px-4 py-1 rounded-md text-sm">Destroy</button> */}
        </div>
        <div className="flex justify-between items-center bg-green-50 rounded-full p-3">
          <div className="flex items-center space-x-3">
            <span className="text-black">#4</span>
            <span className="font-medium text-black">Jonthoo</span>
          </div>
          <span className="text-gray-500">3450 pts</span>
          {/* <button className="bg-green-500 text-white px-4 py-1 rounded-md text-sm">Destroy</button> */}
        </div>
        <div className="flex justify-between items-center bg-green-50 rounded-full p-3">
          <div className="flex items-center space-x-3">
            <span className="text-black">#4</span>
            <span className="font-medium text-black">Jonthoo</span>
          </div>
          <span className="text-gray-500">3450 pts</span>
          {/* <button className="bg-green-500 text-white px-4 py-1 rounded-md text-sm">Destroy</button> */}
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button className="text-green-800 text-sm">&laquo; Prev</button>
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 rounded-full bg-green-500 text-white">
            1
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-200 text-black">
            2
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-200 text-black">
            3
          </button>
          <span className="text-black">...</span>
          <button className="w-8 h-8 rounded-full bg-gray-200 text-black">
            99
          </button>
        </div>
        <button className="text-green-800 text-sm">Next &raquo;</button>
      </div>
    </div>
  );
}

export default LeaderBoard;
