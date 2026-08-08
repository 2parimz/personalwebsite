"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { trip } from "@/content/site";
import { Frame } from "@/components/Frame";
import { SectionHeading } from "@/components/SectionHeading";
import { EASE, Reveal } from "@/components/Reveal";

export function Trip() {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((delta: number) => {
    setOpen((current) => {
      if (current === null) return current;
      return (current + delta + trip.photos.length) % trip.photos.length;
    });
  }, []);

  useEffect(() => {
    if (open === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const active = open === null ? null : trip.photos[open];

  return (
    <section id="trip" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        index="05 / Elsewhere"
        title={`Recently, ${trip.place}`}
        italicFrom={1}
        intro={trip.blurb}
      />

      <Reveal>
        <p className="kicker mb-8 text-fg/45">
          {trip.dates} · {trip.photos.length} frames
        </p>
      </Reveal>

      <div className="columns-2 gap-4 [column-fill:balance] lg:columns-3">
        {trip.photos.map((photo, i) => (
          <motion.button
            key={photo.alt + i}
            type="button"
            layoutId={`trip-${i}`}
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.06, ease: EASE }}
            whileHover={{ scale: 1.015, rotate: i % 2 ? 0.7 : -0.7 }}
            className="mb-4 block w-full break-inside-avoid text-left"
          >
            <Frame photo={photo} sizes="(max-width: 1024px) 45vw, 30vw" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
          >
            <div className="absolute inset-0 bg-fg/92 backdrop-blur-sm" />

            <motion.div
              layoutId={`trip-${open}`}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-full w-full max-w-3xl"
            >
              <Frame
                photo={active}
                sizes="90vw"
                showCaption={false}
                fit="contain"
                keepRatio={false}
                boxClassName="h-[68vh] bg-transparent"
              />
              <div className="mt-3 flex items-center justify-between gap-4 text-bg">
                <span className="kicker">{active.caption ?? active.alt}</span>
                <span className="kicker opacity-60">
                  {open + 1} / {trip.photos.length}
                </span>
              </div>
            </motion.div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="kicker absolute left-4 top-1/2 -translate-y-1/2 p-4 text-bg/70 hover:text-bg"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="kicker absolute right-4 top-1/2 -translate-y-1/2 p-4 text-bg/70 hover:text-bg"
            >
              →
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="kicker absolute right-5 top-5 text-bg/70 hover:text-bg"
            >
              Close ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
