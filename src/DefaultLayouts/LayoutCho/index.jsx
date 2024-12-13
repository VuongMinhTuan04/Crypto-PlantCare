function LayoutCho({ children }) {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-[375px] h-[660px] border-2 border-black rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
        <div className="w-full h-full bg-contain bg-center bg-no-repeat flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default LayoutCho;
