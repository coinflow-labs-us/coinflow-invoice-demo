import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useLocalStorage } from "./useLocalStorage";
import { useWallet } from "@solana/wallet-adapter-react";

export interface WalletContextProps {
  connected: boolean;
  publicKey: PublicKey | null;
  connection: Connection | null;
  sendTransaction: (transaction: Transaction) => Promise<string>;
}

const WalletContext = createContext<WalletContextProps>({
  connected: false,
  publicKey: null,
  connection: null,
  sendTransaction: () => Promise.reject(new Error("")),
});

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  const [keypairLocalStorage, setKeypairLocalStorage] = useLocalStorage<
    string | null
  >("keypair", null);

  useEffect(() => {
    if (wallet.publicKey) {
      setPublicKey(wallet.publicKey);
    }
  }, [wallet]);

  useEffect(() => {
    if (keypairLocalStorage) return;

    const newKeypair = Keypair.generate();
    setKeypairLocalStorage(JSON.stringify(Array.from(newKeypair.secretKey)));
  }, [keypairLocalStorage, setKeypairLocalStorage]);

  const keypair = useMemo(() => {
    if (!keypairLocalStorage) return null;
    return Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(keypairLocalStorage)),
    );
  }, [keypairLocalStorage]);

  useEffect(() => {
    if (!keypair || wallet.publicKey) return;
    if (publicKey?.equals(keypair.publicKey)) return;
    setPublicKey(keypair.publicKey);
  }, [keypair, publicKey, wallet]);

  const connected = useMemo(() => !!publicKey, [publicKey]);

  const connection = useMemo(() => {
    return new Connection(
      "https://rpc.helius.xyz/?api-key=2f915565-3608-4451-9150-4e72f50f10c2",
      "confirmed",
    );
  }, []);

  const sendTransaction = useCallback(
    async (transaction: Transaction) => {
      if (wallet.publicKey && wallet.signTransaction) {
        const latestBlockHash =
          await connection.getLatestBlockhash("confirmed");
        transaction.recentBlockhash = latestBlockHash.blockhash;
        await wallet.signTransaction(transaction);
        return await wallet.sendTransaction(transaction, connection);
      }

      if (!keypair) throw new Error("Keypair not found");
      transaction.partialSign(keypair);
      return await connection.sendRawTransaction(transaction.serialize());
    },
    [connection, keypair, wallet, wallet.signTransaction],
  );

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        sendTransaction,
        connection,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useLocalWallet = () => useContext(WalletContext);
