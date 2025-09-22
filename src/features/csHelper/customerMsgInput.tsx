import { LoadingIcon, SendIcon } from "@/components/icons";
import { Field, Textarea } from "@headlessui/react";
import clsx from "clsx";

interface IProps {
  customerMsg: string;
  setCustomerMsg: (value: string) => void;
  loading: boolean;
  handleClassify: () => void;
}
export default function CustomerMsgInput(props: IProps) {
  const { customerMsg, setCustomerMsg, loading, handleClassify } = props;
  return (
    <div className="relative">
      <Field>
        <Textarea
          value={customerMsg}
          onChange={(e) => setCustomerMsg(e.target.value)}
          disabled={loading}
          className={clsx(
            "mt-3 block w-full resize-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white",
            "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
          )}
          rows={7}
          placeholder="Enter customer message here..."
        />
      </Field>
      <button
        className="absolute bottom-4 right-4 bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 dark:hover:bg-zinc-600 text-white rounded-xl p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        onClick={handleClassify}
        disabled={loading || !customerMsg.trim()}
      >
        {loading ? <LoadingIcon size={20} /> : <SendIcon />}
      </button>
    </div>
  );
}
