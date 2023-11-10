import { Input } from "../atoms/Input.tsx";
import { ErrorType, useInvoiceContext } from "../../context/InvoiceContext.tsx";

export function InvoiceForm() {
  const {
    email,
    setEmail,
    amount,
    setAmount,
    invoice,
    setInvoice,
    formError,
    setFormError,
  } = useInvoiceContext();

  return (
    <div className={"space-y-5 p-4"}>
      <span className={"font-medium text-gray-900 text-xl"}>
        Billing information
      </span>

      <Input
        label={"Payment amount"}
        required
        placeholder={"$10"}
        value={amount}
        onChange={(value) => {
          if (formError) setFormError(null);
          setAmount(value);
        }}
        showError={formError?.type === ErrorType.Amount}
        errorMsg={
          formError && formError.type === ErrorType.Amount
            ? formError.message
            : undefined
        }
      />
      <Input
        label={"Email"}
        required
        value={email}
        onChange={(value) => {
          if (formError) setFormError(null);
          setEmail(value);
        }}
        placeholder={"johndoe@gmail.com"}
        showError={formError?.type === ErrorType.Email}
        errorMsg={
          formError && formError.type === ErrorType.Email
            ? formError.message
            : undefined
        }
      />
      <Input
        label={"Invoice number"}
        required
        value={invoice}
        onChange={(value) => {
          if (formError) setFormError(null);
          setInvoice(value);
        }}
        placeholder={"INV-"}
        showError={formError?.type === ErrorType.Invoice}
        errorMsg={
          formError && formError.type === ErrorType.Invoice
            ? formError.message
            : undefined
        }
      />
    </div>
  );
}
