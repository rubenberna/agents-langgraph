// app/actions.ts
"use server";

import { ticketWorkflow, TicketState } from "@/lib/csHelper/csHelper.lib";
import { z } from "zod";

// A single action to handle all steps of the workflow
export async function runWorkflow(currentState: z.infer<typeof TicketState>) {
  // Invoke the graph with the current state.
  // The graph's internal router will decide which node to run.
  console.log("Running workflow with state:", currentState);
  const result = await ticketWorkflow.invoke(currentState);
  console.log("Workflow result:", result);
  return result;
}
