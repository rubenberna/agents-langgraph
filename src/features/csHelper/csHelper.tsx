"use client";

import { useState } from "react";
import { runWorkflow } from "@/actions"; // Use the new single action
import { TicketState } from "@/lib/csHelper/csHelper.lib"; // Import the Zod schema for type safety
import { z } from "zod";
import Header from "./header";
import CustomerMsgInput from "./customerMsgInput";
import CustomerMsgDisplay from "./customerMsgDisplay";
import Classification from "./classification";
import ResponseDraft from "./responseDraft";

type TicketStateType = z.infer<typeof TicketState>;

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
      {/* Header */}
      <Header />

      {/* Message Input Section */}
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

      {/* Priority Selection Section */}
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

      {/* Response Draft Section */}
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
