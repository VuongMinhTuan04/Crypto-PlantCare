function LayoutCho({ children }) {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div
      className="w-full max-w-[480px] sm:max-w-[375px] h-full sm:h-[580px] md:h-[710px] md:max-w-[440px]
                 bg-gray-100 shadow-lg overflow-hidden flex items-center justify-center"
    >
        <div className="w-full h-full bg-contain bg-center bg-no-repeat flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default LayoutCho;
