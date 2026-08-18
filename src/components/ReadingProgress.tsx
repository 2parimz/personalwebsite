"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useScroller } from "@/components/mag/scroller";

/** Hairline rule across the top — how far through the issue you are. */
export function ReadingProgress() {
  const container = useScroller();
  const { scrollXProgress } = useScroll({ container: container ?? undefined, axis: "x" });
  const width = useSpring(scrollXProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: width }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
    />
  );
}
