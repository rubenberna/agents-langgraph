import { LoadingIcon, TextIcon } from "@/components/icons";

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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
          Priority Classification
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-zinc-600 dark:text-zinc-400">
            AI Suggested:
          </span>
          <span className="text-zinc-800 dark:text-zinc-200 font-bold">
            {priority}
          </span>
        </div>
        {reason && (
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Reasoning:
            </p>
            <p className="text-zinc-700 dark:text-zinc-300">{reason}</p>
          </div>
        )}
      </div>

      {/* Priority Selection Cards */}
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
        Select or confirm priority level:
      </p>
      <div className="flex flex-wrap gap-3 mb-6">
        {priorityOptions.map((option) => (
          <div
            key={option.value}
            // Using a label makes the entire area clickable for better accessibility
            className={`relative rounded-xl p-4 cursor-pointer transition-all duration-200 border-2 ${
              selectedPriority === option.value
                ? " bg-zinc-100 dark:bg-sky-900/20"
                : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            onClick={() => setSelectedPriority(option.value)}
          >
            <div className="flex items-start gap-3">
              {/* Container for our custom radio button */}
              <div className="flex items-center h-5 mt-0.5">
                {/* 1. Hide the default radio button */}
                <input
                  type="radio"
                  name="priority"
                  value={option.value}
                  checked={selectedPriority === option.value}
                  onChange={() => setSelectedPriority(option.value)}
                  className="sr-only peer" // `sr-only` hides it accessibly, `peer` marks it for state tracking
                />
                {/* 2. This is our custom-styled radio button */}
                <div className="w-4 h-4 bg-white dark:bg-zinc-700 border border-zinc-400 dark:border-zinc-500 rounded-full peer-checked:bg-zinc-600 dark:peer-checked:bg-zinc-400 peer-checked:border-transparent">
                  <div
                    className={`w-full h-full rounded-full scale-0 transition-transform peer-checked:scale-50 bg-white`}
                  ></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className={`font-semibold text-zinc-800 dark:text-zinc-200`}
                  >
                    {option.label}
                  </h4>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        onClick={handleGenerate}
        disabled={loading || !selectedPriority}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingIcon size={16} />
            <span>Generating Response...</span>
          </div>
        ) : (
          <>
            <TextIcon />
            Generate Draft Response
          </>
        )}
      </button>
    </div>
  );
}
