import { Button } from "@headlessui/react";

interface IProps {
  responseDraft: string;
  humanApproved:
    | {
        priority: "High" | "Medium" | "Low";
        reason: string;
      }
    | undefined;
  customerMessage: string | undefined;
  handleReset: () => void;
}

export default function ResponseDraft(props: IProps) {
  const { responseDraft, humanApproved, customerMessage, handleReset } = props;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-white mb-4">Draft Response</h4>
      <div className="rounded-xl p-4 mb-6">
        <pre className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300 font-sans">
          {responseDraft}
        </pre>
      </div>

      <div className="flex gap-3">
        <Button
          className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
          onClick={() => {
            alert(
              `Ticket created with priority ${humanApproved?.priority}:\n\n${customerMessage}`
            );
            handleReset();
          }}
        >
          Create Bug ticket
        </Button>
        <Button
          className="inline-flex items-center gap-2 rounded-md border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
          onClick={handleReset}
        >
          Start Over
        </Button>
      </div>
    </div>
  );
}
