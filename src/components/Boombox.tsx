"use client";

import { motion } from "framer-motion";
import type { Cassette } from "@/content/site";
import { CassetteArt } from "@/components/Cassette";

const GRILLE = {
  backgroundImage: "radial-gradient(#3a3632 1.1px, transparent 1.3px)",
  backgroundSize: "6px 6px",
};

export function Boombox({
  loaded,
  playing,
  onTogglePlay,
  onEject,
  deckRef,
  dropHint,
}: {
  loaded: Cassette | null;
  playing: boolean;
  onTogglePlay: () => void;
  onEject: () => void;
  deckRef: React.RefObject<HTMLDivElement | null>;
  /** True while a tape is being dragged, so the deck can light up. */
  dropHint: boolean;
}) {
  return (
    <div className="w-full max-w-[560px]">
      {/* carry handle */}
      <div aria-hidden="true" className="mx-auto h-10 w-1/2">
        <div className="h-10 w-full rounded-t-[999px] border-[6px] border-b-0 border-[#8f8981]" />
      </div>

      <div className="grain relative rounded-xl border-2 border-[#6f6a63] bg-gradient-to-b from-[#d5cfc6] to-[#a8a29a] p-3 shadow-2xl sm:p-4">
        {/* tuner strip */}
        <div className="relative mb-3 h-9 overflow-hidden rounded-sm border border-[#6f6a63] bg-gradient-to-b from-[#2f2b28] to-[#1b1917] px-3">
          <div className="flex h-full items-center justify-between">
            {["88", "92", "96", "100", "104", "108"].map((n) => (
              <span key={n} className="kicker text-[0.45rem] text-[#d8d2c6]/70">
                {n}
              </span>
            ))}
          </div>
          <motion.span
            aria-hidden="true"
            animate={{ left: playing ? ["18%", "72%", "34%"] : "34%" }}
            transition={
              playing
                ? { duration: 9, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.6 }
            }
            className="absolute top-0 h-full w-[2px] bg-[#e03b2c]"
          />
        </div>

        <div className="flex items-stretch gap-3">
          <Speaker />

          {/* centre column */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {/* the deck — drop target */}
            <div
              ref={deckRef}
              className={`relative flex min-h-[110px] flex-1 items-center justify-center rounded-sm border-2 bg-[#221f1d] p-2 transition-colors duration-300 ${
                dropHint ? "border-dashed border-[#f5cf3d]" : "border-[#6f6a63]"
              }`}
            >
              {loaded ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CassetteArt cassette={loaded} spinning={playing} width={150} />
                </motion.div>
              ) : (
                <p className="kicker px-2 text-center text-[0.5rem] leading-relaxed text-[#d8d2c6]/45">
                  {dropHint ? "Drop it here" : "Empty deck — drag a tape in"}
                </p>
              )}
            </div>

            {/* transport buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={playing ? "Pause" : "Play"}
                className="flex h-9 flex-1 items-center justify-center rounded-[3px] border border-[#6f6a63] bg-gradient-to-b from-[#e2ddd4] to-[#b8b2a9] text-[#2b2724] shadow-sm transition-transform active:translate-y-[1px]"
              >
                {playing ? (
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <rect x="2" y="1" width="4" height="14" />
                    <rect x="10" y="1" width="4" height="14" />
                  </svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M3 1 L15 8 L3 15 Z" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={onEject}
                disabled={!loaded}
                aria-label="Eject the tape"
                className="flex h-9 flex-1 items-center justify-center rounded-[3px] border border-[#6f6a63] bg-gradient-to-b from-[#e2ddd4] to-[#b8b2a9] text-[#2b2724] shadow-sm transition-transform active:translate-y-[1px] disabled:opacity-40"
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 1 L15 9 L1 9 Z" />
                  <rect x="1" y="11" width="14" height="3" />
                </svg>
              </button>
            </div>
          </div>

          <Speaker />
        </div>

        {/* knobs */}
        <div className="mt-3 flex items-center justify-center gap-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden="true"
              className="relative h-6 w-6 rounded-full border border-[#6f6a63] bg-gradient-to-b from-[#e2ddd4] to-[#9d978f]"
            >
              <span className="absolute left-1/2 top-1 h-2 w-[2px] -translate-x-1/2 bg-[#2b2724]" />
            </span>
          ))}
          <motion.span
            aria-hidden="true"
            animate={{ opacity: playing ? [1, 0.3, 1] : 0.25 }}
            transition={playing ? { duration: 1.4, repeat: Infinity } : { duration: 0.3 }}
            className="ml-2 h-2.5 w-2.5 rounded-full bg-[#e03b2c]"
          />
        </div>
      </div>
    </div>
  );
}

function Speaker() {
  return (
    <div
      aria-hidden="true"
      className="hidden aspect-square w-[26%] shrink-0 items-center justify-center rounded-full border-2 border-[#6f6a63] bg-[#bdb7ae] sm:flex"
    >
      <div className="flex h-[86%] w-[86%] items-center justify-center rounded-full border border-[#8f8981] bg-[#4a4642]">
        <div className="h-[88%] w-[88%] rounded-full" style={GRILLE} />
      </div>
    </div>
  );
}
