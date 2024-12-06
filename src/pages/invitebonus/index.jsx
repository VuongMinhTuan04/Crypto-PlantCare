import React from 'react';

const InviteBonus = () => {
  return (
    <div className="bg-green-200 h-full justify-center p-6 rounded-lg shadow-md">
      <h2 className="flex items-center text-2xl font-bold mb-4 text-black">
        {/* Image with white inner border */}
        <img
          src="assets/images/Rectangle 50.png"
          alt="Icon"
          className="w-5 h-5 mr-2 ring-4 ring-white rounded-full"
        />
        {/* Text */}
        Invite Bonus
      </h2>

      {/* White border with rounded corners */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* Image inside the white border */}
        <img
          src="assets/images/Rectangle 103.png"
          alt="Example"
          className="w-full h-32 object-cover mb-4 rounded-md"
        />
        {/* Text inside the white border */}
        <p className="text-left text-black text-sm mb-2 font-bold">
          To complete this task you need to follow us on X
        </p>
        <p className="text-left text-black text-sm mb-2">
          After subscribing, a verification will be made, you have completed the task and you will
          receive a reward
        </p>
        <p className="text-left text-gray-500 text-sm">Reward from Booster</p>
        <div className="flex items-center">
          {/* Image */}
          <img src="assets/images/image 64.png" alt="Icon" className="w-6 h-6 mr-2" />
          {/* Text */}
          <p className="text-left text-xl font-extrabold text-black">5352</p>
        </div>
      </div>
      {/* Subscribe button */}
      <button className="mt-7 bg-green-600 hover:bg-green-600 w-72 text-white font-bold py-2 px-6 rounded-full block mx-auto">
        SUBSCRIBE TO X
      </button>
    </div>
  );
};

export default InviteBonus;
