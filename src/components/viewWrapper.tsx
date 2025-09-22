import { motion } from "motion/react";

export default function ViewWrapper({
  children,
  viewRef,
  nextRef,
  handleScroll,
}: {
  children: React.ReactNode;
  viewRef: React.RefObject<HTMLDivElement> | null;
  nextRef: React.RefObject<HTMLDivElement> | null;
  handleScroll: (ref: React.RefObject<HTMLDivElement>) => void;
}) {
  return (
    <section
      className="min-h-screen w-[95vw] flex flex-col items-center justify-start py-8"
      ref={viewRef}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full"
      >
        {children}
      </motion.div>
      {nextRef && (
        <motion.button
          onClick={() => handleScroll(nextRef)}
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Next
        </motion.button>
      )}
    </section>
  );
}
