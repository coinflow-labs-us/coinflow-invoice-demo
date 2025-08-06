import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Connection, Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

export interface WalletContextProps {
  connected: boolean;
  publicKey: PublicKey | null;
  connection: Connection | null;
  sendTransaction: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<string>;
}

const WalletContext = createContext<WalletContextProps>({
  connected: false,
  publicKey: null,
  connection: null,
  sendTransaction: () => Promise.reject(new Error("")),
});

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  const [keypairLocalStorage, setKeypairLocalStorage] = useState<
    string | null
  >(null);

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
    if (!keypair) return;
    if (publicKey?.equals(keypair.publicKey)) return;
    setPublicKey(keypair.publicKey);
  }, [keypair, publicKey]);

  const connected = useMemo(() => !!publicKey, [publicKey]);

  const connection = useMemo(() => {
    console.log("RPC URL", import.meta.env.VITE_RPC_URL);
    return new Connection(import.meta.env.VITE_RPC_URL, "confirmed");
  }, []);

  const sendTransaction = useCallback(
    async <T extends Transaction | VersionedTransaction>(transaction: T) => {
      if (!keypair) throw new Error("Keypair not found");
      if (transaction instanceof Transaction) {
        transaction.partialSign(keypair);
      } else if (transaction instanceof VersionedTransaction) {
        transaction.sign([keypair]);
      }
      
      return await connection.sendRawTransaction(transaction.serialize());
    },
    [connection, keypair],
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
