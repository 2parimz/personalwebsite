"use client";

import { motion } from "framer-motion";
import { BananaIcon } from "@/components/art/Banana";
import { useEggs } from "@/components/eggs/EasterEggs";

/**
 * One hidden banana. Drop three of these at different depths of the page —
 * position them with `className` (e.g. "left-[8%] top-[30%]"). The parent
 * needs `relative`.
 */
export function BananaSpot({
  className = "",
  size = 30,
  rotate = 0,
}: {
  className?: string;
  size?: number;
  rotate?: number;
}) {
  const { slip } = useEggs();

  return (
    <motion.button
      type="button"
      onClick={slip}
      aria-label="A banana"
      initial={{ rotate }}
      whileHover={{ scale: 1.35, rotate: rotate + 18 }}
      whileTap={{ scale: 0.8, rotate: rotate - 25 }}
      transition={{ type: "spring", stiffness: 380, damping: 16 }}
      className={`absolute z-20 opacity-70 transition-opacity hover:opacity-100 ${className}`}
    >
      <BananaIcon size={size} />
    </motion.button>
  );
}
