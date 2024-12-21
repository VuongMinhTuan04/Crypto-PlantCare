import PhoneFrame from '@/components/phoneFrame';

function LayoutGame({ children }) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <PhoneFrame>{children}</PhoneFrame>
    </div>
  );
}

export default LayoutGame;
