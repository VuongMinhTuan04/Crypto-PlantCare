import { getWalletBalance } from "@/scenes/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

const WalletBalance = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (publicKey) {
      getWalletBalance(publicKey.toBase58()).then(setBalance);
    }
  }, [publicKey]);

  return <div>Số dư: {balance} SOL</div>;
};

export default WalletBalance;
