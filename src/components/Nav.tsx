"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { useEggs } from "@/components/eggs/EasterEggs";
import { useDeck } from "@/components/mag/deck";
import { MarkerCircle } from "@/components/mag/MarkerCircle";

/** Section order must match the deck order in app/page.tsx. */
const ORDER = ["#about", "#sound", "#obsessions", "#feature", "#table"];
const FIRST_SECTION = 1;

/**
 * The masthead bar. It stays put and carries the page count; the nav links
 * jump the deck rather than scrolling anywhere.
 */
export function Nav() {
  const deck = useDeck();
  const { say, theme } = useEggs();
  const nameClicks = useRef<number[]>([]);

  /** Three fast clicks on the masthead nudges you toward the code. */
  function onNameClick() {
    const now = Date.now();
    nameClicks.current = [...nameClicks.current, now].filter((t) => now - t < 900);
    if (nameClicks.current.length >= 3) {
      nameClicks.current = [];
      say("↑ ↑ ↓ ↓ ← → ← → B A");
    }
  }

  function jump(href: string) {
    if (!deck) return;
    const target = ORDER.indexOf(href) + FIRST_SECTION;
    if (target < 0) return;
    deck.go(target - deck.index);
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <nav className="pointer-events-auto flex items-center justify-between gap-6 bg-bg/80 px-6 py-3 backdrop-blur-md sm:px-12">
        <button type="button" onClick={onNameClick} className="kicker text-left leading-tight">
          <span className="block font-display text-base tracking-normal">{site.name}</span>
          <span className="block text-[0.55rem] text-fg/50">
            {site.issue} · {site.season}
          </span>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          {site.nav.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => jump(item.href)}
              className="group relative px-3 py-1.5"
            >
              <span className="kicker relative z-10 text-fg/70 transition-colors group-hover:text-fg">
                {item.label}
              </span>
              <MarkerCircle />
            </button>
          ))}
        </div>

        <span className="kicker text-fg/45">
          {theme === "noir"
            ? "Director's cut"
            : `${(deck?.index ?? 0) + 1} / ${deck?.total ?? 1}`}
        </span>
      </nav>
    </header>
  );
}
