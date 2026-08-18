"use client";

import type { ReactNode } from "react";
import { site } from "@/content/site";

/**
 * One spread. Every page is the same paper stock — the variation is in the
 * layout, not the colour. Pages sit stacked in the deck, so this is just a
 * full-bleed frame; the turn itself is handled by <PageDeck>.
 */
export function Page({
  id,
  folio,
  runningHead,
  children,
  /** The olive field appears on one spread only; leave it off elsewhere. */
  stripe = "none",
  className = "",
}: {
  id?: string;
  folio: string;
  runningHead: string;
  children: ReactNode;
  stripe?: "right" | "bottom" | "none";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative h-full w-full overflow-hidden bg-bg ${className}`}
    >
      {stripe !== "none" && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <OliveField where={stripe} />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col px-8 pb-12 pt-24 sm:px-14 sm:pb-14 sm:pt-28">
        {children}
      </div>

      {/* folio line */}
      <div className="pointer-events-none absolute inset-x-8 bottom-4 z-20 flex items-end justify-between sm:inset-x-14">
        <span className="kicker text-[0.55rem] text-fg/35">{folio}</span>
        <span className="kicker text-[0.55rem] text-fg/35">{runningHead}</span>
        <span className="kicker text-[0.55rem] text-fg/35">{site.issue}</span>
      </div>

      {/* the binding shadow down the left edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-[#14110f]/12 to-transparent"
      />
    </section>
  );
}

/** The single olive field, used once in the issue. */
function OliveField({ where }: { where: "right" | "bottom" }) {
  if (where === "bottom") {
    return (
      <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[38%] w-full">
        <path d="M0 148 Q260 42 520 128 Q760 206 1000 96 L1000 400 L0 400 Z" fill="var(--olive-field)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 600 1000" preserveAspectRatio="none" className="absolute inset-y-0 right-0 h-full w-[40%]">
      <path d="M600 0 L600 1000 L180 1000 Q92 726 214 500 Q330 282 236 0 Z" fill="var(--olive-field)" />
    </svg>
  );
}
