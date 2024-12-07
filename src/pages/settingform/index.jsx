import React from 'react';

const SettingsPage = () => {
  return (
    <div className="bg-green-200 h-screen flex items-center justify-center w-full relative">
      {/* Phần vòng tròn và chữ "Setting" */}
      {/* <div className="absolute top-4 left-4 flex items-center">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden mr-2">
          <img
            src="assets/images/Rectangle 50.png"
            alt="Profile"
            className="w-4 h-4 object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-black">Setting</h2>
      </div> */}

      {/* Phần nội dung chính */}
      <div className="bg-green-200 p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-4">
          {/* Phần chữ và ảnh với border trắng */}
          <div className="flex items-center justify-between bg-white border border-white rounded-full p-2 w-full">
            <span className="text-gray-700">Sound</span>
            <img src="assets/images/image 71.png" alt="Sound" className="w-7 h-4" />
          </div>
        </div>
        <div className="space-y-4">
          <button className="bg-pink-500 font-bold text-white px-4 py-2 rounded-full w-full">
            EXPORT WALLET
          </button>
          <button className="bg-orange-500 font-bold text-white px-4 py-2 rounded-full w-full">
            FAQ
          </button>
          <button className="bg-gray-500 font-bold text-white px-4 py-2 rounded-full w-full">
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
