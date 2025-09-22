import { LoadingIcon, TextIcon } from "@/components/icons";
import { Radio, RadioGroup, Button } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface IProps {
  priority: string;
  reason: string;
  loading: boolean;
  selectedPriority: string;
  setSelectedPriority: (value: string) => void;
  handleGenerate: () => void;
}

type PriorityOption = {
  value: string;
  label: string;
  description: string;
};

const priorityOptions: PriorityOption[] = [
  {
    value: "High",
    label: "High Priority",
    description: "Urgent issues requiring immediate attention",
  },
  {
    value: "Medium",
    label: "Medium Priority",
    description: "Important issues that should be addressed soon",
  },
  {
    value: "Low",
    label: "Low Priority",
    description: "Minor issues that can be addressed later",
  },
];

export default function Classification(props: IProps) {
  const {
    priority,
    reason,
    loading,
    selectedPriority,
    setSelectedPriority,
    handleGenerate,
  } = props;

  return (
    <>
      <div className="w-full flex gap-4 px-4">
        <div className="flex flex-col gap-2 w-1/3">
          <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
            AI Suggested:
          </span>
          <span className="text-zinc-800 dark:text-zinc-200 font-bold">
            {priority}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400">{reason}</span>
        </div>
        <div className="mx-auto w-full max-w-md">
          <RadioGroup
            value={selectedPriority}
            onChange={setSelectedPriority}
            aria-label="Server size"
            className="space-y-2"
          >
            {priorityOptions.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                className="group relative flex cursor-pointer rounded-lg bg-white/5 px-5 py-4 text-white shadow-md transition focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm/6">
                    <p className="font-semibold text-white">{option.value}</p>
                    <div className="flex gap-2 text-white/50">
                      <div>{option.label}</div>
                      <div aria-hidden="true">&middot;</div>
                      <div>{option.description}</div>
                    </div>
                  </div>
                  <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-checked:opacity-100" />
                </div>
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </div>
      <Button
        className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
        onClick={handleGenerate}
        disabled={loading || !selectedPriority}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingIcon size={16} />
            <span>Generating Response...</span>
          </div>
        ) : (
          <>Generate Draft Response</>
        )}
      </Button>
    </>
  );
}
