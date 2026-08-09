"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

const COLORS = ["#ff2e88", "#22e6c8", "#f5cf3d", "#7b5cff", "#ff7847", "#ffffff"];

/** One-shot confetti burst, fired when party mode switches on. */
export function Confetti({ fireKey }: { fireKey: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2.2 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 300,
        spin: (Math.random() - 0.5) * 900,
        size: 6 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        round: Math.random() > 0.7,
      })),
    // A new key means a fresh burst with fresh positions.
    [fireKey]
  );

  if (!fireKey) return null;

  return (
    <div key={fireKey} className="pointer-events-none fixed inset-0 z-[92] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.round ? "50%" : 2,
          }}
          initial={{ y: -40, opacity: 1, rotate: 0 }}
          animate={{ y: "106vh", x: p.drift, rotate: p.spin, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/** Slow-roaming coloured lights behind the content while party mode is on. */
export function DiscoLights({ active }: { active: boolean }) {
  const lights = [
    { color: "#ff2e88", x: ["-10%", "60%", "-10%"], y: ["-5%", "40%", "-5%"], d: 18 },
    { color: "#22e6c8", x: ["70%", "10%", "70%"], y: ["50%", "0%", "50%"], d: 22 },
    { color: "#7b5cff", x: ["30%", "80%", "30%"], y: ["70%", "30%", "70%"], d: 26 },
  ];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          {lights.map((light, i) => (
            <motion.div
              key={i}
              className="absolute h-[65vmax] w-[65vmax] rounded-full blur-[90px]"
              style={{
                background: `radial-gradient(circle, ${light.color}66, transparent 68%)`,
              }}
              animate={{ left: light.x, top: light.y }}
              transition={{ duration: light.d, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
