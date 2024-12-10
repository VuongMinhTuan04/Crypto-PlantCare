const Notification = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-background-green h-96 rounded-lg shadow-lg text-center relative">
        <img src="/assets/images/star.png" alt="" className="size-80" />

        <div className="absolute top-[105px] left-[147px]">
          <span className="text-[40px] font-bold">2</span>
        </div>
        <div className="absolute bottom-20 left-14">
          <div className="text-4xl font-bold text-pink-600">LEVEL UP!</div>
          <button className="mt-4 px-4 py-2 text-white bg-pink-500 rounded-full w-52 hover:bg-pink-600 transition">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
