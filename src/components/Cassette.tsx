"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { Cassette } from "@/content/site";

/** The tape itself — no behaviour, just the object. */
export function CassetteArt({
  cassette,
  spinning = false,
  width = 210,
}: {
  cassette: Cassette;
  spinning?: boolean;
  width?: number;
}) {
  const height = width * 0.62;

  return (
    <div
      className="grain relative select-none overflow-hidden rounded-[4px] border-2 border-[#14110f] shadow-md"
      style={{ width, height, background: cassette.color }}
    >
      {/* screws */}
      {[
        "left-1 top-1",
        "right-1 top-1",
        "left-1 bottom-1",
        "right-1 bottom-1",
      ].map((pos) => (
        <span key={pos} className={`absolute ${pos} h-1.5 w-1.5 rounded-full bg-black/35`} />
      ))}

      {/* paper label */}
      <div className="absolute inset-x-2.5 top-2.5 rounded-[2px] border border-black/30 bg-[#f6f2e8] px-2 py-1.5">
        <p className="truncate font-display text-[0.8rem] font-semibold leading-tight text-[#14110f]">
          {cassette.label}
        </p>
        <p className="kicker truncate text-[0.42rem] text-[#14110f]/55">{cassette.sublabel}</p>
      </div>

      {/* window with reels */}
      <div className="absolute inset-x-4 bottom-3 flex h-[38%] items-center justify-around rounded-[2px] border border-black/40 bg-[#2b2724]">
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            animate={spinning ? { rotate: 360 } : { rotate: 0 }}
            transition={
              spinning
                ? { duration: 2.4, repeat: Infinity, ease: "linear" }
                : { duration: 0.3 }
            }
            className="relative flex h-7 w-7 items-center justify-center rounded-full border border-black/50 bg-[#d9d4cb]"
          >
            {[0, 60, 120].map((deg) => (
              <span
                key={deg}
                className="absolute h-full w-[3px] bg-[#2b2724]"
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
            <span className="relative h-2.5 w-2.5 rounded-full bg-[#2b2724]" />
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/**
 * A tape you can pick up. Drag it onto the deck — or just click it, which
 * does the same thing and keeps this usable without a mouse.
 */
export function DraggableCassette({
  cassette,
  deckRef,
  onLoad,
  index,
  setDragging,
}: {
  cassette: Cassette;
  deckRef: React.RefObject<HTMLDivElement | null>;
  onLoad: (id: string) => void;
  index: number;
  /** Lets the deck light up while a tape is in the air. */
  setDragging?: (value: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function handleDragEnd() {
    setDragging?.(false);
    const deck = deckRef.current?.getBoundingClientRect();
    const tape = ref.current?.getBoundingClientRect();
    if (!deck || !tape) return;

    // Overlap test — more reliable across mouse and touch than pointer coords.
    const overlaps =
      tape.left < deck.right &&
      tape.right > deck.left &&
      tape.top < deck.bottom &&
      tape.bottom > deck.top;

    if (overlaps) onLoad(cassette.id);
    // Reset shortly after so the click handler doesn't also fire.
    setTimeout(() => (dragging.current = false), 60);
  }

  return (
    <motion.div
      ref={ref}
      drag
      dragSnapToOrigin
      dragMomentum={false}
      dragElastic={0.18}
      onDragStart={() => {
        dragging.current = true;
        setDragging?.(true);
      }}
      onDragEnd={handleDragEnd}
      onClick={() => {
        if (!dragging.current) onLoad(cassette.id);
      }}
      initial={{ rotate: index % 2 === 0 ? -3 : 2.5 }}
      whileHover={{ scale: 1.04, rotate: 0 }}
      whileDrag={{ scale: 1.08, rotate: 0, zIndex: 40, cursor: "grabbing" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      role="button"
      tabIndex={0}
      aria-label={`Load the ${cassette.label} tape`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onLoad(cassette.id);
        }
      }}
      className="relative cursor-grab touch-none active:cursor-grabbing"
    >
      <CassetteArt cassette={cassette} width={190} />
    </motion.div>
  );
}
