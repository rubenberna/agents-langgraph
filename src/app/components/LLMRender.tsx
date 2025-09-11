"use client";

import { useState } from "react";
import { runLLM } from "../lib/llm";
import { SendIcon, LoadingIcon } from "./icons";

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

export default function LLMRender() {
  const [result, setResult] = useState<RunLLMResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await runLLM(question);
      setResult(result as RunLLMResponse);
      console.log({ result });
      setQuestion("");
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 min-w-[50vh]">
      <form
        className="flex flex-row gap-2 relative items-center w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0"
        onSubmit={handleSubmit}
      >
        <input
          className="bg-zinc-100 rounded-md px-2 py-1.5 flex-1 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
          placeholder="Ask an arithmetical question"
          autoFocus
          value={question}
          disabled={loading}
          onChange={handleChange}
        />
        <div className="relative text-sm bg-zinc-100 rounded-lg size-9 flex-shrink-0 flex flex-row items-center justify-center cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-800">
          {loading ? <LoadingIcon /> : <SendIcon />}
        </div>
      </form>

      {result && (
        <div className="mt-4 p-4 rounded-lg bg-zinc-900">
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
