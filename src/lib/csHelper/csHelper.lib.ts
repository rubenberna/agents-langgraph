// lib/ticketAgent.ts
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
});

// The state schema remains the same
export const TicketState = z.object({
  customerMessage: z.string(),
  classification: z
    .object({
      priority: z.enum(["High", "Medium", "Low"]),
      reason: z.string(),
    })
    .optional(),
  humanApproved: z
    .object({
      priority: z.enum(["High", "Medium", "Low"]),
      reason: z.string(),
    })
    .optional(),
  responseDraft: z.string().optional(),
});

type TicketStateType = z.infer<typeof TicketState>;

// 1. Define the Zod schema for your desired output
const ClassificationSchema = z.object({
  priority: z.enum(["High", "Medium", "Low"]),
  reason: z.string().describe("A brief explanation for the classification."),
});
async function classifyNode(state: z.infer<typeof TicketState>) {
  // 2. Bind the schema to the model to enforce structured output
  const structuredLlm = llm.withStructuredOutput(ClassificationSchema);

  const prompt = new SystemMessage(
    `Classify the following customer message into High, Medium, or Low priority and explain why.`
  );

  // 3. Invoke the structured LLM. The result is already a parsed object!
  const classificationObject = await structuredLlm.invoke([
    prompt,
    new HumanMessage(state.customerMessage),
  ]);

  // No need for try/catch or JSON.parse anymore
  return { classification: classificationObject };
}

async function respondNode(state: TicketStateType) {
  const classification = state.humanApproved!; // We know this exists if we reached this node
  const prompt = new SystemMessage(
    `You are a support agent. The user's message has been triaged with a priority of '${classification.priority}' because: "${classification.reason}". Draft a polite and helpful response to the following customer message, keeping the priority in mind.`
  );
  const result = await llm.invoke([
    prompt,
    new HumanMessage(state.customerMessage),
  ]);
  return { responseDraft: result.content as string };
}

// This is our router. It decides which node to run next based on the state.
function router(state: TicketStateType): "classify" | "respond" {
  // If the user has approved a classification, we can respond.
  if (state.humanApproved) {
    return "respond";
  }
  // Otherwise, we need to classify the message first.
  return "classify";
}

// A single, unified graph
export const ticketWorkflow = new StateGraph(TicketState)
  .addNode("classify", classifyNode)
  .addNode("respond", respondNode)
  // The router is our entry point after START
  .addConditionalEdges(START, router, {
    classify: "classify",
    respond: "respond",
  })
  // After classification, we stop and wait for human input.
  .addEdge("classify", END)
  // After responding, the process is finished.
  .addEdge("respond", END)
  .compile();
