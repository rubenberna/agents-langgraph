import { Dialog, DialogTitle, DialogPanel } from "@headlessui/react";
import { Button } from "@headlessui/react";

export default function DiagramDialog({
  isOpen,
  onClose,
  src,
  dialogText,
}: {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  dialogText?: string;
}) {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-2xl rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-base/7 font-medium text-white mb-4"
            >
              Diagram
            </DialogTitle>
            {dialogText && (
              <div className="text-sm/5 text-white/50 mb-4">{dialogText}</div>
            )}
            <div className="overflow-x-auto bg-zinc-100 dark:bg-zinc-100 rounded-lg p-4 mb-4">
              <img src={src} alt="Agent Flow Diagram" />
            </div>
            <div className="mt-4">
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
