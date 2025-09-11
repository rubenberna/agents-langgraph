"use client";

import { useState } from "react";
import { runLLM } from "../lib/llm";

type RunLLMResponse = {
  success: boolean;
  message: string;
  data?: {
    content: string;
    toolCalls: any[];
    toolResults: string[];
  };
  error?: string;
};

const question = "What is 2 + 2 multiplied by 3.";

export default function LLMRender() {
  const [result, setResult] = useState<RunLLMResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      const result = await runLLM(question);
      setResult(result as RunLLMResponse);
      console.log({ result });
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!loading && !result && (
        <button
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          onClick={handleClick}
        >
          Click me
        </button>
      )}
      {loading && <div className="mt-4 p-4">Loading...</div>}

      {result && (
        <div className="mt-4 p-4 rounded-lg bg-zinc-900">
          <h3 className="font-semibold mb-2">Question:</h3>
          <p className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border">
            {question}
          </p>

          <h3 className="font-semibold mb-2">Result:</h3>

          {result.success ? (
            <div className="space-y-3">
              <div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Status:
                </span>{" "}
                {result.message}
              </div>

              {result.data && (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Content:</span>
                    <p className="mt-1 p-2 bg-white dark:bg-gray-700 rounded border">
                      {result.data.content}
                    </p>
                  </div>

                  {result.data.toolCalls.length > 0 && (
                    <div>
                      <span className="font-medium">Tool Calls:</span>
                      <ul className="mt-1 space-y-1">
                        {result.data.toolCalls.map((toolCall, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-300"
                          >
                            {toolCall.name}({JSON.stringify(toolCall.args)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.data.toolResults.length > 0 && (
                    <div>
                      <span className="font-medium">Tool Results:</span>
                      <ul className="mt-1 space-y-1">
                        {result.data.toolResults.map((toolResult, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-300"
                          >
                            {toolResult}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600 dark:text-red-400">
              <span className="font-medium">Error:</span> {result.message}
              {result.error && (
                <div className="mt-1 text-sm">
                  <span className="font-medium">Details:</span> {result.error}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
