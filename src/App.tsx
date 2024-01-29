import "./App.css";
import { BrandCover } from "./components/pages/BrandCover.tsx";
import {WalletProvider} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {WalletContextProvider} from "./wallet/Wallet.tsx";
import { InvoiceContextProvider } from "./context/InvoiceContext.tsx";
import { Toaster } from "react-hot-toast";
import {InvoiceForm} from "./components/pages/InvoiceForm.tsx";
import {CoinflowInvoiceForm} from "./components/pages/CoinflowInvoiceForm.tsx";

function App() {
  return (
    <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
        <WalletContextProvider>
          <div className={"flex flex-1 h-screen w-screen relative"}>
            <Toaster />
            <div className={"grid grid-cols-1 md:grid-cols-2 h-full w-full"}>
              <BrandCover subtext={'Pay your Triton One RPC invoice here. Include your email address and invoice number so we can match the payment to your account.'}/>
              <InvoiceContextProvider>
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
      <CoinflowInvoiceForm />
    </div>
  );
}

export default App;
