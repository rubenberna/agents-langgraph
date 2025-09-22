import { Field } from "@headlessui/react";

interface IProps {
  customerMessage: string;
}

export default function CustomerMsgDisplay(props: IProps) {
  const { customerMessage } = props;
  return (
    <div className="bg-white/5 rounded-2xl p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-white">Customer Message</h4>
      <Field>
        <div className=" rounded-xl p-4 border-none">
          <p className="text-white/80 whitespace-pre-wrap text-sm/6">
            {customerMessage}
          </p>
        </div>
      </Field>
    </div>
  );
}
