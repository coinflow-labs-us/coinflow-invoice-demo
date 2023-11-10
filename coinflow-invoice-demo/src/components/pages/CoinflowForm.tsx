import { useCallback, useEffect, useMemo, useState } from "react";
import { CoinflowPurchase } from "@coinflowlabs/react";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLocalWallet } from "../../wallet/Wallet.tsx";
import SuccessModal from "../modals/SuccessModal.tsx";
import { useInvoiceContext } from "../../context/InvoiceContext.tsx";

export function CoinflowForm() {
  const wallet = useLocalWallet();
  const { publicKey } = useWallet();

  const { invoice, email, amount, validateInvoiceForm } = useInvoiceContext();

  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (publicKey) {
      setIsReady(true);
    }
  }, [publicKey]);

  if (!wallet.connection || !wallet.publicKey) return null;

  return (
    <div className={"flex-1 flex-col h-full flex w-full"}>
      {isReady ? null : (
        <div
          className={
            "flex flex-col lg:flex-row space-y-4 lg:space-y-0 space-x-0 lg:space-x-5 items-center justify-center w-full"
          }
        >
          <div
            onClick={() => {
              if (validateInvoiceForm()) setIsReady(true);
            }}
            className={
              "w-full lg:w-min cursor-pointer hover:bg-indigo-500 transition bg-indigo-600 rounded-3xl p-5 px-6 flex justify-center"
            }
          >
            <span
              className={
                "text-xs lg:text-sm font-semibold text-white whitespace-nowrap"
              }
            >
              Continue as guest
            </span>
          </div>
          <span className={"text-gray-500 text-xs"}>or</span>
          <div className={"large-wallet"}>
            <WalletMultiButton />
          </div>
        </div>
      )}

      <PurchaseForm
        email={email}
        invoice={invoice}
        amount={amount}
        isReady={isReady}
        setIsReady={() => setIsReady(false)}
      />
    </div>
  );
}

function PurchaseForm({
  amount,
  email,
  invoice,
  isReady,
}: {
  amount: string;
  setIsReady: (isReady: boolean) => void;
  isReady: boolean;
  email: string;
  invoice: string;
}) {
  const wallet = useLocalWallet();

  const [successOpen, setSuccessOpen] = useState<boolean>(false);

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

  const transferTx = useMemo(() => {
    if (!wallet.publicKey || !amount || isNaN(Number(amount))) return undefined;
    const usdc = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    const source = getAssociatedTokenAddressSync(usdc, wallet.publicKey);
    const destination = new PublicKey(
      "DBU35xiW5QG6AnE4MmS3x3nVhuWTeTWwWXjXeotHLgAb",
    );

    const toSend = Number(amount) * 1e6;

    const ix = createTransferCheckedInstruction(
      source,
      usdc,
      destination,
      wallet.publicKey,
      toSend,
      6,
    );
    console.log({ ix });
    const tx = new Transaction().add(ix);
    tx.recentBlockhash = Keypair.generate().publicKey.toString();
    tx.feePayer = wallet.publicKey;
    return tx;
  }, [amount, wallet.publicKey]);

  if (!wallet.connection || !amount || Number(amount) === 0) return null;

  return (
    <>
      {isReady ? (
        <div style={{ height: `${height}px` }} className={`w-full`}>
          <CoinflowPurchase
            wallet={wallet}
            merchantId={"coinflow"}
            env={"prod"}
            connection={wallet.connection}
            onSuccess={() => {
              setSuccessOpen(true);
            }}
            transaction={transferTx}
            blockchain={"solana"}
            amount={Number(amount)}
            email={email}
            webhookInfo={{ invoice }}
            loaderBackground={"#FFFFFF"}
            handleHeightChange={handleHeightChange}
            chargebackProtectionData={[
              {
                productName: "RPC Provider Subscription",
                productType: "subscription",
                quantity: Number(amount),
              },
            ]}
          />
        </div>
      ) : null}
      <SuccessModal isOpen={successOpen} setIsOpen={setSuccessOpen} />
    </>
  );
}
