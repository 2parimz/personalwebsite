"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScroller } from "@/components/mag/scroller";
import { site } from "@/content/site";

/**
 * One spread. Each page swings on its own axis as it passes the viewport,
 * with a shadow down the spine edge, so moving through the issue reads as
 * turning pages rather than sliding a carousel.
 *
 * The olive shape is tied to the same progress: it sweeps in as the page
 * arrives and leaves with it.
 */
export function Page({
  id,
  folio,
  runningHead,
  children,
  stripe = "right",
  className = "",
}: {
  id?: string;
  folio: string;
  runningHead: string;
  children: ReactNode;
  /** Where the olive shape sits on this spread. */
  stripe?: "right" | "left" | "bottom" | "none";
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

  const rotateY = useTransform(scrollXProgress, [0, 0.5, 1], [13, 0, -13]);
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.93, 1, 0.93]);
  const dim = useTransform(scrollXProgress, [0, 0.5, 1], [0.5, 0, 0.5]);
  const inkY = useTransform(scrollXProgress, [0, 0.5, 1], [40, 0, -40]);

  const stripeOpacity = useTransform(scrollXProgress, [0.16, 0.5, 0.84], [0, 1, 0]);
  const stripeShift = useTransform(scrollXProgress, [0, 1], [70, -70]);

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ rotateY, scale }}
      className={`relative h-full w-screen shrink-0 origin-center overflow-hidden bg-bg ${className}`}
    >
      {/* the olive shape */}
      {stripe !== "none" && (
        <motion.div
          aria-hidden="true"
          style={{ opacity: stripeOpacity, x: stripeShift }}
          className="pointer-events-none absolute inset-0"
        >
          <OliveShape where={stripe} />
        </motion.div>
      )}

      {/* content */}
      <motion.div style={{ y: inkY }} className="relative z-10 flex h-full flex-col px-6 pb-14 pt-24 sm:px-12 sm:pb-16 sm:pt-28">
        {children}
      </motion.div>

      {/* running foot, like a real folio line */}
      <div className="pointer-events-none absolute inset-x-6 bottom-5 z-20 flex items-end justify-between sm:inset-x-12">
        <span className="kicker text-[0.55rem] text-fg/40">{folio}</span>
        <span className="kicker text-[0.55rem] text-fg/40">{runningHead}</span>
        <span className="kicker text-[0.55rem] text-fg/40">{site.issue}</span>
      </div>

      {/* spine shadow — darkens as the page swings away */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: dim }}
        className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-[#14110f]/45 via-transparent to-[#14110f]/45"
      />
    </motion.section>
  );
}

/** The organic olive field, borrowed from the trends spread. */
function OliveShape({ where }: { where: "right" | "left" | "bottom" }) {
  if (where === "bottom") {
    return (
      <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[42%] w-full">
        <path d="M0 148 Q260 42 520 128 Q760 206 1000 96 L1000 400 L0 400 Z" fill="var(--olive-field)" />
      </svg>
    );
  }
  const right = where === "right";
  return (
    <svg
      viewBox="0 0 600 1000"
      preserveAspectRatio="none"
      className={`absolute inset-y-0 h-full w-[52%] ${right ? "right-0" : "left-0"}`}
      style={right ? undefined : { transform: "scaleX(-1)" }}
    >
      <path d="M600 0 L600 1000 L180 1000 Q92 726 214 500 Q330 282 236 0 Z" fill="var(--olive-field)" />
    </svg>
  );
}
