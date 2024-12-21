import React, { useState } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const SOLANA_NETWORK = "https://api.devnet.solana.com";

const AirdropSol = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(0);

  const requestAirdrop = async () => {
    try {
      if (!walletAddress) {
        alert("Please enter a valid wallet address!");
        return;
      }

      const connection = new Connection(SOLANA_NETWORK, "confirmed");
      const publicKey = new PublicKey(walletAddress);

      // Yêu cầu airdrop 2 SOL
      const airdropSignature = await connection.requestAirdrop(publicKey, 5 * LAMPORTS_PER_SOL);

      // Xác nhận giao dịch
      await connection.confirmTransaction(airdropSignature);

      // Cập nhật số dư
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);

      alert("Airdrop successful!");
    } catch (err) {
      console.error(err);
      alert("Airdrop failed!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Solana Devnet Faucet</h1>
      <input
        type="text"
        placeholder="Enter your wallet address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px", color:"black" }}
      />
      <br />
      <button
        onClick={requestAirdrop}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Request Airdrop
      </button>
      <div style={{ marginTop: "20px" }}>
        <h2>Wallet Balance: {balance} SOL</h2>
      </div>
    </div>
  );
};

export default AirdropSol;
