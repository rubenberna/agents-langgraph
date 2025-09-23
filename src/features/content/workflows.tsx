import Header from "@/components/header";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Markdown } from "@/components/markdown";
const promptChainingImage = "/prompt_chain.avif";
const parallelizationImage = "/parallelization.avif";
const routingImage = "/routing.avif";
const orchestratorWorkerImage = "/worker.avif";
const evaluatorOptimizerImage = "/evaluator_optimizer.avif";
const agentsImage = "/agent.avif";

const workflowsAndAgents = [
  {
    title: "Prompt chaining",
    description: `**Prompt chaining** is when each LLM call processes the output of the previous call. It’s often used for performing well-defined tasks that can be broken down into smaller, verifiable steps. Some examples include:
- Translating documents into different languages
- Verifying generated content for consistency
![A diagram of prompt chaining](${promptChainingImage})
`,
  },
  {
    title: "Parallelization",
    description: `With parallelization, LLMs work simultaneously on a task. This is either done by running multiple independent subtasks at the same time, or running the same task multiple times to check for different outputs. Parallelization is commonly used to:
- Split up subtasks and run them in parallel, which increases speed
- Run tasks multiple times to check for different outputs, which increases confidence.

Some examples include

- Running one subtask that processes a document for keywords, and a second subtask to check for formatting errors
- Running a task multiple times that scores a document for accuracy based on different criteria, like the number of citations, the number of sources used, and the quality of the sources
![A diagram of prompt chaining](${parallelizationImage})
`,
  },
  {
    title: "Routing",
    description: `Routing workflows process inputs and then directs them to context-specific tasks. This allows you to define specialized flows for complex tasks. For example, a workflow built to answer product related questions might process the type of question first, and then route the request to specific processes for pricing, refunds, returns, etc.
![A diagram of prompt chaining](${routingImage})
`,
  },
  {
    title: "Orchestrator-worker",
    description: `In an orchestrator-worker configuration, the orchestrator:
    
- Breaks down tasks into subtasks
- Delegates subtasks to workers
- Synthesizes worker outputs into a final result
![A diagram of prompt chaining](${orchestratorWorkerImage})

Orchestrator-worker workflows provide more flexibility and are often used when subtasks cannot be predefined the way they can with parallelization. This is common with workflows that write code or need to update content across multiple files. For example, a workflow that needs to update installation instructions for multiple Python libraries across an unknown number of documents might use this pattern.
`,
  },
  {
    title: "Evaluator-optimizer",
    description: `In evaluator-optimizer workflows, one LLM call creates a response and the other evaluates that response. If the evaluator or a human-in-the-loop determines the response needs refinement, feedback is provided and the response is recreated. This loop continues until an acceptable response is generated.
    Evaluator-optimizer workflows are commonly used when there’s particular success criteria for a task, but iteration is required to meet that criteria. For example, there’s not always a perfect match when translating text between two languages. It might take a few iterations to generate a translation with the same meaning across the two languages.
![A diagram of prompt chaining](${evaluatorOptimizerImage})
`,
  },
  {
    title: "Agents",
    description: `Agents are typically implemented as an LLM performing actions using tools. They operate in continuous feedback loops, and are used in situations where problems and solutions are unpredictable. Agents have more autonomy than workflows, and can make decisions about the tools they use and how to solve problems. You can still define the available toolset and guidelines for how agents behave.
![A diagram of prompt chaining](${agentsImage})
`,
  },
];

export default function Benefits() {
  return (
    <div className="w-full px-8 mb-8">
      <Header
        src="/agent_workflow.avif"
        title="Workflows and Agents"
        subtitle="LangGraph provides a flexible framework for building workflows and agents."
        dialogText={`Workflows have predetermined code paths and are designed to operate in a certain order.
Agents are dynamic and define their own processes and tool usage.
        `}
      />
      <div className="mx-auto w-3/4 divide-y divide-white/5 rounded-xl bg-white/5 mt-8">
        {workflowsAndAgents.map((workflow) => (
          <Disclosure key={workflow.title} as="div" className="p-6">
            <DisclosureButton className="group flex w-full items-center justify-between">
              <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
                {workflow.title}
              </span>
              <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
              <Markdown>{workflow.description as string}</Markdown>
            </DisclosurePanel>
          </Disclosure>
        ))}
      </div>
    </div>
  );
}
