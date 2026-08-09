"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Photo } from "@/content/site";
import { Frame } from "@/components/Frame";

/** Perforations down the top and bottom edges of the strip. */
function Sprockets({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-3.5 w-full shrink-0 ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0 12px, #efe8d8 12px 28px)",
      }}
    />
  );
}

export function FilmStrip({ photos }: { photos: Photo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLButtonElement>(null);
  const hovering = useRef(false);

  const [auto, setAuto] = useState(true);
  const [open, setOpen] = useState<number | null>(null);

  // The list is doubled so the loop can wrap without a visible seam.
  const run = [...photos, ...photos];

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let id = 0;
    function step() {
      const el = trackRef.current;
      if (el && !hovering.current) {
        el.scrollLeft += 0.55;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      }
      id = requestAnimationFrame(step);
    }
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [auto]);

  /** Advance exactly one frame, and drop out of auto-scroll. */
  const step = useCallback((direction: 1 | -1) => {
    setAuto(false);
    const el = trackRef.current;
    const frame = frameRef.current;
    if (!el || !frame) return;
    const width = frame.offsetWidth + 16; // frame + gap
    el.scrollBy({ left: direction * width, behavior: "smooth" });
  }, []);

  const close = useCallback(() => setOpen(null), []);
  const nudge = useCallback((delta: number) => {
    setOpen((current) => (current === null ? current : (current + delta + photos.length) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (open === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") nudge(1);
      if (event.key === "ArrowLeft") nudge(-1);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, nudge]);

  const active = open === null ? null : photos[open];

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous frame"
          className="kicker flex h-10 w-10 items-center justify-center rounded-full border border-rule transition-colors hover:bg-fg hover:text-bg"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next frame"
          className="kicker flex h-10 w-10 items-center justify-center rounded-full border border-rule transition-colors hover:bg-fg hover:text-bg"
        >
          →
        </button>
        <button
          type="button"
          onClick={() => setAuto((v) => !v)}
          aria-pressed={auto}
          className="kicker border border-rule px-4 py-2 transition-colors hover:bg-fg hover:text-bg"
        >
          {auto ? "Pause reel" : "Run reel"}
        </button>
        <span className="kicker hidden text-fg/40 sm:block">
          {auto ? "Rolling — hover to hold" : "Manual — one frame at a time"}
        </span>
      </div>

      {/* The strip */}
      <div className="grain relative overflow-hidden bg-[#14110f] py-3">
        <Sprockets className="mb-3" />

        <div
          ref={trackRef}
          onPointerEnter={() => (hovering.current = true)}
          onPointerLeave={() => (hovering.current = false)}
          onWheel={() => setAuto(false)}
          onTouchStart={() => setAuto(false)}
          className={`flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            auto ? "" : "snap-x snap-mandatory"
          }`}
        >
          {run.map((photo, i) => (
            <button
              key={`${photo.alt}-${i}`}
              ref={i === 0 ? frameRef : undefined}
              type="button"
              onClick={() => setOpen(i % photos.length)}
              className="group w-[220px] shrink-0 snap-center sm:w-[300px]"
            >
              <div className="border-[3px] border-[#efe8d8] transition-transform duration-500 group-hover:scale-[1.03]">
                <Frame
                  photo={{ ...photo, ratio: "landscape" }}
                  showCaption={false}
                  sizes="(max-width: 640px) 220px, 300px"
                />
              </div>
              <p className="kicker mt-2 truncate text-left text-[0.55rem] text-[#efe8d8]/55">
                {photo.caption ?? photo.alt}
              </p>
            </button>
          ))}
        </div>

        <Sprockets className="mt-3" />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            className="fixed inset-0 z-[85] flex items-center justify-center p-4 sm:p-10"
          >
            <div className="absolute inset-0 bg-[#14110f]/95 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              <Frame
                photo={active}
                sizes="90vw"
                showCaption={false}
                fit="contain"
                keepRatio={false}
                boxClassName="h-[68vh] bg-transparent"
              />
              <div className="mt-3 flex items-center justify-between gap-4 text-[#efe8d8]">
                <span className="kicker">{active.caption ?? active.alt}</span>
                <span className="kicker opacity-60">
                  {open + 1} / {photos.length}
                </span>
              </div>
            </motion.div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nudge(-1); }}
              aria-label="Previous photo"
              className="kicker absolute left-3 top-1/2 -translate-y-1/2 p-4 text-[#efe8d8]/70 hover:text-[#efe8d8]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nudge(1); }}
              aria-label="Next photo"
              className="kicker absolute right-3 top-1/2 -translate-y-1/2 p-4 text-[#efe8d8]/70 hover:text-[#efe8d8]"
            >
              →
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="kicker absolute right-5 top-5 text-[#efe8d8]/70 hover:text-[#efe8d8]"
            >
              Close ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
