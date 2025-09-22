"use client";

import { useState } from "react";
import { runWorkflow } from "@/actions"; // Use the new single action
import { TicketState } from "@/lib/csHelper/csHelper.lib"; // Import the Zod schema for type safety
import { z } from "zod";
import {
  BotIcon,
  LoadingIcon,
  SendIcon,
  TextIcon,
  TicketIcon,
} from "@/components/icons";

type TicketStateType = z.infer<typeof TicketState>;

const mockMessage = `
Hi,

The app doesn't work. I cannot process payments.
`;

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

export default function TicketClassifier() {
  // Use a single state object that matches the graph's state
  const [customerMsg, setCustomerMsg] = useState<string>("");
  const [state, setState] = useState<Partial<TicketStateType>>({});
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleClassify() {
    if (!customerMsg.trim()) return;
    setLoading(true);
    // Initial state for classification
    const initialState = { customerMessage: customerMsg };
    try {
      const result = await runWorkflow(initialState);
      console.log(result);
      // Merge the new state from the graph run
      setState(result);
      // Set the suggested priority as selected
      if (result.classification?.priority) {
        setSelectedPriority(result.classification.priority);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    if (!state.customerMessage || !selectedPriority) return;
    setLoading(true);
    // Update the state with the user's approval before continuing
    const stateWithApproval: TicketStateType = {
      ...state,
      humanApproved: {
        priority: selectedPriority,
        reason: state.classification?.reason || "User selected priority",
      },
    } as TicketStateType;

    try {
      const result = await runWorkflow(stateWithApproval);
      // Merge the final state with the response draft
      setState(result);
    } finally {
      setLoading(false);
    }
  }

  // A helper function to reset the state for a new ticket
  const handleReset = () => {
    setState({});
    setSelectedPriority("");
    setCustomerMsg(mockMessage);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
          Support Triage Demo
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          AI-powered customer support message classification
        </p>
      </div>

      {/* Message Input Section */}
      {!state.customerMessage ? (
        <div className="">
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
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-3">
            Customer Message
          </h4>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {state.customerMessage}
            </p>
          </div>
        </div>
      )}

      {/* Priority Selection Section */}
      {state.classification && !state.responseDraft && (
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
                {state.classification.priority}
              </span>
            </div>
            {state.classification.reason && (
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Reasoning:
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {state.classification.reason}
                </p>
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
      )}

      {/* Response Draft Section */}
      {state.responseDraft && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
            Draft Response
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mb-6">
            <pre className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300 font-sans">
              {state.responseDraft}
            </pre>
          </div>

          <div className="flex gap-3">
            <button
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              onClick={() => {
                alert(
                  `Ticket created with priority ${state.humanApproved?.priority}:\n\n${state.customerMessage}`
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
      )}
    </div>
  );
}
