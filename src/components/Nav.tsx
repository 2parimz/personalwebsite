"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { site } from "@/content/site";
import { useEggs } from "@/components/eggs/EasterEggs";
import { useScroller } from "@/components/mag/scroller";

const PAGES = 7;

/**
 * The masthead bar. It stays put — on a horizontal issue there is no
 * "scrolling down past it" — and carries a live page count instead.
 */
export function Nav() {
  const container = useScroller();
  const { scrollXProgress } = useScroll({ container: container ?? undefined, axis: "x" });
  const [page, setPage] = useState(1);

  const { say, theme } = useEggs();
  const nameClicks = useRef<number[]>([]);

  const spread = useTransform(scrollXProgress, (v) =>
    Math.min(PAGES, Math.max(1, Math.round(v * (PAGES - 1)) + 1))
  );
  useMotionValueEvent(spread, "change", (v) => setPage(v));

  /** Three fast clicks on the masthead nudges you toward the code. */
  function onNameClick() {
    const now = Date.now();
    nameClicks.current = [...nameClicks.current, now].filter((t) => now - t < 900);
    if (nameClicks.current.length >= 3) {
      nameClicks.current = [];
      say("↑ ↑ ↓ ↓ ← → ← → B A");
    }
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <nav className="pointer-events-auto flex items-center justify-between gap-6 border-b border-rule bg-bg/80 px-6 py-3 backdrop-blur-md sm:px-12">
        <button type="button" onClick={onNameClick} className="kicker text-left leading-tight">
          <span className="block font-display text-base tracking-normal">{site.name}</span>
          <span className="block text-[0.55rem] text-fg/50">
            {site.issue} · {site.season}
          </span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} className="kicker link-underline text-fg/70 hover:text-fg">
              {item.label}
            </a>
          ))}
        </div>

        <span className="kicker text-fg/45">
          {theme === "noir" ? "Director's cut" : `${page} / ${PAGES}`}
        </span>
      </nav>
    </header>
  );
}
