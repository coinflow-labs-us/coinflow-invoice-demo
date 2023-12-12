import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export interface InvoiceContextProps {
  email: string;
  setEmail: (s: string) => void;
  amount: string;
  setAmount: (s: string) => void;
  invoice: string;
  setInvoice: (s: string) => void;
  formError: FormError | null;
  setFormError: (e: FormError | null) => void;
  validateInvoiceForm: () => boolean;
  formIsComplete: () => boolean;
  form: RefObject<HTMLFormElement | undefined>;
  successSignature: string | null;
  setSuccessSignature: (s: string | null) => void;
  amountDisabled: boolean;
}

export const InvoiceContext = createContext<InvoiceContextProps>({
  // @ts-ignore
  form: undefined,
  amount: "",
  setAmount(): void {},
  setEmail(): void {},
  email: "",
  invoice: "",
  formError: null,
  setFormError(): void {},
  setInvoice(): void {},
  validateInvoiceForm(): boolean {
    return false;
  },
  formIsComplete(): boolean {
    return false;
  },
  amountDisabled: false,
});

export enum ErrorType {
  Email = "email",
  Invoice = "invoice",
  Amount = "amount",
}

export type FormError = { type: string; message: string };

export function InvoiceContextProvider({
  children,
  urlAmount,
}: {
  children: ReactNode;
  urlAmount: string | null;
}) {
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>(urlAmount ?? "");
  const [invoice, setInvoice] = useState<string>("");
  const [formError, setFormError] = useState<FormError | null>(null);
  const [successSignature, setSuccessSignature] = useState<string | null>(null);

  const form = useRef<HTMLFormElement | undefined>(null);

  const amountDisabled = useMemo(() => {
    return Boolean(urlAmount);
  }, [urlAmount]);

  /**
   * Validate email with regex
   */
  const isValidEmail = useCallback(() => {
    const regex =
      // eslint-disable-next-line
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return !(!email || !regex.test(email.toLowerCase()));
  }, [email]);

  /**
   * Validate amount as a number
   */
  const isValidAmount = useCallback(() => {
    return !(!amount || isNaN(Number(amount)));
  }, [amount]);

  /**
   * Validate invoice number is structured correctly
   */
  const isValidInvoiceNumber = useCallback(() => {
    return invoice.includes("INV-");
  }, [invoice]);

  /**
   * Validate email, amount and invoice number before opening Coinflow payment form
   */
  const validateInvoiceForm = useCallback(() => {
    if (!isValidAmount()) {
      setFormError({
        type: ErrorType.Amount,
        message: "Amount is an invalid number",
      });
      return false;
    }

    if (!isValidEmail()) {
      setFormError({
        type: ErrorType.Email,
        message: "Invalid email address",
      });
      return false;
    }

    if (!isValidInvoiceNumber()) {
      setFormError({
        type: ErrorType.Invoice,
        message: "Invoice number is incorrect. Please check again.",
      });
      return false;
    }

    return true;
  }, [isValidAmount, isValidEmail, isValidInvoiceNumber]);

  /**
   * Validate email, amount and invoice number before opening Coinflow payment form
   */
  const formIsComplete = useCallback(() => {
    if (!isValidAmount()) return false;
    if (!isValidEmail()) return false;
    return isValidInvoiceNumber();
  }, [isValidAmount, isValidEmail, isValidInvoiceNumber]);

  return (
    <InvoiceContext.Provider
      value={{
        email,
        setEmail,
        invoice,
        setInvoice,
        amount,
        setAmount,
        formError,
        setFormError,
        validateInvoiceForm,
        formIsComplete,
        form,
        successSignature,
        setSuccessSignature,
        amountDisabled,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoiceContext = () => useContext(InvoiceContext);
