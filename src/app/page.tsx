"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import SupportPage from "@/app/features/csHelper/csHelper";

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
      className="min-h-screen flex flex-col items-center justify-start py-8" // 👈 Changed to min-h-screen and justify-start with padding
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <SupportPage />
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
