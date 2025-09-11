"use server";

// Step 0: define tools and model
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
});

// Define tools
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
const toolsByName = {
  [add.name]: add,
  [multiply.name]: multiply,
  [divide.name]: divide,
};

const tools = Object.values(toolsByName);
const llmWithTools = llm.bindTools(tools);

// Simple approach without LangGraph for now
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";

// In-memory conversation history (in production, you'd use a database)
let conversationHistory: (HumanMessage | AIMessage | ToolMessage)[] = [];

export const runLLM = async (question: string) => {
  try {
    // Add the new human message to conversation history
    const humanMessage = new HumanMessage(question);
    conversationHistory.push(humanMessage);

    // Invoke LLM with full conversation history
    const result = await llmWithTools.invoke(conversationHistory);

    console.log("LLM Response:", result.content);

    // Add the AI response to conversation history
    conversationHistory.push(result);

    // If there are tool calls, execute them
    if (result.tool_calls && result.tool_calls.length > 0) {
      const toolResults: ToolMessage[] = [];

      for (const toolCall of result.tool_calls) {
        const tool = toolsByName[toolCall.name];
        if (tool) {
          const observation = await tool.invoke(toolCall.args);
          const toolMessage = new ToolMessage({
            content: String(observation),
            tool_call_id: toolCall.id || `call_${Date.now()}`,
          });
          toolResults.push(toolMessage);
          // Add tool result to conversation history
          conversationHistory.push(toolMessage);
        }
      }

      // Get final response after tool execution with full conversation history
      const finalResult = await llmWithTools.invoke(conversationHistory);

      // Add final response to conversation history
      conversationHistory.push(finalResult);

      return {
        success: true,
        message: "Processing completed",
        data: {
          content: finalResult.content,
          toolCalls: result.tool_calls || [],
          toolResults: toolResults.map((tr) => tr.content),
        },
      };
    }

    return {
      success: true,
      message: "Processing completed",
      data: {
        content: result.content,
        toolCalls: [],
        toolResults: [],
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error processing request",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Function to clear conversation history
export const clearConversation = async () => {
  conversationHistory = [];
};

// Function to get conversation history (for debugging)
export const getConversationHistory = async () => {
  return conversationHistory;
};

export default runLLM;
