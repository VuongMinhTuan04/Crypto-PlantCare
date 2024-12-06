import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WalletContextProvider } from "./utils/WalletContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <WalletContextProvider>
    <App />
  </WalletContextProvider>
);
