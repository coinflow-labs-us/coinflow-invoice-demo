import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Connection } from "@solana/web3.js";
export const RPC_URL =
  "https://rpc.helius.xyz/?api-key=2f915565-3608-4451-9150-4e72f50f10c2";

export const SOLANA_CONNECTION = new Connection(RPC_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
