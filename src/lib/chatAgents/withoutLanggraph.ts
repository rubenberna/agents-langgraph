// Step 0: define tools and model
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
});

// Define tools
const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "Add two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const multiply = tool(({ a, b }) => a * b, {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const divide = tool(({ a, b }) => a / b, {
  name: "divide",
  description: "Divide two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

// Augment the LLM with tools
const toolsByName = {
  [add.name]: add,
  [multiply.name]: multiply,
  [divide.name]: divide,
};
const tools = Object.values(toolsByName);
const llmWithTools = llm.bindTools(tools);

// Step 1: Define model node
import { task, entrypoint } from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
const callLlm = task({ name: "callLlm" }, async (messages: BaseMessage[]) => {
  return llmWithTools.invoke([
    new SystemMessage(
      "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
    ),
    ...messages,
  ]);
});

// Step 2: define tool node
import type { ToolCall } from "@langchain/core/messages/tool";
const callTool = task({ name: "callTool" }, async (toolCall: ToolCall) => {
  const tool = toolsByName[toolCall.name];
  return tool.invoke(toolCall);
});

// Step 3: define agent
import { addMessages } from "@langchain/langgraph";
import { type BaseMessage, isAIMessage } from "@langchain/core/messages";
const agent = entrypoint({ name: "agent" }, async (messages: BaseMessage[]) => {
  let llmResponse = await callLlm(messages);

  while (true) {
    if (!llmResponse.tool_calls?.length) {
      break;
    }

    // Execute tools
    const toolResults = await Promise.all(
      llmResponse.tool_calls.map((toolCall) => callTool(toolCall))
    );
    messages = addMessages(messages, [llmResponse, ...toolResults]);
    llmResponse = await callLlm(messages);
  }

  return messages;
});

// Invoke
import { HumanMessage } from "@langchain/core/messages";
import { normalizeResultToClientFormat } from "../utils/utils";

const runSimpleAgent = async (question: string) => {
  const result = await agent.invoke([new HumanMessage(question)]);
  console.log(result);
  return normalizeResultToClientFormat(result);
};

export { runSimpleAgent };
