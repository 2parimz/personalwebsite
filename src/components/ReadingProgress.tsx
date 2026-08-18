"use client";

import { motion } from "framer-motion";
import { useDeck } from "@/components/mag/deck";

/** Hairline rule across the top — how far through the issue you are. */
export function ReadingProgress() {
  const deck = useDeck();
  const progress = deck && deck.total > 1 ? deck.index / (deck.total - 1) : 0;

  return (
    <motion.div
      aria-hidden="true"
      animate={{ scaleX: progress }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "left" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-accent"
    />
  );
}
