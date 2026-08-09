"use client";

import { motion } from "framer-motion";
import { useEggs } from "@/components/eggs/EasterEggs";

/**
 * The mystery switch. Tucked into the bottom-left corner, almost invisible
 * until you go looking. Flips the whole site into party mode.
 */
export function LightSwitch() {
  const { theme, toggleParty } = useEggs();
  const on = theme === "party";

  return (
    <button
      type="button"
      onClick={toggleParty}
      aria-label={on ? "Turn the lights back down" : "There is a switch here"}
      aria-pressed={on}
      className="group fixed bottom-5 left-5 z-[70] opacity-25 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100"
    >
      {/* wall plate */}
      <span className="flex h-11 w-8 items-center justify-center rounded-[3px] border border-fg/50 bg-paper shadow-sm">
        {/* rocker */}
        <motion.span
          animate={{ y: on ? 5 : -5 }}
          transition={{ type: "spring", stiffness: 700, damping: 22 }}
          className="block h-5 w-4 rounded-[2px] border border-fg/60 bg-fg/85"
        />
      </span>

      <span className="kicker pointer-events-none absolute left-10 top-1/2 w-max -translate-y-1/2 text-[0.55rem] text-fg/0 transition-colors duration-300 group-hover:text-fg/50">
        {on ? "off?" : "hm?"}
      </span>
    </button>
  );
}
