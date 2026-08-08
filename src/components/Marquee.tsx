"use client";

import { StarIcon } from "@/components/StarIcon";

/** Infinite ticker. The list is rendered twice so the loop is seamless. */
export function Marquee({
  items,
  duration = 42,
  className = "",
}: {
  items: readonly string[];
  duration?: number;
  className?: string;
}) {
  const run = [...items, ...items];

  return (
    <div className={`marquee relative overflow-hidden ${className}`}>
      <div
        className="marquee-track flex w-max items-center gap-8 whitespace-nowrap"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {run.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="font-display text-3xl sm:text-4xl">{item}</span>
            <span className="text-accent">
              <StarIcon size={14} />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
