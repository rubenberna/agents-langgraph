"use client";

import { useRef } from "react";
import CSHelper from "@/features/csHelper/csHelper";
import ViewWrapper from "@/components/viewWrapper";
import AgentCalculations from "@/features/agentCalculations/agentCalculations";
import WhatIsLanggraph from "@/features/content/whatIsLanggraph";
import Ecosystem from "@/features/content/ecosystem";
import Workflows from "@/features/content/workflows";
import Memory from "@/features/content/memory";

export default function Home() {
  const sectionOneRef = useRef<HTMLDivElement>(null!);
  const sectionTwoRef = useRef<HTMLDivElement>(null!);
  const sectionThreeRef = useRef<HTMLDivElement>(null!);
  const sectionFourRef = useRef<HTMLDivElement>(null!);
  const sectionFiveRef = useRef<HTMLDivElement>(null!);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="flex flex-col">
      <ViewWrapper
        viewRef={null}
        nextRef={sectionOneRef}
        handleScroll={handleScroll}
      >
        <WhatIsLanggraph />
      </ViewWrapper>
      <ViewWrapper
        viewRef={sectionOneRef}
        nextRef={sectionTwoRef}
        handleScroll={handleScroll}
      >
        <Ecosystem />
      </ViewWrapper>
      <ViewWrapper
        viewRef={sectionTwoRef}
        nextRef={sectionThreeRef}
        handleScroll={handleScroll}
      >
        <Workflows />
      </ViewWrapper>
      <ViewWrapper
        viewRef={sectionThreeRef}
        nextRef={sectionFourRef}
        handleScroll={handleScroll}
      >
        <Memory />
      </ViewWrapper>
      <ViewWrapper
        viewRef={sectionFourRef}
        nextRef={sectionFiveRef}
        handleScroll={handleScroll}
      >
        <CSHelper />
      </ViewWrapper>
      <ViewWrapper
        viewRef={sectionFiveRef}
        nextRef={null}
        handleScroll={handleScroll}
      >
        <AgentCalculations />
      </ViewWrapper>
    </main>
  );
}
