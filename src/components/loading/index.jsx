import { useEffect, useState } from "react";

const Loading = () => {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingStage, setLoadingStage] = useState('');
  
    // Simulated loading stages
    const loadingStages = [
      { stage: 'Đang tải tài nguyên', percentage: 20 },
      { stage: 'Kết nối máy chủ', percentage: 40 },
      { stage: 'Chuẩn bị giao diện', percentage: 60 },
      { stage: 'Thiết lập', percentage: 80 },
      { stage: 'Sẵn sàng', percentage: 100 }
    ];
  
    useEffect(() => {
      const loadGame = () => {
        loadingStages.forEach((item, index) => {
          setTimeout(() => {
            setLoadingProgress(item.percentage);
            setLoadingStage(item.stage);
          }, (index + 1) * 1000);
        });
      };
  
      loadGame();
    }, []);
  
    return (
      <div className="relative h-full w-full overflow-hidden font-montserrat">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          className="absolute z-0 min-w-full min-h-full object-cover"
        >
          <source src="/assets/videos/background-cho.mp4" type="video/mp4" />
        </video>
  
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 z-10"></div>
  
        {/* Content Container */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full pt-96 text-white px-4">
          {/* Loading Bar Container */}
          <div className="w-full max-w-md bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
            <div 
              className="bg-green-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
  
          {/* Loading Information */}
          <div className="text-center mb-6">
            <p className="text-xl font-semibold mb-2">{loadingStage}</p>
            <p className="text-gray-300">{loadingProgress}%</p>
          </div>
  
          {/* Loading Icon - Placed below */}
        
        </div>
      </div>
    );
  };
  
  export default Loading;