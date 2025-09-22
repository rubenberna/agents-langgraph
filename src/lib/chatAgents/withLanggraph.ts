// Step 0: define tools and model
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

/*
use server means this is a server action (Next.js 13+ convention).

ChatOpenAI is LangChain’s wrapper around OpenAI’s chat endpoints.

tool is a helper to register functions the LLM can call.

zod defines runtime schemas for tool inputs.

You instantiate the model:
*/

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
});

// Define tools

/*
Then you define three simple tools (add, multiply, divide). Each has:

A function taking input and returning a number.

A Zod schema describing the expected input shape.

A name/description.
*/
const add = tool(
  (input) => {
    const { a, b } = input as { a: number; b: number };
    return a + b;
  },
  {
    name: "add",
    description: "Add two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const multiply = tool(
  (input) => {
    const { a, b } = input as { a: number; b: number };
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const divide = tool(
  (input) => {
    const { a, b } = input as { a: number; b: number };
    return a / b;
  },
  {
    name: "divide",
    description: "Divide two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

// Augment the LLM with tools
/*
You collect them in a dictionary:
*/
const toolsByName = {
  [add.name]: add,
  [multiply.name]: multiply,
  [divide.name]: divide,
};

/*
And bind them to the model:

*/
const tools = Object.values(toolsByName);
const llmWithTools = llm.bindTools(tools);

/*
This lets the LLM automatically issue tool calls.
*/

// Step 1: define state Shape
import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { MessagesZodMeta } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import { type BaseMessage } from "@langchain/core/messages";

const MessagesState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
  llmCalls: z.number().optional(),
});

/*
- messages holds an array of LangChain BaseMessages (HumanMessage, AIMessage, ToolMessage, etc.).

- register(registry, MessagesZodMeta) tells LangGraph how to serialize/deserialize these non-JSON objects.

- llmCalls just tracks how many times you’ve called the model.

This is the official pattern recommended in LangGraph’s docs to handle message arrays in state.
*/

// Step 2: define model node
import { SystemMessage } from "@langchain/core/messages";

async function llmCall(state: z.infer<typeof MessagesState>) {
  return {
    messages: await llmWithTools.invoke([
      new SystemMessage(
        "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
      ),
      ...state.messages,
    ]),
    llmCalls: (state.llmCalls ?? 0) + 1,
  };
}

/*
This node:

- Prepends a SystemMessage to give the model context.

- Passes all prior messages to the LLM with tools bound.

- Increments the call counter.

Because llmWithTools is bound, if the model decides to call add, multiply or divide, it will output an AIMessage with tool_calls populated.*/

// Step 3: define tool node
import { isAIMessage, ToolMessage } from "@langchain/core/messages";

async function toolNode(state: z.infer<typeof MessagesState>) {
  const lastMessage = state.messages.at(-1);
  if (lastMessage == null || !isAIMessage(lastMessage)) {
    return { messages: [] };
  }

  const result: ToolMessage[] = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    const tool = toolsByName[toolCall.name];
    const observation = await tool.invoke(toolCall);
    result.push(observation);
  }

  return { messages: result };
}

/*
This node:
- Checks if the last message from the LLM is an AIMessage.

- Loops over any tool calls present.

- Invokes the appropriate tool with the arguments from toolCall.

- Collects ToolMessage observations (these are special messages containing the tool results) to feed back into the graph state.
*/

// Step 4: Define logic to determine whether to end
async function shouldContinue(state: z.infer<typeof MessagesState>) {
  const lastMessage = state.messages.at(-1);
  if (lastMessage == null || !isAIMessage(lastMessage)) return END;
  // If the LLM makes a tool call, then perform an action
  if (lastMessage.tool_calls?.length) {
    return "toolNode";
  }

  // Otherwise, we stop (reply to the user)
  return END;
}

/*
This function is used by addConditionalEdges to branch:

- If there are tool calls, go to toolNode.

- Otherwise, finish.
*/

// Step 5: Build and compile the agent
const workflow = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall");

const checkpointer = new MemorySaver();
const agent = workflow.compile({ checkpointer });

/*
START → llmCall → (conditional)
               ↘ toolNode → llmCall → (conditional again) → END
- Execution begins at START.

- llmCall runs, returns new state.

- shouldContinue runs → decides to go to toolNode or END.

- toolNode runs, returns new state.

- Then unconditional edge back to llmCall.

Loop until END.

That’s exactly how you implement a ReAct-style agent.
*/

// Step 6: Invoke the agent
// Invoke

export { agent, MessagesState };

/*
Wraps everything so you can call runLangGraphAgent("what is 2 + 3 * 4?").

- It starts the graph with a HumanMessage.

-  The graph runs until END.

The result is then normalized to something JSON-friendly for the client.
*/
