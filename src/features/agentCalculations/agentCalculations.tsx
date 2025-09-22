"use client";

import { useState } from "react";
import { runLangGraphAgent } from "@/lib/chatAgents/withLanggraph";
import { SendIcon, LoadingIcon } from "@/components/icons";
import { Message } from "@/components/message";
import { JsonRenderer } from "@/components/jsonRenderer";
import { getToolCalls } from "@/lib/utils/utils";
import Header from "@/components/header";

export default function AgentCalculations() {
  const [result, setResult] = useState<{
    fullResult: any[];
    answer: any[];
    toolCalls: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const agentResult = await runLangGraphAgent(question);
      console.log(agentResult);
      const answer = agentResult?.at(-1)?.kwargs?.content;
      const toolCalls = getToolCalls(agentResult);
      setResult({ fullResult: agentResult, answer, toolCalls });
      setQuestion("");
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full justify-between align-top lg:flex-row gap-8 mx-auto p-8 relative">
      <div className="flex flex-col gap-4 items-center flex-1 w-2/3">
        <Header
          src="/tool_agent.svg"
          title="Chat Agents"
          subtitle="LLM agents that can perform calculations and use tools"
        />
        <form
          className="flex flex-row gap-2 relative items-center w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4"
          onSubmit={handleSubmit}
        >
          <input
            className="bg-zinc-100 rounded-md px-2 py-1.5 flex-1 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
            placeholder="Ask an arithmetical question"
            value={question}
            disabled={loading}
            onChange={handleChange}
          />
          <div className="relative text-sm bg-zinc-100 rounded-lg size-9 flex-shrink-0 flex flex-row items-center justify-center cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-700 dark:hover:bg-zinc-800">
            {loading ? <LoadingIcon /> : <SendIcon />}
          </div>
        </form>
        <div className="flex flex-col gap-4">
          {!!result?.answer?.length && (
            <Message role="assistant" content={result.answer} />
          )}
          {!!result?.toolCalls?.length && (
            <JsonRenderer jsonResult={result.toolCalls} title="Tool Calls" />
          )}
        </div>
      </div>

      {!!result?.fullResult?.length && (
        <div className="w-1/3">
          <JsonRenderer jsonResult={result?.fullResult} title="Graph State" />
        </div>
      )}
    </div>
  );
}
