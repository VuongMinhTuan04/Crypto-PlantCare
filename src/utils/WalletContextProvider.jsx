import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

// Import styles cho Wallet Modal
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletContextProvider = ({ children }) => {
  // Sử dụng mạng Devnet (có thể đổi thành Mainnet khi triển khai thật)
  const network = WalletAdapterNetwork.Devnet;

  // Endpoint cho Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Cấu hình ví Phantom
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
