function PhoneFrame({ children }) {
  return (
    <div className="w-[375px] h-[660px] border-2 border-black rounded-2xl bg-gray-100 shadow-lg overflow-hidden flex items-center justify-center">
      <div className="w-full h-full bg-background-game bg-contain bg-center bg-no-repeat flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default PhoneFrame;
