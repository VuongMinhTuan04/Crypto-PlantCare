export const PopupThongBao = ({ hienThi, dongLai, tieuDe, noiDung }) => {
    if (!hienThi) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
          <div className="text-center">
            <img
              src="/assets/images/tree-coin.png"
              alt="Hình quả"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-green-600 mb-2">{tieuDe}</h2>
            <p className="text-gray-600 text-lg mb-6">{noiDung}</p>
            <button
              onClick={dongLai}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };