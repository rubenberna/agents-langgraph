"use server";

import {
  MessagesAnnotation,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

const mockLlm = (state: typeof MessagesAnnotation.State) => {
  return {
    messages: [{ role: "ai", content: "Hello World" }],
  };
};

const graph = new StateGraph(MessagesAnnotation)
  .addNode("mockLlm", mockLlm)
  .addEdge(START, "mockLlm")
  .addEdge("mockLlm", END)
  .compile();

const normalizeResultToClientFormat = (
  result: typeof MessagesAnnotation.State
) => {
  return result.messages.map((m: any) => {
    // Option 1: use built-in toJSON() if available
    if (typeof m.toJSON === "function") return m.toJSON();

    // Option 2: manually extract role/content
    if (m._getType) {
      return { role: m._getType(), content: m.content };
    }

    // fallback
    return m;
  });
};

const runHelloWorld = async () => {
  const result = await graph.invoke({
    messages: [{ role: "user", content: "hi!" }],
  });
  return normalizeResultToClientFormat(result);
};

export default runHelloWorld;
