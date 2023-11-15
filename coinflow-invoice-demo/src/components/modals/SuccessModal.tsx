import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { copyTextToClipboard } from "../../utils/helpers.ts";

export default function SuccessModal({
  signature,
  setIsOpen,
  invoice,
}: {
  signature: string | null;
  setIsOpen: (s: string | null) => void;
  invoice: string;
}) {
  const text = `Invoice:\n${invoice}\n\nTransaction signature:\n${signature}\n\n`;

  return (
    <>
      <Transition appear show={Boolean(signature)} as={Fragment}>
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
                <Dialog.Panel className="w-full space-y-4 max-w-md transform overflow-hidden rounded-3xl bg-white p-5 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg lg:text-xl font-bold leading-6 text-gray-900 px-3"
                  >
                    Payment complete
                  </Dialog.Title>
                  <button
                    onClick={() => copyTextToClipboard(text)}
                    className="flex flex-col bg-gray-100 w-full rounded-xl p-3 relative outline-none"
                  >
                    <p className="text-xs text-gray-500 font-medium">
                      Invoice #
                    </p>
                    <p className="text-sm text-gray-800 font-medium mb-3">
                      {invoice}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Transaction signature
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      {signature}
                    </p>
                    <i
                      className={
                        "bx bx-copy-alt text-gray-600 hover:text-indigo-500 transition absolute right-3 top-3"
                      }
                    />
                  </button>
                  <p className="text-sm text-gray-700 font-medium mb-5 px-3">
                    Please send this signature and invoice number to{" "}
                    <b className={"text-indigo-600"}>accounting@triton.com</b>
                  </p>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
