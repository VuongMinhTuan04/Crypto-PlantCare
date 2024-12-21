import { Jupiter } from "@jup-ag/core";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useState } from "react";

const SolToUsdc = () => {
  const [amount, setAmount] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
  const connection = new Connection(clusterApiUrl("mainnet-beta"));

  const swapSolToUsdc = async () => {
    try {
      // Jupiter setup
      const jupiter = await Jupiter.load({
        connection,
        cluster: "mainnet-beta",
        user: new PublicKey("<YOUR_WALLET_ADDRESS>"),
      });

      // Convert SOL to USDC
      const inputAmount = parseFloat(amount) * 1e9; // Convert SOL to lamports
      const routes = await jupiter.computeRoutes({
        inputMint: new PublicKey(Jupiter.SOL_MINT),
        outputMint: new PublicKey(Jupiter.USDC_MINT),
        amount: inputAmount,
        slippage: 1, // 1% slippage
      });

      if (routes.routesInfos.length > 0) {
        const { execute } = await jupiter.exchange({
          routeInfo: routes.routesInfos[0],
        });
        const result = await execute();

        if (result.error) {
          console.error("Swap failed:", result.error);
        } else {
          console.log("Swap successful:", result);
          setUsdcAmount(result.outputAmount / 1e6); // Convert USDC to readable format
        }
      } else {
        console.log("No routes available");
      }
    } catch (error) {
      console.error("Error during swap:", error);
    }
  };

  return (
    <div>
      <h1>Swap SOL to USDC</h1>
      <input
        type="number"
        placeholder="Enter SOL amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={swapSolToUsdc}>Swap</button>
      {usdcAmount && <p>USDC Amount: {usdcAmount} USDC</p>}
    </div>
  );
};

export default SolToUsdc;
