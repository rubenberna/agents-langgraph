import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Markdown } from "@/components/markdown";

const categories = [
  {
    name: "Short-term memory (inside a single run)",
    content: `This is just the state object when you build your StateGraph and it only exists for the lifetime of one run.

Example:

\`\`\`javascript
import { z } from "zod";
import { BaseMessage } from "@langchain/core/messages";

const MessagesState = z.object({
  messages: z.array(z.custom<BaseMessage>()),
  llmCalls: z.number().optional(),
});
\`\`\`

Every node returns a partial state update. LangGraph merges those updates into the running state and passes it to the next node.

This “short-term” memory lives for the lifetime of one graph execution (from START until END). It’s not persisted anywhere automatically; when your agent stops, that state is gone unless you store it yourself.

Think of it like RAM during one invocation.
    `,
  },
  {
    name: "Long-term",
    content: `**Long-term memory** is stored in a user session. It survives multiple runs as long as you reuse the same \`thread_id\`.

To keep memory across multiple invocations of your graph (e.g., user asks question #1 now, comes back later and asks question #2), you attach a \`checkpointer\` when you compile the graph:

\`\`\`javascript
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();
const agent = workflow.compile({ checkpointer });
\`\`\`

* MemorySaver is an in-memory checkpointer that stores each state snapshot keyed by a thread_id.


* When you call \`agent.invoke(input, { configurable: { thread_id } })\`, LangGraph:


  * Loads the last saved state for that thread_id (if any).


  * Merges in your new input.


  * Runs the graph from where it left off.

This is your **long-term memory** — like disk storage — it survives multiple runs as long as you reuse the same \`thread_id\`.
You can also swap out \`MemorySaver\` for a database-backed checkpointer (Redis, Postgres, etc.) to persist state beyond process restarts.

    `,
  },
];

export default function Memory() {
  return (
    <div className="w-full px-8">
      <h2 className="text-xl font-semibold text-white mb-6">Memory</h2>
      <div className="flex w-full justify-center px-4 mb-8">
        <div className="w-full">
          <TabGroup>
            <TabList className="flex gap-4">
              {categories.map(({ name }) => (
                <Tab
                  key={name}
                  className="rounded-full px-3 py-1 text-sm/6 font-semibold text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-white/5 data-selected:bg-white/10 data-selected:data-hover:bg-white/10"
                >
                  {name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-3">
              {categories.map(({ name, content }) => (
                <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                  <Markdown>{content}</Markdown>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  );
}
