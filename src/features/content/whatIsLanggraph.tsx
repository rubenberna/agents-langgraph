import Benefits from "@/features/content/workflows";
import BenefitsCards from "@/features/content/benefitsCards";
import Ecosystem from "@/features/content/ecosystem";

export default function WhatIsLanggraph() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
          LangGraph
        </h1>
      </div>

      {/* Main content section */}
      <div className="space-y-6 text-center">
        <div className="text-white/60 max-w-3xl mx-auto">
          <p className="mb-4 text-2xl font-medium">
            A low-level{" "}
            <span className="font-bold text-white">
              orchestration framework
            </span>{" "}
            for building, managing, and deploying long-running, stateful agents.
          </p>
        </div>
      </div>
      <BenefitsCards />
      {/* <Ecosystem /> */}
      {/* <Benefits /> */}
    </div>
  );
}
