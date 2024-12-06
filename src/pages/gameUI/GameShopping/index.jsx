import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const ShopPage = () => {
    const navigate = useNavigate()

  return (
    <div className="bg-background-shop bg-cover bg-center bg-no-repeat py-20 px-8 w-full h-full relative">
      <div className="flex relative -top-6 h-19">
        <div className="w-20 h-8 bg-gray-300 absolute top-0 right-0 flex items-center rounded-full">
          <img
            className=" w-8 h-8 z-10 bg-white px-1 py-1 rounded-full"
            src="/assets/images/solana-icon.png"
            alt="image-level"
          />
          <span className="text-black z-20 font-montserrat font-bold text-center w-12 text-[12px] rounded-xl">
            0
          </span>
        </div>
        <div>
          <button onClick={() => (navigate('/game-playing'))}>
            <ArrowLeftCircleIcon className="size-8 hover:bg-green-600 transition duration-300 rounded-full" />
          </button>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-6 place-items-center h-96">
          <div className=" ">
            <div className="relative w-12 h-12">
              <div className="absolute left-0 w-full h-full">
                <img
                  src="/assets/images/Ellipse-50.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 z-10">
                <img
                  src="/assets/images/icons8-water-100 1.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex space-x-1 items-center absolute text-black  font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
                <span className="ml-2">3</span>
                <img
                  className="w-4 h-4 z-10 bg-white rounded-full"
                  src="/assets/images/solana-icon.png"
                  alt="image-level"
                />
              </span>
            </div>
          </div>
          <div>
            <div className="relative w-12 h-12">
              <div className="absolute left-0 w-full h-full">
                <img
                  src="/assets/images/Ellipse-50.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 z-10">
                <img
                  src="/assets/images/icons8-water-100 1.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex space-x-1 items-center absolute text-black  font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
                <span className="ml-2">3</span>
                <img
                  className="w-4 h-4 z-10 bg-white rounded-full"
                  src="/assets/images/solana-icon.png"
                  alt="image-level"
                />
              </span>
            </div>
          </div>
          <div>
            <div className="relative w-12 h-12">
              <div className="absolute left-0 w-full h-full">
                <img
                  src="/assets/images/Ellipse-50.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 z-10">
                <img
                  src="/assets/images/icons8-water-100 1.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex space-x-1 items-center absolute text-black  font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
                <span className="ml-2">3</span>
                <img
                  className="w-4 h-4 z-10 bg-white rounded-full"
                  src="/assets/images/solana-icon.png"
                  alt="image-level"
                />
              </span>
            </div>
          </div>
          <div>
            <div className="relative w-12 h-12">
              <div className="absolute left-0 w-full h-full">
                <img
                  src="/assets/images/Ellipse-50.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 z-10">
                <img
                  src="/assets/images/icons8-water-100 1.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex space-x-1 items-center absolute text-black  font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
                <span className="ml-2">3</span>
                <img
                  className="w-4 h-4 z-10 bg-white rounded-full"
                  src="/assets/images/solana-icon.png"
                  alt="image-level"
                />
              </span>
            </div>
          </div>
          <div>
            <div className="relative w-12 h-12">
              <div className="absolute left-0 w-full h-full">
                <img
                  src="/assets/images/Ellipse-50.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 z-10">
                <img
                  src="/assets/images/icons8-water-100 1.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex space-x-1 items-center absolute text-black  font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
                <span className="ml-2">3</span>
                <img
                  className="w-4 h-4 z-10 bg-white rounded-full"
                  src="/assets/images/solana-icon.png"
                  alt="image-level"
                />
              </span>
            </div>
          </div>
          <div>
            <div className="relative w-12 h-12">
              <div className="absolute left-0 w-full h-full">
                <img
                  src="/assets/images/Ellipse-50.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 z-10">
                <img
                  src="/assets/images/icons8-water-100 1.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex space-x-1 items-center absolute text-black  font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
                <span className="ml-2">3</span>
                <img
                  className="w-4 h-4 z-10 bg-white rounded-full"
                  src="/assets/images/solana-icon.png"
                  alt="image-level"
                />
              </span>
            </div>
          </div>
          <div>
            <div className="relative w-12 h-12">
              <div className="absolute left-0 w-full h-full">
                <img
                  src="/assets/images/Ellipse-50.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 z-10">
                <img
                  src="/assets/images/icons8-water-100 1.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex space-x-1 items-center absolute text-black  font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
                <span className="ml-2">3</span>
                <img
                  className="w-4 h-4 z-10 bg-white rounded-full"
                  src="/assets/images/solana-icon.png"
                  alt="image-level"
                />
              </span>
            </div>
          </div>
          <div>
            <div className="relative w-12 h-12">
              <div className="absolute left-0 w-full h-full">
                <img
                  src="/assets/images/Ellipse-50.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 z-10">
                <img
                  src="/assets/images/icons8-water-100 1.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex space-x-1 items-center absolute text-black  font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
                <span className="ml-2">3</span>
                <img
                  className="w-4 h-4 z-10 bg-white rounded-full"
                  src="/assets/images/solana-icon.png"
                  alt="image-level"
                />
              </span>
            </div>
          </div>
          <div>
            <div className="relative w-12 h-12">
              <div className="absolute left-0 w-full h-full">
                <img
                  src="/assets/images/Ellipse-50.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 left-2 w-8 h-8 z-10">
                <img
                  src="/assets/images/icons8-water-100 1.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="flex space-x-1 items-center absolute text-black  font-bold bg-white rounded-full w-10 h-5 -bottom-3 right-1 text-center text-[12px] font-sans">
                <span className="ml-2">3</span>
                <img
                  className="w-4 h-4 z-10 bg-white rounded-full"
                  src="/assets/images/solana-icon.png"
                  alt="image-level"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
          <button className="bg-white w-full hover:bg-green-600 transition duration-300 text-green-500 font-bold py-2 px-4 rounded-full">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
