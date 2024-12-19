import React, { useState, useEffect } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js"; // Import để tạo connection với Devnet

const PhantomWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connected, setConnected] = useState(false);

  // Kiểm tra xem Phantom Wallet đã được cài đặt chưa
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        console.log("Phantom wallet found!");
        // Kiểm tra trạng thái ví
        const response = await solana.connect({ onlyIfTrusted: true });
        setWalletAddress(response.publicKey.toString());
        setConnected(true);
      } else {
        alert("Phantom wallet not found! Please install Phantom Wallet.");
      }
    } catch (err) {
      console.error("Error while checking wallet connection:", err);
    }
  };

  // Hàm kết nối ví Phantom
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana) {
        // Cấu hình mạng Devnet
        const network = clusterApiUrl("devnet"); // Đảm bảo ví Phantom sử dụng Devnet
        const connection = new Connection(network, "confirmed");

        // Yêu cầu ví xác nhận lại kết nối (không sử dụng onlyIfTrusted)
        const response = await solana.connect();
        console.log("Connected to Devnet with Public Key:", response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
        setConnected(true);

        // Kiểm tra kết nối tới mạng Devnet
        const balance = await connection.getBalance(response.publicKey);
        console.log("Balance on Devnet:", balance);
      }
    } catch (err) {
      console.error("Error while connecting to wallet:", err);
    }
  };

  // Hàm ngắt kết nối ví Phantom
  const disconnectWallet = () => {
    const { solana } = window;
    if (solana) {
      solana.disconnect(); // Ngắt kết nối ví
      setWalletAddress(null); // Reset địa chỉ ví
      setConnected(false); // Đánh dấu ví không còn kết nối
      console.log("Disconnected from Phantom Wallet");
    }
  };

  // Kiểm tra kết nối khi component load
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Connect to Phantom Wallet on Devnet</h1>
      {!connected ? (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#6200ea",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected to Devnet: {walletAddress}</p>
          <button
            onClick={disconnectWallet}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#ff5722",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default PhantomWallet;
