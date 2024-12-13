
const LoginSuccessPopup = ({ 
  isOpen, 
  onClose, 
  username = "Người chơi" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-[370px] w-full mx-4">
        <div className="bg-green-500 text-white p-4 rounded-t-xl">
          <h2 className="text-center text-xl font-bold">Đăng Nhập Thành Công</h2>
        </div>
        
        <div className="p-6 text-center">
          <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <p className="text-gray-700 mb-2 text-lg">Chào mừng {username}!</p>
          <p className="text-gray-600 mb-4">Bạn đã đăng nhập thành công vào hệ thống.</p>
          
          <button 
            onClick={onClose} 
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
          >
            Tiếp Tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccessPopup;