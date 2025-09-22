import { LoadingIcon, SendIcon } from "@/components/icons";

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
      <textarea
        className="w-full h-64 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl resize-none outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 transition-all duration-200"
        placeholder="Enter customer message here..."
        value={customerMsg}
        onChange={(e) => setCustomerMsg(e.target.value)}
        disabled={loading}
      />
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
