"use server";

import { HumanMessage } from "@langchain/core/messages";
import { normalizeResultToClientFormat } from "@/lib/utils/utils";
import { agent } from "@/lib/chatAgents/withLanggraph";

export async function runAgentCalculations(question: string, threadId: string) {
  const config = { configurable: { thread_id: threadId } };
  console.log("config", config);
  const state = await agent.getState(config);
  console.log("state", state);

  const result = await agent.invoke(
    {
      messages: [new HumanMessage(question)],
    },
    config
  );
  return normalizeResultToClientFormat(result);
}
