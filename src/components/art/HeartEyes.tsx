"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * A red heart with a pair of eyes that blink on their own — original
 * artwork in the spirit of the sticker on the moodboard, not a copy of
 * anyone's logo. The blink is irregular so it reads as alive.
 */
export function HeartEyes({
  size = 120,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let timer: ReturnType<typeof setTimeout>;

    function schedule() {
      // Mostly slow blinks, occasionally a quick double.
      const wait = 1800 + Math.random() * 3600;
      timer = setTimeout(() => {
        setBlinking(true);
        timer = setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 130);
      }, wait);
    }

    schedule();
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 180"
      className={className}
      role="img"
      aria-label="A heart with blinking eyes"
      animate={{ scale: [1, 1.045, 1] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M100 168 C 32 118, 8 86, 8 56 C 8 26, 30 8, 54 8 C 74 8, 92 20, 100 38 C 108 20, 126 8, 146 8 C 170 8, 192 26, 192 56 C 192 86, 168 118, 100 168 Z"
        fill="#d8352a"
        stroke="#14110f"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Eyes — whites are fixed, lids close over them */}
      <g>
        <ellipse cx="72" cy="70" rx="24" ry="27" fill="#ffffff" stroke="#14110f" strokeWidth="3.5" />
        <ellipse cx="130" cy="70" rx="24" ry="27" fill="#ffffff" stroke="#14110f" strokeWidth="3.5" />

        {/* Pupils drift very slightly, glancing sideways */}
        <motion.g
          animate={{ x: [0, 5, 0, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="78" cy="72" r="10" fill="#14110f" />
          <circle cx="136" cy="72" r="10" fill="#14110f" />
          <circle cx="74" cy="67" r="3.2" fill="#ffffff" />
          <circle cx="132" cy="67" r="3.2" fill="#ffffff" />
        </motion.g>

        {/* Lids: scaled down to nothing, dropped to full height on a blink */}
        <motion.g
          animate={{ scaleY: blinking ? 1 : 0 }}
          transition={{ duration: 0.08, ease: "easeOut" }}
          style={{ transformOrigin: "100px 70px" }}
        >
          <ellipse cx="72" cy="70" rx="26" ry="29" fill="#d8352a" stroke="#14110f" strokeWidth="3.5" />
          <ellipse cx="130" cy="70" rx="26" ry="29" fill="#d8352a" stroke="#14110f" strokeWidth="3.5" />
        </motion.g>
      </g>
    </motion.svg>
  );
}
