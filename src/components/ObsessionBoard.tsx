"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import type { Obsession } from "@/content/site";
import { StarButton } from "@/components/Star";

const TILT = [-4, 3, -2.2, 4.5, -3.4, 2];

const WASHES = [
  "linear-gradient(150deg, #d9cfc0, #b5a894)",
  "linear-gradient(150deg, #e6c7d2, #b07f92)",
  "linear-gradient(160deg, #e0d6c6, #a2a06f)",
  "linear-gradient(140deg, #d6c9bd, #b06a5c)",
  "linear-gradient(165deg, #cdc3b6, #6f7042)",
  "linear-gradient(135deg, #e3d9c9, #7d7365)",
];

/**
 * The summer list as a pinboard of polaroids. Each one is nudgeable —
 * drag them around and they stay where you put them. The note is written
 * under the photo and comes up on hover.
 */
export function ObsessionBoard({ items }: { items: Obsession[] }) {
  const board = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={board}
      className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 lg:grid-cols-3"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.title + i}
          drag
          dragConstraints={board}
          dragElastic={0.12}
          dragMomentum={false}
          initial={{ opacity: 0, y: 26, rotate: TILT[i % TILT.length] }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
          whileDrag={{ scale: 1.08, rotate: 0, zIndex: 40, cursor: "grabbing" }}
          className="group relative cursor-grab touch-none active:cursor-grabbing"
        >
          {/* the pin */}
          <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
            <StarButton size={20} label={`Star ${item.title}`} />
          </span>

          {/* polaroid */}
          <div className="grain relative bg-[#f6f2e8] p-2.5 pb-0 shadow-[0_6px_18px_rgba(20,17,15,0.18)]">
            <div className="relative aspect-square w-full overflow-hidden bg-[#ddd6c8]">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: WASHES[i % WASHES.length] }}
                  role="img"
                  aria-label={`${item.title} — no photo yet`}
                />
              )}

              {/* note slides up over the photo */}
              <div className="pointer-events-none absolute inset-0 flex items-end bg-[#14110f]/0 p-3 transition-colors duration-500 group-hover:bg-[#14110f]/72">
                <p className="translate-y-2 text-[0.72rem] leading-snug text-[#f6f2e8] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.note}
                </p>
              </div>
            </div>

            <p className="truncate py-3 text-center font-display text-base text-[#14110f]">
              {item.title}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
