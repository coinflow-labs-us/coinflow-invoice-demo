import {useCallback, useEffect, useMemo, useState} from "react";
import {CoinflowPurchase, PaymentMethods} from "@coinflowlabs/react";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useLocalWallet } from "../../wallet/Wallet.tsx";
import SuccessModal from "../modals/SuccessModal.tsx";
import { useInvoiceContext } from "../../context/InvoiceContext.tsx";
import usdc from "../../assets/usdc-logo.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { truncateString } from "../../utils/helpers.ts";
import {useCoinflowEnv} from "../../hooks/useCoinflowEnv.ts";

enum PaymentMethod {
  Guest = "guest",
  Wallet = "wallet",
}

export function CoinflowInvoiceForm() {
  const wallet = useLocalWallet();
  const { publicKey } = useWallet();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Guest); 
  const [successId, setSuccessId] = useState<string | null>(null);

  const {
    invoice,
    email,
    amount,
    formIsComplete,
    validateInvoiceForm,
    successSignature,
    setSuccessSignature,
  } = useInvoiceContext();

  const disabled = useMemo(() => {
    return !formIsComplete();
  }, [formIsComplete]);

  if (!wallet.connection || !wallet.publicKey) return null;

  return (
    <div className={"flex-1 flex-col h-full flex w-full mt-5 space-y-2"}>
      <div className={"flex space-x-4 w-full px-4"}>
        <div
          onClick={() => {
            if (validateInvoiceForm()) {
              setPaymentMethod(PaymentMethod.Guest);
            }
          }}
          className={`group cursor-pointer items-center py-5 flex justify-center flex-col ${
            paymentMethod === PaymentMethod.Guest
              ? "ring-2 ring-indigo-500"
              : "ring-[0.5px] ring-gray-200"
          } flex-1 rounded-2xl hover:bg-gray-50 transition`}
        >
          {/* Guest Payment Option */}
          <div className={"flex items-center"}>
            <div
                className={
                  "rounded-full h-10 w-10 flex bg-gray-100 items-center justify-center border-4 border-white group-hover:border-gray-50"
                }
            >
              <i className={"bx bxs-credit-card-alt text-gray-700"} />
            </div>
            <div
                className={
                  "rounded-full h-10 w-10 flex bg-gray-100 items-center justify-center border-4 border-white group-hover:border-gray-50 -ml-3"
                }
            >
              <i className={"bx bxs-bank text-gray-700"} />
            </div>
          </div>

          <span className={"text-sm text-gray-800 whitespace-nowrap mt-2"}>
            Card or ACH Payment
          </span>
        </div>

        <div className={'text-gray-600 h-full flex items-center'}>
          <span>or</span>
        </div>

        {/* Wallet Payment Option */}
        <div className={"relative flex-1 hover:bg-gray-50 transition"}>
          <div
            onClick={() => {
              if (validateInvoiceForm()) setPaymentMethod(PaymentMethod.Wallet);
            }}
            className={`${
              paymentMethod === PaymentMethod.Wallet
                ? "ring-2 ring-indigo-500"
                : "ring-[0.5px] ring-gray-200"
            } items-center py-5 flex h-[140px] justify-center cursor-pointer flex-col flex-1 rounded-2xl transition`}
          >
            <div className={"flex items-center"}>
              {/* <div
                  className={
                    "rounded-full h-10 w-10 flex bg-gray-100 items-center justify-center border-4 border-white group-hover:border-gray-50"
                  }
              >
                <i className={"bx bxs-credit-card-alt text-gray-700"} />
              </div> */}
              {/* <div
                  className={
                    "rounded-full h-10 w-10 flex bg-gray-100 items-center justify-center border-4 border-white group-hover:border-gray-50 -ml-3"
                  }
              >
                <i className={"bx bxs-bank text-gray-700"} />
              </div> */}
              <div
                  className={
                    "rounded-full h-10 w-10 flex bg-gray-100 items-center justify-center border-4 border-white group-hover:border-gray-50 -ml-3"
                  }
              >
                <img className={"h-7 object-contain"} src={usdc} alt={"logo"} />
              </div>
            </div>

            <span className={"text-sm text-gray-800 whitespace-nowrap mt-2"}>
              Pay with Crypto
            </span>

            {publicKey && <span className={"text-xs text-gray-400 whitespace-nowrap mt-1"}>
                Connected to {truncateString(publicKey.toString())}
              </span>}

            <div
              onClick={() => {
                if (validateInvoiceForm()) {
                  setPaymentMethod(PaymentMethod.Wallet);
                }
              }}
              className={
                "large-wallet mt-2 absolute top-0 bottom-0 left-0 right-0 h-full w-full"
              }
            >
             {/* <WalletMultiButton /> */}
            </div>
          </div>
        </div>
      </div>

      {/* <button onClick={() => {}}>Connect a Solana wallet to continue</button> */}

      {!disabled && (
        <>
          <div className={`${paymentMethod === PaymentMethod.Wallet ? 'visible' : 'hidden'}`}>
            <CoinflowForm
              email={email}
              invoice={invoice}
              amount={Number(amount)}
              setIsReady={() => setPaymentMethod(null)}
              onSuccess={(pId: string) => setSuccessId(pId)}
              allowedPaymentMethods={[PaymentMethods.crypto]}
            />
          </div>
          <div className={`${paymentMethod !== PaymentMethod.Wallet ? 'visible' : 'hidden'}`}>
            <CoinflowForm
              email={email}
              invoice={invoice}
              amount={Number(amount)}
              setIsReady={() => setPaymentMethod(null)}
              onSuccess={(pId: string) => setSuccessId(pId)}
            />
          </div>
        </>
      )}

      <SuccessModal
        paymentId={successId}
        signature={successSignature}
        setIsOpen={() => setSuccessSignature(null)}
        invoice={invoice}
        amount={Number(amount)}
      />
    </div>
  );
}

function CoinflowForm({
  amount,
  email,
  invoice,
  onSuccess,
  allowedPaymentMethods
}: {
  amount: number;
  setIsReady: (isReady: boolean) => void;
  email: string;
  invoice: string;
  onSuccess: (pId: string) => void;
  allowedPaymentMethods?: PaymentMethods[];
}) {
  const localWallet = useLocalWallet();
  const solanaWallet = useWallet();
  const wallet = solanaWallet.publicKey ? solanaWallet : localWallet;
  const connection = localWallet.connection;

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

  if (!connection || !amount || Number(amount) === 0) return null;

  return (
    <div style={{ height: `${height}px` }} className={`w-full`}>
      <CoinflowPurchase
        allowedPaymentMethods={allowedPaymentMethods ?? undefined}
        wallet={localWallet}
        blockchain={"solana"}
        merchantId={"triton"}
        env={env}
        connection={connection}
        onSuccess={(...args) => {
          if (typeof args[0] !=='string') {
            onSuccess(args[0].paymentId); 
            return;
          }

          const data = JSON.parse(args[0]);
          if ('info' in data)
            onSuccess(data.info.paymentId);

          onSuccess(data.data);
        }}
        
        subtotal={{cents: amount * 100}}
        email={email}
        webhookInfo={{ invoice, amount, email }}
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
  );
}
