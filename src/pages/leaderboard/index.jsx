function BgLeaderBoard({ children }) {
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="w-[375px] h-[660px] border-4 border-black rounded-2xl bg-gray-100 shadow-lg overflow-hidden flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}

export default BgLeaderBoard;