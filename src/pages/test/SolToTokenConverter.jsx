import React, { useState, useEffect } from "react";
import axios from "axios";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";


const PhantomWallet = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletAddressNhan, setWalletAddressNhan] = useState(null);
    const [walletAddressNhanPoints, setWalletAddressNhanPoints] = useState(null);
    const [connected, setConnected] = useState(false);
    const [solBalance, setSolBalance] = useState(0);
    const [transactionStatus, setTransactionStatus] = useState("");
    const [receivedPoints, setReceivedPoints] = useState(0);
    const [solToTransfer, setSolToTransfer] = useState(0);
    const [points, setPoints] = useState(0);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Cập nhật giá trị của walletAddressNhan khi component render lần đầu
        setWalletAddressNhan("9We7ffkzoKcbNKoG7wU9gBUeN97256jTLtrsdS8eozKB");
        setWalletAddressNhanPoints("5cuezptDmRVuJSEs1Avhi4gWvEEBnE1bJCpXjwLs8nu4");
        setPoints(100);
    }, []); // Thêm mảng rỗng để chỉ gọi một lần khi component mount

    const addRandomUser = async () => {
        try {
            const response = await axios.post('http://localhost:5000/items');
            setUsers([...users, response.data]); // Cập nhật danh sách người dùng mới
            alert('User added successfully!');
        } catch (err) {
            console.error('Error adding user:', err);
            alert('Failed to add user');
        }
    };

    // Kiểm tra ví Phantom đã được kết nối chưa
    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window;
            if (solana && solana.isPhantom) {
                console.log("Phantom wallet found!");
                const response = await solana.connect({ onlyIfTrusted: true });
                setWalletAddress(response.publicKey.toString());
                setConnected(true);

                const connection = new Connection("https://api.devnet.solana.com", "confirmed");
                const publicKey = new PublicKey(response.publicKey);
                const balance = await connection.getBalance(publicKey);
                setSolBalance(balance / 1000000000);
            } else {
                alert("Phantom wallet not found! Please install Phantom Wallet.");
            }
        } catch (err) {
            console.error("Error while checking wallet connection:", err);
        }
    };

    const connectWallet = async () => {
        try {
            const { solana } = window;
            if (solana) {
                const response = await solana.connect();
                setWalletAddress(response.publicKey.toString());
                setConnected(true);

                const connection = new Connection("https://api.devnet.solana.com", "confirmed");
                const publicKey = new PublicKey(response.publicKey);
                const balance = await connection.getBalance(publicKey);
                setSolBalance(balance / 1000000000);
            }
        } catch (err) {
            console.error("Error while connecting to wallet:", err);
        }
    };

    const claimSolTransaction = async () => {
        if (points <= 0) {
            alert("Invalid points amount.");
            return;
        }

        setTransactionStatus("Dang doi point sang solona");
        try {

            // Gọi API backend để tính điểm
            const response = await axios.post("http://localhost:5000/api/claim-sol", {
                points: points,
                walletAddressNhan: walletAddressNhanPoints,
            });

            setReceivedPoints(Number(response.data.solToReceive).toFixed(2));
            console.log("Doi so points: " + points);
            console.log("Nhan duoc: " + Number(response.data.solToReceive).toFixed(2));
            console.log("Con lai points: " + Number(response.data.points).toFixed(2));
        } catch (err) {
            console.error("Transaction failed:", err);
            setTransactionStatus("Transaction failed.");
        }
    };

    const sendSolTransaction = async () => {
        if (solToTransfer <= 0 || solToTransfer > solBalance) {
            alert("Invalid SOL amount.");
            return;
        }

        setTransactionStatus("Initiating transaction...");

        const lamports = solToTransfer * 1000000000; // Chuyển SOL sang Lamports

        try {
            const { solana } = window;
            const connection = new Connection("https://api.devnet.solana.com", "confirmed");

            // Lấy recentBlockhash từ mạng Solana
            const { blockhash } = await connection.getLatestBlockhash();

            const transaction = new Transaction({
                recentBlockhash: blockhash, // Gán recentBlockhash vào giao dịch
                feePayer: new PublicKey(walletAddress), // Gán ví người gửi làm fee payer
            }).add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(walletAddress),
                    toPubkey: new PublicKey(walletAddressNhan),
                    lamports: lamports,
                })
            );

            // Ký giao dịch với ví người dùng
            const signedTransaction = await solana.signTransaction(transaction);

            // Gửi giao dịch
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            // Chờ xác nhận giao dịch
            const confirmation = await connection.confirmTransaction(signature);

            if (confirmation.value.err) {
                setTransactionStatus("Transaction failed.");
                return;
            }

            setTransactionStatus("Transaction successful!");

            // Gọi API backend để tính điểm
            const response = await axios.post("http://localhost:5000/api/convert-sol", {
                solToTransfer: solToTransfer,
                walletAddress: walletAddress,
                walletAddressNhan: walletAddressNhan,
            });

            setReceivedPoints(Number(response.data.receivedPoints).toFixed(2));
            console.log("Chuyen thanh cong: " + response.data.solToTransfer);
            console.log("Nhan duoc: " + Number(response.data.receivedPoints).toFixed(2));
            console.log("Tong points: " + Number(response.data.totalPoints).toFixed(2));
        } catch (err) {
            console.error("Transaction failed:", err);
            setTransactionStatus("Transaction failed.");
        }
    };


    const disconnectWallet = () => {
        const { solana } = window;
        if (solana) {
            solana.disconnect();
            setWalletAddress(null);
            setConnected(false);
            setSolBalance(0);
            setTransactionStatus("");
            setReceivedPoints(0);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className="text-center mt-12">
            <div>
                <button onClick={addRandomUser} className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Add Random User
                </button>

                <div>
                    <h2>Users:</h2>
                    <ul>
                        {users.map((user, index) => (
                            <li key={index}>
                                ID: {user._id},
                                Name: {user.name}, Email: {user.email}, Points: {user.points}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-6">Connect to Phantom Wallet on Devnet</h1>
            {!connected ? (
                <button
                    onClick={connectWallet}
                    className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="mt-6">
                    <p className="text-lg">Connected to Devnet: {walletAddress}</p>
                    <p className="text-lg">SOL Balance: {solBalance} SOL</p>

                    <input
                        type="number"
                        value={solToTransfer}
                        onChange={(e) => setSolToTransfer(Number(e.target.value))}
                        min="0.01"
                        max={solBalance}
                        step="0.01"
                        placeholder="Enter SOL amount"
                        className="mt-4 p-2 text-black border border-gray-300 rounded-lg w-48"
                    />

                    <button
                        onClick={sendSolTransaction}
                        className="mt-4 px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        Transfer SOL to
                    </button>

                    <input
                        type="text"
                        onChange={(e) => setWalletAddressNhan(e.target.value)}
                        value={"9We7ffkzoKcbNKoG7wU9gBUeN97256jTLtrsdS8eozKB"}
                        placeholder="Enter Wallet 2 Address"
                        className="mt-4 p-2 text-black border border-gray-300 rounded-lg w-48"
                    />

                    <p className="mt-4 text-lg">{transactionStatus}</p>
                    <p className="mt-2 text-lg">Received Points after transaction: {receivedPoints}</p>
                    <hr />
                    <div>
                    <input
                        type="number"
                    
                        onChange={(e) => setPoints(Number(e.target.value))}
                        min="100"
                        step="100"
                        placeholder="Enter Points amount"
                        className="mt-4 p-2 text-black border border-gray-300 rounded-lg w-48"
                    />

                    <button
                        onClick={claimSolTransaction}
                        className="mt-4 px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        Claim to
                    </button>

                    <input
                        type="text"
                        onChange={(e) => setWalletAddressNhanPoints(e.target.value)}
                        value={"5cuezptDmRVuJSEs1Avhi4gWvEEBnE1bJCpXjwLs8nu4"}
                        placeholder="Enter Wallet 2 Address"
                        className="mt-4 p-2 text-black border border-gray-300 rounded-lg w-48"
                    />

                    </div>
                    <button
                        onClick={disconnectWallet}
                        className="mt-4 px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Disconnect Wallet
                    </button>
                    
                </div>
            )}
        </div>
    );
};

export default PhantomWallet;
