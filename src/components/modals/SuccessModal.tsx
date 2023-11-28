import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { copyTextToClipboard } from "../../utils/helpers.ts";

export default function SuccessModal({
  signature,
  setIsOpen,
  invoice,
  amount,
  paymentId,
}: {
  signature: string | null;
  setIsOpen: (s: string | null) => void;
  invoice: string;
  amount: number;
  paymentId: string | null;
}) {
  const text = `Payment Amount:\n$${amount.toFixed(
    2,
  )}\n\nInvoice:\n${invoice}\n\nTransaction signature:\n${signature}\n\n`;

  return (
    <>
      <Transition
        appear
        show={Boolean(signature) || Boolean(paymentId)}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 ring-white/5 ring-[0.5px]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md flex flex-col items-center transform overflow-hidden rounded-[32px] bg-white p-5 pt-6 align-middle shadow-xl transition-all">
                  <div
                    className={
                      "h-14 w-14 rounded-full flex items-center justify-center bg-emerald-50"
                    }
                  >
                    <div
                      className={
                        "h-8 w-8 rounded-full flex items-center justify-center bg-emerald-500"
                      }
                    >
                      <i className={"bx bx-check-double text-white"} />
                    </div>
                  </div>
                  <Dialog.Title
                    as="p"
                    className="text-base lg:text-lg w-full font-medium text-center text-gray-600 mt-2"
                  >
                    Payment complete
                  </Dialog.Title>
                  <h1
                    className={
                      "font-bold text-gray-900 text-2xl text-center mb-4"
                    }
                  >
                    ${amount.toFixed(2)}
                  </h1>
                  <button
                    onClick={() => copyTextToClipboard(text)}
                    className="flex flex-col bg-gray-100 w-full items-start rounded-xl p-3 relative outline-none flex-1 "
                  >
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Payment
                    </p>
                    <p className="text-sm text-gray-800 font-medium mb-4">
                      ${amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Invoice #
                    </p>
                    <p className="text-sm text-gray-800 font-medium mb-4">
                      {invoice}
                    </p>
                    {signature ? (
                      <>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Transaction signature
                        </p>
                        <p className="text-xs text-gray-800 flex-1 font-medium break-all text-start">
                          {signature}
                        </p>
                        <i
                          className={
                            "bx bx-copy-alt text-gray-600 hover:text-indigo-500 transition absolute right-3 top-3"
                          }
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Payment ID
                        </p>
                        <p className="text-xs text-gray-800 flex-1 font-medium break-all text-start">
                          {paymentId}
                        </p>
                      </>
                    )}
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
