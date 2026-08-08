"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useEggs } from "@/components/eggs/EasterEggs";
import { StarIcon } from "@/components/StarIcon";

export { StarIcon };

/**
 * A star you can actually click. Scattered in the margins like the
 * saved-pin markers on a moodboard — and quietly counting toward
 * the star-shower easter egg.
 */
export function StarButton({
  size = 22,
  className = "",
  label = "A star",
}: {
  size?: number;
  className?: string;
  label?: string;
}) {
  const { registerStarClick } = useEggs();
  const [saved, setSaved] = useState(false);

  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      data-cursor="grow"
      onClick={() => {
        setSaved((v) => !v);
        registerStarClick();
      }}
      whileHover={{ scale: 1.25, rotate: 12 }}
      whileTap={{ scale: 0.85, rotate: -14 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className={`inline-flex text-fg/70 transition-colors hover:text-accent ${className}`}
    >
      <StarIcon size={size} filled={saved} />
    </motion.button>
  );
}
