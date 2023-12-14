import {useCallback, useEffect, useMemo, useState} from "react";
import { CoinflowPurchase } from "@coinflowlabs/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useLocalWallet } from "../../wallet/Wallet.tsx";
import SuccessModal from "../modals/SuccessModal.tsx";
import { useInvoiceContext } from "../../context/InvoiceContext.tsx";
import usdc from "../../assets/usdc-logo.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { truncateString } from "../../utils/helpers.ts";

enum PaymentMethod {
  Guest = "guest",
  Wallet = "wallet",
}

export function CoinflowForm() {
  const wallet = useLocalWallet();
  const { publicKey } = useWallet();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
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

  useEffect(() => {
    if (publicKey) {
      setPaymentMethod(PaymentMethod.Wallet);
    } else {
      setPaymentMethod(null);
    }
  }, [publicKey]);

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

          <hr className="h-[1px] mt-2 bg-gray-200 border-0 w-[80%] rounded-full"/>

          <span className={"text-sm text-gray-800 whitespace-nowrap mt-2"}>
            Checkout as guest
          </span>
        </div>

        <div className={'text-gray-600 h-full flex items-center'}>
          <span>or</span>
        </div>

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
              <div
                  className={
                    "rounded-full h-10 w-10 flex bg-gray-100 items-center justify-center border-4 border-white group-hover:border-gray-50 -ml-3"
                  }
              >
                <img className={"h-7 object-contain"} src={usdc} alt={"logo"} />
              </div>
            </div>

            <span className={"text-sm text-gray-800 whitespace-nowrap mt-2"}>
              Card, ACH, or USDC
            </span>

            <hr className="h-[1px] min-h-[1px] mt-2 bg-gray-200 border-0 w-[80%] rounded-full"/>

            <span className={"text-sm text-gray-800 whitespace-nowrap mt-2"}>
              Connect a wallet
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
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </div>

      {!disabled && (
          <>
            {paymentMethod === PaymentMethod.Wallet ? (
                <PurchaseForm
                    email={email}
                    invoice={invoice}
                    amount={amount}
                    isReady={true}
                    setIsReady={() => setPaymentMethod(null)}
                    onSuccess={(pId: string) => setSuccessId(pId)}
                />
            ) : (
                <PurchaseForm
                    email={email}
                    invoice={invoice}
                    amount={amount}
                    isReady={paymentMethod === PaymentMethod.Guest}
                    setIsReady={() => setPaymentMethod(null)}
                    onSuccess={(pId: string) => setSuccessId(pId)}
                />
            )}
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

function PurchaseForm({
  amount,
  email,
  invoice,
  isReady,
  onSuccess,
}: {
  amount: string;
  setIsReady: (isReady: boolean) => void;
  isReady: boolean;
  email: string;
  invoice: string;
  onSuccess: (pId: string) => void;
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

  if (!connection || !amount || Number(amount) === 0) return null;

  return (
    <>
      {isReady ? (
        <div style={{ height: `${height}px` }} className={`w-full`}>
          <CoinflowPurchase
            wallet={wallet}
            merchantId={"triton"}
            env={"prod"}
            connection={connection}
            onSuccess={(...args) => {
              const data = JSON.parse(args[0]);
              if ('info' in data)
                onSuccess(data.info.paymentId);

              onSuccess(data.data);
            }}
            blockchain={"solana"}
            amount={Number(amount)}
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
      ) : null}
    </>
  );
}
