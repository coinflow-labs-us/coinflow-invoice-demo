import "./App.css";
import { BrandCover } from "./components/pages/BrandCover.tsx";
import { InvoiceForm } from "./components/pages/InvoiceForm.tsx";
import { CoinflowForm } from "./components/pages/CoinflowForm.tsx";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletContextProvider } from "./wallet/Wallet.tsx";
import { InvoiceContextProvider } from "./context/InvoiceContext.tsx";
import { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

function App() {
  const [searchParams] = useSearchParams();

  searchParams.get("amount");
  return (
    <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
        <WalletContextProvider>
          <div className={"flex flex-1 h-screen w-screen relative"}>
            <Toaster />
            <div className={"grid grid-cols-1 md:grid-cols-2 h-full w-full"}>
              <BrandCover />
              <InvoiceContextProvider urlAmount={searchParams.get("amount")}>
                <PaymentPage />
              </InvoiceContextProvider>
            </div>
          </div>
        </WalletContextProvider>
      </WalletModalProvider>
    </WalletProvider>
  );
}

function PaymentPage() {
  return (
    <div className={"bg-white p-1 md:p-12 lg:p-28 w-full max-w-full"}>
      <InvoiceForm />
      <CoinflowForm />
    </div>
  );
}

export default App;
