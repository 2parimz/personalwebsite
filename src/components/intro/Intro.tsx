"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { intro } from "@/content/site";
import { RoomScene } from "@/components/intro/RoomScene";

const SEEN_KEY = "intro-seen";

type Phase = "scene" | "closing" | "opening";

/**
 * The illustrated cover that sits in front of the issue. Clicking the arrow
 * pulls the curtains shut over the room, swaps the scene out behind them,
 * then draws them back to reveal the site — so the two never cross-fade
 * through each other.
 */
export function Intro() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [visible, setVisible] = useState(intro.enabled && onHome);
  const [phase, setPhase] = useState<Phase>("scene");
  const [reduced, setReduced] = useState(false);

  // Returning visitors in the same session skip straight through.
  useEffect(() => {
    if (!intro.enabled || !onHome) {
      setVisible(false);
      return;
    }
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (intro.showOncePerSession && sessionStorage.getItem(SEEN_KEY)) {
      setVisible(false);
    }
  }, [onHome]);

  // Hold the page still underneath.
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  const enter = useCallback(() => {
    if (phase !== "scene") return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private browsing — the intro just shows again next load.
    }
    if (reduced) {
      setVisible(false);
      return;
    }
    setPhase("closing");
    window.setTimeout(() => setPhase("opening"), 680);
    window.setTimeout(() => setVisible(false), 1560);
  }, [phase, reduced]);

  // Enter / Space / Escape all get you in.
  useEffect(() => {
    if (!visible) return;
    function onKey(event: KeyboardEvent) {
      if (["Enter", " ", "Escape"].includes(event.key)) {
        event.preventDefault();
        enter();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, enter]);

  if (!visible) return null;

  const curtainsShut = phase === "closing";

  return (
    <div className="fixed inset-0 z-[200]" aria-label="Intro">
      {/* the room */}
      <AnimatePresence>
        {phase !== "opening" && (
          <motion.div
            key="scene"
            className="grain absolute inset-0 overflow-hidden bg-[#ded4c3]"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            <RoomScene reduced={reduced} />

            {/* skip, for anyone who has seen it */}
            <button
              type="button"
              onClick={enter}
              className="kicker absolute right-6 top-6 text-[#1c1a17]/45 underline-offset-4 transition-colors hover:text-[#1c1a17] hover:underline"
            >
              Skip
            </button>

            {/* the arrow */}
            <motion.button
              type="button"
              onClick={enter}
              aria-label={`${intro.cue} — enter the site`}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduced ? 0 : 4.2 }}
              className="group absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[#1c1a17]"
            >
              <span className="kicker transition-opacity group-hover:opacity-60">{intro.cue}</span>
              <motion.span
                animate={reduced ? {} : { y: [0, 9, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="block"
              >
                <SketchArrow />
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* curtains — meet in the middle, then draw back */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 origin-left"
        initial={{ x: "-100%" }}
        animate={{ x: curtainsShut ? "0%" : "-100%" }}
        transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
      >
        <CurtainPanel side="left" />
      </motion.div>
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 origin-right"
        initial={{ x: "100%" }}
        animate={{ x: curtainsShut ? "0%" : "100%" }}
        transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
      >
        <CurtainPanel side="right" />
      </motion.div>
    </div>
  );
}

/** A heavy linen drape, ruched with soft vertical shading. */
function CurtainPanel({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="grain relative h-full w-full bg-[#efe9dd]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(28,26,23,0.10) 0 2px, rgba(28,26,23,0) 2px 34px)",
        boxShadow:
          side === "left"
            ? "inset -26px 0 40px -18px rgba(28,26,23,0.42)"
            : "inset 26px 0 40px -18px rgba(28,26,23,0.42)",
      }}
    />
  );
}

/** Pencil-sketch arrow: a slightly wobbly shaft, drawn twice, open head. */
function SketchArrow() {
  return (
    <svg width="30" height="56" viewBox="0 0 30 56" fill="none" aria-hidden="true">
      <path
        d="M15 3 C 12.6 15, 17.2 27, 14.4 41"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M16.2 5 C 14 16, 18 28, 15.4 40"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M4 33 Q 14.6 49 26 32"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M5.6 34.5 Q 15 49.5 24.6 33.6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
