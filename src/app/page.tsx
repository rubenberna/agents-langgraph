"use client";

import { useRef } from "react";
import AgentCalculations from "@/app/features/agentCalculations/agentCalculations";
import { motion } from "motion/react";

export default function Home() {
  const sectionTwoRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    sectionTwoRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const StartComponent = () => (
    <section className="h-screen flex flex-col items-center justify-center gap-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold"
      >
        Langgraph Agents
      </motion.h1>
      <motion.button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        whileTap={{ scale: 0.95 }}
        onClick={handleScroll}
      >
        Start
      </motion.button>
    </section>
  );

  const ExampleComponent = () => (
    <section
      ref={sectionTwoRef}
      key="second"
      className="h-screen flex flex-col items-center justify-center" // 👈 different key than first
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <AgentCalculations />
      </motion.div>
    </section>
  );

  return (
    <main className="flex flex-col">
      <StartComponent />
      <ExampleComponent />
    </main>
  );
}
