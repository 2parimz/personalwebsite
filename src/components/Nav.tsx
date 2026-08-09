"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { site } from "@/content/site";
import { useEggs } from "@/components/eggs/EasterEggs";
import { EASE } from "@/components/Reveal";

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const previous = useRef(0);

  const { say, theme } = useEggs();
  const nameClicks = useRef<number[]>([]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSolid(latest > 40);
    // Get out of the way going down, come back on the way up.
    setHidden(latest > previous.current && latest > 220);
    previous.current = latest;
  });

  /** Egg #6: three fast clicks on the masthead nudges you toward the code. */
  function onNameClick() {
    const now = Date.now();
    nameClicks.current = [...nameClicks.current, now].filter((t) => now - t < 900);
    if (nameClicks.current.length >= 3) {
      nameClicks.current = [];
      say("↑ ↑ ↓ ↓ ← → ← → B A");
    }
  }

  return (
    <motion.header
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.45, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "border-b border-rule bg-bg/85 backdrop-blur-md" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={onNameClick}
          className="kicker text-left leading-tight"
          aria-label={`${site.name} — back to top`}
        >
          <span className="block font-display text-lg tracking-normal">{site.name}</span>
          <span className="block text-[0.6rem] text-fg/50">
            {site.issue} · {site.season}
          </span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} className="kicker link-underline text-fg/70 hover:text-fg">
              {item.label}
            </a>
          ))}
          <Link href="/about" className="kicker link-underline text-fg/70 hover:text-fg">
            Full Profile
          </Link>
        </div>

        <span className="kicker hidden text-fg/40 sm:block">
          {theme === "noir" ? "Director's cut" : site.location}
        </span>
      </nav>
    </motion.header>
  );
}
