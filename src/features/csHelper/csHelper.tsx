"use client";

import { useState } from "react";
import { runWorkflow } from "@/actions/csHelper.action"; // Use the new single action
import { TicketState } from "@/lib/csHelper/csHelper.lib"; // Import the Zod schema for type safety
import { z } from "zod";
import Header from "@/components/header";
import CustomerMsgInput from "@/features/csHelper/customerMsgInput";
import CustomerMsgDisplay from "@/features/csHelper/customerMsgDisplay";
import Classification from "@/features/csHelper/classification";
import ResponseDraft from "@/features/csHelper/responseDraft";

type TicketStateType = z.infer<typeof TicketState>;

const mockMessage = `
Hi,

The app doesn't work. I cannot process payments.
`;

export default function CSHelper() {
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
    setCustomerMsg("");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <Header
        src="/router.svg"
        title="Support Triage Demo"
        subtitle="AI-powered customer support message classification"
      />
      {!state.customerMessage ? (
        <CustomerMsgInput
          customerMsg={customerMsg}
          setCustomerMsg={setCustomerMsg}
          loading={loading}
          handleClassify={handleClassify}
        />
      ) : (
        <CustomerMsgDisplay customerMessage={state.customerMessage} />
      )}

      {state.classification && !state.responseDraft && (
        <Classification
          priority={state.classification.priority}
          reason={state.classification.reason}
          loading={loading}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          handleGenerate={handleGenerate}
        />
      )}
      {state.responseDraft && (
        <ResponseDraft
          responseDraft={state.responseDraft}
          humanApproved={state?.humanApproved}
          customerMessage={state.customerMessage}
          handleReset={handleReset}
        />
      )}
    </div>
  );
}
