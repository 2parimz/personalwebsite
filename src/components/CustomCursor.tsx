"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { StarIcon } from "@/components/StarIcon";

/**
 * A small star trailing the pointer. Desktop only — it never mounts on
 * touch devices or for visitors who asked for reduced motion.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 34, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 520, damping: 34, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);

    function onMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      setHovering(
        Boolean(target?.closest?.('a, button, [data-cursor], input, [role="button"]'))
      );
    }

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] text-accent mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{ scale: hovering ? 2.1 : 1, rotate: hovering ? 72 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{ translateX: "-50%", translateY: "-50%" }}
      >
        <StarIcon size={18} filled={hovering} />
      </motion.div>
    </motion.div>
  );
}
