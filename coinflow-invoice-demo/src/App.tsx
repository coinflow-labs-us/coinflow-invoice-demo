import "./App.css";
import { BrandCover } from "./components/pages/BrandCover.tsx";
import { InvoiceForm } from "./components/pages/InvoiceForm.tsx";
import { CoinflowForm } from "./components/pages/CoinflowForm.tsx";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletContextProvider } from "./wallet/Wallet.tsx";
import { InvoiceContextProvider } from "./context/InvoiceContext.tsx";

function App() {
  return (
    <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
        <WalletContextProvider>
          <div className={"flex flex-1 h-screen w-screen relative"}>
            <div className={"grid grid-cols-2 h-full w-full"}>
              <BrandCover />
              <InvoiceContextProvider>
                <div className={"bg-white p-8 md:p-12 lg:p-28"}>
                  <InvoiceForm />
                  <CoinflowForm />
                </div>
              </InvoiceContextProvider>
            </div>
          </div>
        </WalletContextProvider>
      </WalletModalProvider>
    </WalletProvider>
  );
}

export default App;
