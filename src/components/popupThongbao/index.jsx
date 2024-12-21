
export const GameRewardPopup = ({ isOpen, onClose }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 z-50
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      >
        <div 
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            bg-gradient-to-b from-emerald-800 to-emerald-900
            rounded-2xl shadow-2xl w-[90%] max-w-[400px] transform transition-all duration-300
            border-4 border-emerald-600
            ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Top Decoration */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="px-6 py-1 bg-yellow-500 rounded-full border-2 border-yellow-600 shadow-lg">
              <span className="text-sm font-bold text-yellow-900">COMPLETED!</span>
            </div>
          </div>

          {/* Header */}
          <div className="pt-8 pb-4 text-center">
            <h2 className="text-2xl font-bold text-emerald-300 pixel-font tracking-wide mb-1">
              YOUR REWARDS
            </h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-emerald-500 rounded-full"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="bg-emerald-950/50 rounded-xl p-4 border-2 border-emerald-700">
              <div className="text-center space-y-3">
                {/* Coin Animation Container */}
                <div className="relative h-24 flex justify-center items-center">
                  <div className="absolute">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/20 animate-ping"></div>
                  </div>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center">
                        <img src="/assets/images/tree-coin.png" alt="" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-emerald-300 text-lg">You received</div>
                  <div className="text-4xl font-bold text-yellow-500 pixel-font">
                    500 PTC
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 flex justify-center">
            <button
              onClick={onClose}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold 
                py-3 px-12 rounded-xl border-2 border-emerald-400
                shadow-lg hover:shadow-emerald-500/50
                transform hover:-translate-y-0.5
                transition-all duration-200 pixel-font
                relative overflow-hidden
                group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000">
              </div>
              <span>CLAIM</span>
            </button>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>
        </div>
      </div>
    </>
  );
};


