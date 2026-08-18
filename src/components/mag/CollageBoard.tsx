"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import type { Obsession } from "@/content/site";

/**
 * The flat-lay spread: objects laid out on the page like the contents of a
 * bag tipped onto a table, each with a printed label and a handwritten
 * note. Everything is draggable, so the layout is a starting position
 * rather than a fixed composition.
 *
 * Starting positions live in `obsessions.items` as x/y percentages.
 */
export function CollageBoard({ items }: { items: Obsession[] }) {
  const board = useRef<HTMLDivElement>(null);

  return (
    <div ref={board} className="relative h-full w-full">
      {items.map((item, i) => (
        <motion.div
          key={item.title + i}
          drag
          dragConstraints={board}
          dragMomentum={false}
          dragElastic={0.06}
          whileDrag={{ scale: 1.06, zIndex: 60, cursor: "grabbing" }}
          whileHover={{ scale: 1.03, zIndex: 50 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${(item.size ?? 1) * 11}vw`,
          }}
          className="group absolute cursor-grab touch-none select-none active:cursor-grabbing"
        >
          <Cutout item={item} index={i} />

          {/* printed label */}
          <p className="mt-1.5 text-center font-display text-[0.8rem] italic leading-none text-fg">
            {item.title}
          </p>

          {/* handwritten note with a little arrow back to the object */}
          <div className="pointer-events-none absolute left-full top-2 w-[9vw] translate-x-1 opacity-90">
            <Squiggly flip={i % 2 === 1} />
            <p className="hand -mt-1 text-[clamp(0.8rem,1.15vw,1.1rem)] leading-[1.15] text-fg/85">
              {item.note}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const TINTS = ["#d9cfc0", "#e6c7d2", "#c9d1c4", "#e3d2b8", "#cdc3b6", "#dcd3e0", "#e0cfc4", "#c8ccd6"];

/** The object itself — your cut-out, or a stand-in shape until you add one. */
function Cutout({ item, index }: { item: Obsession; index: number }) {
  if (item.image) {
    return (
      <div className="relative aspect-square w-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="20vw"
          className="object-contain drop-shadow-[0_10px_18px_rgba(20,17,15,0.22)]"
        />
      </div>
    );
  }
  return (
    <div
      className="relative aspect-square w-full rounded-[38%_62%_55%_45%/50%_42%_58%_50%] shadow-[0_10px_20px_rgba(20,17,15,0.18)]"
      style={{ background: TINTS[index % TINTS.length] }}
      role="img"
      aria-label={`${item.title} — no picture yet`}
    >
      <span className="absolute inset-0 flex items-center justify-center px-2 text-center text-[0.6rem] uppercase tracking-[0.18em] text-fg/35">
        add a cut-out
      </span>
    </div>
  );
}

/** A short pencil arrow curving back toward the object. */
function Squiggly({ flip }: { flip: boolean }) {
  return (
    <svg
      viewBox="0 0 80 30"
      className="h-4 w-16 text-fg/60"
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        d="M74 22 Q52 26 34 14 Q22 6 8 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M8 10 l9 -4 M8 10 l7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
