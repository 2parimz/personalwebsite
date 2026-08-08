"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { eggs, site } from "@/content/site";
import { Squiggle } from "@/components/LineArt";
import { StarButton } from "@/components/Star";

/**
 * Easter egg: keep scrolling once you have hit the bottom and the page
 * rubber-bands open to show the colophon hiding under the last page.
 */
export function Footer() {
  const [revealed, setRevealed] = useState(false);
  const pull = useMotionValue(0);
  const height = useSpring(pull, { stiffness: 220, damping: 28 });
  const amount = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function atBottom() {
      const doc = document.documentElement;
      return window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
    }

    function onWheel(event: WheelEvent) {
      if (event.deltaY <= 0) {
        amount.current = Math.max(0, amount.current - Math.abs(event.deltaY));
        pull.set(amount.current * 0.5);
        return;
      }
      if (!atBottom()) return;

      amount.current = Math.min(360, amount.current + event.deltaY);
      pull.set(amount.current * 0.5);
      if (amount.current > 260) setRevealed(true);
    }

    // Touch: a flick past the end counts too.
    let lastTouch = 0;
    function onTouchStart(event: TouchEvent) {
      lastTouch = event.touches[0]?.clientY ?? 0;
    }
    function onTouchMove(event: TouchEvent) {
      const y = event.touches[0]?.clientY ?? 0;
      const delta = lastTouch - y;
      lastTouch = y;
      if (delta > 0 && atBottom()) {
        amount.current = Math.min(360, amount.current + delta * 2.2);
        pull.set(amount.current * 0.5);
        if (amount.current > 260) setRevealed(true);
      }
    }

    if (reduced) {
      setRevealed(true);
      return;
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [pull]);

  return (
    <footer className="mx-auto max-w-[1400px] px-5 pb-10 sm:px-8">
      <div className="border-t border-rule pt-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="display text-[clamp(2.5rem,10vw,7rem)]">{site.name}</p>
            <p className="kicker mt-3 text-fg/50">
              {site.issue} · {site.season} · Printed on the internet
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="kicker link-underline"
              >
                {social.label} ↗
              </a>
            ))}
          </div>
        </div>

        <Squiggle className="mt-10 h-4 w-full text-rule" />

        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="kicker text-fg/40">
            © {new Date().getFullYear()} {site.name}
          </span>
          <StarButton size={16} label="One more star" />
        </div>
      </div>

      {/* The bit under the last page */}
      <motion.div style={{ height }} className="overflow-hidden">
        <div className="flex h-full min-h-[1px] items-center justify-center px-4">
          <motion.p
            animate={{ opacity: revealed ? 1 : 0.35 }}
            className="max-w-sm text-center font-display text-xl italic leading-snug text-fg/70"
          >
            {revealed ? eggs.endOfIssue : "…"}
          </motion.p>
        </div>
      </motion.div>
    </footer>
  );
}
