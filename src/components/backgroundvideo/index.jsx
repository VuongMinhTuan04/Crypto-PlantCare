
const VideoBackground = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/assets/videos/backgroundvideo.mp4"
        autoPlay
        loop
        muted
      />

      {/* Content on top of the video */}
      <div className="relative z-10 w-full h-full bg-black bg-opacity-50 text-white">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground;
