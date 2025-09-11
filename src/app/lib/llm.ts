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

export const runLLM = async (question: string) => {
  try {
    const result = await llmWithTools.invoke([new HumanMessage(question)]);

    console.log("LLM Response:", result.content);

    // If there are tool calls, execute them
    if (result.tool_calls && result.tool_calls.length > 0) {
      const toolResults: ToolMessage[] = [];

      for (const toolCall of result.tool_calls) {
        const tool = toolsByName[toolCall.name];
        if (tool) {
          const observation = await tool.invoke(toolCall.args);
          toolResults.push(
            new ToolMessage({
              content: String(observation),
              tool_call_id: toolCall.id || `call_${Date.now()}`,
            })
          );
        }
      }

      // Get final response after tool execution
      const finalResult = await llmWithTools.invoke([
        new HumanMessage(question),
        result,
        ...toolResults,
      ]);

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
export default runLLM;
