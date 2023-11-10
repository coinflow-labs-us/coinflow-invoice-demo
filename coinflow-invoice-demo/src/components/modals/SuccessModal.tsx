import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function SuccessModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg lg:text-xl font-bold leading-6 text-gray-900"
                  >
                    ❤️ Thank you! 🇮🇱
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 font-medium mb-5">
                      Your donation is complete. Thank you!
                    </p>
                  </div>

                  <div
                    className={
                      "bg-blue-600 rounded-2xl p-4 px-6 hover:bg-blue-500 transition cursor-pointer w-min"
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span
                      className={
                        "text-sm font-semibold text-white whitespace-nowrap"
                      }
                    >
                      Donate again
                    </span>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
