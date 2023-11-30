import { useCallback, useEffect, useMemo, useState } from "react";
import { CoinflowPurchase } from "@coinflowlabs/react";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useLocalWallet } from "../../wallet/Wallet.tsx";
import SuccessModal from "../modals/SuccessModal.tsx";
import { useInvoiceContext } from "../../context/InvoiceContext.tsx";
import logo from "../../assets/LogoTextBlack.png";
import usdc from "../../assets/usdc-logo.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { truncateString } from "../../utils/helpers.ts";
import toast from "react-hot-toast";
import { createMemoInstruction } from "@solana/spl-memo";

enum PaymentMethod {
  Card = "card",
  Crypto = "crypto",
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
    sendEmail,
    successSignature,
    setSuccessSignature,
  } = useInvoiceContext();

  useEffect(() => {
    if (publicKey) {
      setPaymentMethod(PaymentMethod.Crypto);
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
      <label className={"text-sm font-medium text-title px-4"}>
        Payment method
      </label>
      <div className={"flex space-x-4 w-full px-4"}>
        <div
          onClick={() => {
            if (validateInvoiceForm()) {
              setPaymentMethod(PaymentMethod.Card);
            }
          }}
          className={`group cursor-pointer items-center py-5 flex justify-center flex-col ${
            paymentMethod === PaymentMethod.Card
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
            Card or Bank Payment
          </span>

          <div className={"flex items-center space-x-1 mt-1"}>
            <span className={"text-xs text-gray-400 whitespace-nowrap"}>
              Powered by
            </span>
            <img
              className={"h-4 object-contain opacity-50"}
              src={logo}
              alt={"logo"}
            />
          </div>
        </div>

        <div className={"relative flex-1"}>
          <div
            onClick={() => {
              if (validateInvoiceForm()) setPaymentMethod(PaymentMethod.Crypto);
            }}
            className={`${
              paymentMethod === PaymentMethod.Crypto
                ? "ring-2 ring-indigo-500"
                : "ring-[0.5px] ring-gray-200"
            } items-center py-5 flex h-[140px] justify-center cursor-pointer flex-col flex-1 rounded-2xl transition`}
          >
            <div
              className={
                "rounded-full h-10 w-10 flex bg-gray-100 items-center justify-center -ml-3"
              }
            >
              <img className={"h-7 object-contain"} src={usdc} alt={"logo"} />
            </div>

            <span className={"text-sm text-gray-800 whitespace-nowrap mt-2"}>
              Pay with USDC
            </span>
            {!publicKey ? (
              <span className={"text-sm text-gray-400 whitespace-nowrap mt-1"}>
                Select a wallet
              </span>
            ) : (
              <span className={"text-xs text-gray-400 whitespace-nowrap mt-1"}>
                Connected to {truncateString(publicKey.toString())}
              </span>
            )}

            <div
              onClick={() => {
                if (validateInvoiceForm()) {
                  setPaymentMethod(PaymentMethod.Crypto);
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

      {paymentMethod === PaymentMethod.Crypto ? (
        <UsdcButton
          email={email}
          invoice={invoice}
          amount={amount}
          disabled={disabled}
          onSuccess={(signature: string) => {
            sendEmail();
            setSuccessSignature(signature);
          }}
        />
      ) : (
        <PurchaseForm
          email={email}
          invoice={invoice}
          amount={amount}
          isReady={paymentMethod === PaymentMethod.Card}
          setIsReady={() => setPaymentMethod(null)}
          onSuccess={(pId: string) => setSuccessId(pId)}
        />
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

function UsdcButton({
  email,
  invoice,
  amount,
  disabled,
  onSuccess,
}: {
  email: string;
  invoice: string;
  amount: string;
  disabled: boolean;
  onSuccess: (signature: string) => void;
}) {
  const wallet = useLocalWallet();
  const [loading, setLoading] = useState<boolean>(false);

  const transferTx = useMemo(() => {
    if (!wallet.publicKey || !amount || isNaN(Number(amount))) return undefined;

    // Mainnet
    const usdc = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

    // Devnet
    // const usdc = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

    const source = getAssociatedTokenAddressSync(usdc, wallet.publicKey);

    const destination = new PublicKey(
      "FAC9vPRC5F46BAcsEr2A3jAxuCms569dS7wZuQuUDDgS",
    );

    const toSend = Number(amount) * Math.pow(10, 6);

    const ixs = [];

    ixs.push(
      createTransferCheckedInstruction(
        source,
        usdc,
        destination,
        wallet.publicKey,
        toSend,
        6,
      ),
    );

    ixs.push(createMemoInstruction(JSON.stringify({ invoice, email, amount })));

    const tx = new Transaction().add(...ixs);

    tx.feePayer = wallet.publicKey;
    return tx;
  }, [amount, wallet.publicKey, invoice, email]);

  const { sendTransaction } = useLocalWallet();

  const pay = useCallback(async () => {
    if (transferTx) {
      try {
        setLoading(true);
        const signature = await sendTransaction(transferTx);
        onSuccess(signature);
        setLoading(false);
      } catch (e) {
        // @ts-ignore
        toast.error(e.message);
        setLoading(false);
      }
    } else toast.error("Connect a wallet to pay");
  }, [transferTx, onSuccess, sendTransaction]);

  return (
    <div className={"pt-5 px-4"}>
      <button
        disabled={disabled || loading}
        onClick={pay}
        className={
          "flex disabled:opacity-50 disabled:cursor-not-allowed space-x-2 items-center hover:bg-indigo-500 transition justify-center p-5 px-6 w-full bg-indigo-600 text-white text-sm font-semibold rounded-2xl"
        }
      >
        {loading ? (
          <i className={"bx bx-loader bx-spin"} />
        ) : (
          <>
            <i className={"bx bxs-lock-alt"} />
            <span>Complete payment</span>
          </>
        )}
      </button>
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
  const wallet = useLocalWallet();

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

  if (!wallet.connection || !amount || Number(amount) === 0) return null;

  return (
    <>
      {isReady ? (
        <div style={{ height: `${height}px` }} className={`w-full`}>
          <CoinflowPurchase
            wallet={wallet}
            merchantId={"triton"}
            env={"prod"}
            connection={wallet.connection}
            onSuccess={(...args) => {
              const data = JSON.parse(args[0]);
              onSuccess(data.info.paymentId);
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
