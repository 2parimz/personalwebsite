"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { PuppetHead } from "@/components/art/Puppet";

/**
 * A small side-eyeing puppet follows the pointer. Desktop only — it never
 * mounts on touch devices or for visitors who asked for reduced motion.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 480, damping: 32, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 480, damping: 32, mass: 0.45 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("has-puppet");

    function onMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      setHovering(
        Boolean(target?.closest?.('a, button, [data-cursor], input, [role="button"]'))
      );
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-puppet");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{
          scale: hovering ? 1.5 : 1,
          rotate: hovering ? -10 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ translateX: "-30%", translateY: "-25%" }}
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
      >
        <PuppetHead size={38} />
      </motion.div>
    </motion.div>
  );
}
