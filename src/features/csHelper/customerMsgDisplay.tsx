interface IProps {
  customerMessage: string;
}

export default function CustomerMsgDisplay(props: IProps) {
  const { customerMessage } = props;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-3">
        Customer Message
      </h4>
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          {customerMessage}
        </p>
      </div>
    </div>
  );
}
