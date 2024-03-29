import "./App.css";
import { BrandCover } from "./components/pages/BrandCover.tsx";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {useLocalWallet, WalletContextProvider} from "./wallet/Wallet.tsx";
import { Toaster } from "react-hot-toast";
import {useQueryParam} from "./hooks/useQueryParam.ts";
import {useCallback, useEffect, useState} from "react";
import {CoinflowPurchase} from "@coinflowlabs/react";
import {useCoinflowEnv} from "./hooks/useCoinflowEnv.ts";

function Subscribe() {
  return (
    <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
        <WalletContextProvider>
          <div className={"flex flex-1 h-screen w-screen relative"}>
            <Toaster />
            <div className={"grid grid-cols-1 md:grid-cols-2 h-full w-full"}>
              <BrandCover subtext={'Subscribe to a Triton One Plan'}/>
              <PaymentPage />
            </div>
          </div>
        </WalletContextProvider>
      </WalletModalProvider>
    </WalletProvider>
  );
}

function PaymentPage() {
  const wallet = useLocalWallet();
  const connection = wallet.connection;
  const [planCode] = useQueryParam('planCode', '');
  const [accountUuid] = useQueryParam('accountUuid', '');
  const [email] = useQueryParam('email', '');

  const [height, setHeight] = useState<number>(1300);
  const [handleHeightChange, setHandleHeightChange] = useState<
    ((newHeight: string) => void) | undefined
  >(undefined);

  const handleHeight = useCallback((newHeight: string) => {
    setHeight(Number(newHeight));
  }, []);

  useEffect(() => {
    if (wallet.publicKey) {
      setHandleHeightChange(() => handleHeight);
    }
  }, [handleHeight, wallet]);

  const env = useCoinflowEnv();

  if (!planCode || !accountUuid || !email || !connection) return null;

  return (
    <div className={"bg-white md:p-12 lg:p-28 !pt-12 w-full max-w-full"}>
      <div style={{ height: `${height}px` }} className={`w-full`}>
        <CoinflowPurchase
          wallet={wallet}
          merchantId={"triton"}
          env={env}
          onSuccess={(...args) => {
            console.log("success", args);
          }}
          blockchain={"solana"}
          connection={connection}
          email={email}
          webhookInfo={{ accountUuid, email }}
          loaderBackground={"#FFFFFF"}
          handleHeightChange={handleHeightChange}
          chargebackProtectionData={[
            {
              productName: "RPC Provider Subscription",
              productType: "subscription",
              quantity: 1,
            },
          ]}
          planCode={planCode}
        />
      </div>
    </div>
  );
}

export default Subscribe;
