// import { Connection, PublicKey } from "@solana/web3.js";

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");


// //Cấu hình kết nối Solana:
// export const getWalletBalance = async (walletAddress) => {
//   try {
//     const balance = await connection.getBalance(new PublicKey(walletAddress));
//     return balance / 1e9; // Chuyển từ lamports sang SOL
//   } catch (error) {
//     console.error("Error fetching balance:", error);
//     return 0;
//   }
// };
// //Tạo NFT:
// import {
//     createAssociatedTokenAccount,
//     createMint,
//     mintTo,
// } from "@solana/spl-token";

// export const createNFT = async (wallet) => {
//   try {
//     const mint = await createMint(
//       connection,
//       wallet, // Wallet người dùng
//       wallet.publicKey, // Chủ sở hữu
//       null,
//       0 // Số thập phân
//     );

//     const tokenAccount = await createAssociatedTokenAccount(
//       connection,
//       wallet,
//       mint,
//       wallet.publicKey
//     );

//     await mintTo(
//       connection,
//       wallet,
//       mint,
//       tokenAccount,
//       wallet.publicKey,
//       1 // Mint 1 NFT
//     );

//     return mint.toBase58();
//   } catch (error) {
//     console.error("Error creating NFT:", error);
//     throw error;
//   }
// };
// //Giao dịch token:
// import { transfer } from "@solana/spl-token";

// export const transferToken = async (fromWallet, toAddress, mintAddress, amount) => {
//   try {
//     const transaction = await transfer(
//       connection,
//       fromWallet,
//       fromWallet.publicKey,
//       new PublicKey(toAddress),
//       new PublicKey(mintAddress),
//       fromWallet.publicKey,
//       amount
//     );

//     console.log("Transaction signature:", transaction);
//     return transaction;
//   } catch (error) {
//     console.error("Error transferring token:", error);
//     throw error;
//   }
// };

