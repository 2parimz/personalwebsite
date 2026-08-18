"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScroller } from "@/components/mag/scroller";
import { site } from "@/content/site";

/**
 * One spread, exactly one viewport wide and full-bleed — no scaling or 3D
 * swing, so you never see the edge of the next page from the current one.
 * The turn reads through the gutter shadow at each edge and a small
 * parallax on the contents as the page passes.
 */
export function Page({
  id,
  folio,
  runningHead,
  children,
  /** The olive field appears on one spread only; leave it off elsewhere. */
  stripe = "none",
  tone,
  className = "",
}: {
  id?: string;
  folio: string;
  runningHead: string;
  children: ReactNode;
  stripe?: "right" | "bottom" | "none";
  /** Optional page colour, for spreads that break from the cream. */
  tone?: string;
  className?: string;
}) {
  const container = useScroller();
  const ref = useRef<HTMLElement>(null);

  const { scrollXProgress } = useScroll({
    container: container ?? undefined,
    target: ref,
    axis: "x",
    offset: ["start end", "end start"],
  });

  const inkX = useTransform(scrollXProgress, [0, 1], [56, -56]);
  const stripeOpacity = useTransform(scrollXProgress, [0.2, 0.5, 0.8], [0, 1, 0]);

  return (
    <section
      ref={ref}
      id={id}
      style={tone ? { background: tone } : undefined}
      className={`relative h-full w-full shrink-0 overflow-hidden bg-bg ${className}`}
    >
      {stripe !== "none" && (
        <motion.div aria-hidden="true" style={{ opacity: stripeOpacity }} className="pointer-events-none absolute inset-0">
          <OliveField where={stripe} />
        </motion.div>
      )}

      <motion.div
        style={{ x: inkX }}
        className="relative z-10 flex h-full flex-col px-8 pb-12 pt-24 sm:px-14 sm:pb-14 sm:pt-28"
      >
        {children}
      </motion.div>

      {/* folio line */}
      <div className="pointer-events-none absolute inset-x-8 bottom-4 z-20 flex items-end justify-between sm:inset-x-14">
        <span className="kicker text-[0.55rem] text-fg/35">{folio}</span>
        <span className="kicker text-[0.55rem] text-fg/35">{runningHead}</span>
        <span className="kicker text-[0.55rem] text-fg/35">{site.issue}</span>
      </div>

      {/* gutter — the shadow of the binding at each edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-[#14110f]/12 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-[#14110f]/12 to-transparent"
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
