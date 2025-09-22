import { TicketIcon } from "@/components/icons";

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
      <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
        Draft Response
      </h3>
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mb-6">
        <pre className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300 font-sans">
          {responseDraft}
        </pre>
      </div>

      <div className="flex gap-3">
        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          onClick={() => {
            alert(
              `Ticket created with priority ${humanApproved?.priority}:\n\n${customerMessage}`
            );
            handleReset();
          }}
        >
          <TicketIcon />
          Create Bug ticket
        </button>
        <button
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          onClick={handleReset}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
