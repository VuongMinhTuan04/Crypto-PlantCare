import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

const WalletInfo = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (publicKey) {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");

      // Lấy số dư SOL
      const fetchBalance = async () => {
        const walletPublicKey = new PublicKey(publicKey);
        const lamports = await connection.getBalance(walletPublicKey);
        setBalance(lamports / 1e9); // Chuyển đổi từ lamports sang SOL
      };

      // Lấy danh sách token
      const fetchTokens = async () => {
        const walletPublicKey = new PublicKey(publicKey);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
          programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        });

        const tokenList = tokenAccounts.value.map((account) => {
          const accountInfo = account.account.data.parsed.info;
          return {
            mint: accountInfo.mint,
            balance: accountInfo.tokenAmount.uiAmount,
          };
        });

        setTokens(tokenList);
      };

      fetchBalance();
      fetchTokens();
    }
  }, [publicKey]);

  return (
    <div>
      <h1>Wallet Information</h1>
      {publicKey ? (
        <>
          <p>Public Key: {publicKey.toBase58()}</p>
          <p>Balance: {balance} SOL</p>
          <h2>Tokens:</h2>
          <ul>
            {tokens.map((token, index) => (
              <li key={index}>
                Mint: {token.mint}, Balance: {token.balance}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Connect your wallet to see the information.</p>
      )}
    </div>
  );
};

export default WalletInfo;
