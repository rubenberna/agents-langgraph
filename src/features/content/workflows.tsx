import Header from "@/components/header";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Benefits() {
  return (
    <div className="w-full px-8 mb-8">
      <Header
        src="/agent_workflow.avif"
        title="Workflows and Agents"
        subtitle="LangGraph provides a flexible framework for building workflows and agents."
      />
      <div className="mx-auto w-full divide-y divide-white/5 rounded-xl bg-white/5 mt-8">
        <Disclosure as="div" className="p-6" defaultOpen={true}>
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
              Durable execution
            </span>
            <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
            Build agents that persist through failures and can run for extended
            periods, resuming from where they left off.
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
              Human-in-the-loop
            </span>
            <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
            Incorporate human oversight by inspecting and modifying agent state
            at any point.
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
              Comprehensive memory
            </span>
            <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
            Create stateful agents with both short-term working memory for
            ongoing reasoning and long-term memory across sessions.
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
              Debugging with LangSmith
            </span>
            <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
            Gain deep visibility into complex agent behavior with visualization
            tools that trace execution paths, capture state transitions, and
            provide detailed runtime metrics.
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
              Production-ready deployment
            </span>
            <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
            Deploy sophisticated agent systems confidently with scalable
            infrastructure designed to handle the unique challenges of stateful,
            long-running workflows
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  );
}
