import { MessagesAnnotation } from "@langchain/langgraph";

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

const getToolCalls = (result: any) => {
  return result
    ?.map((node: any) => node?.kwargs?.tool_calls)
    ?.filter(Boolean)
    ?.flat();
};

export { normalizeResultToClientFormat, getToolCalls };
