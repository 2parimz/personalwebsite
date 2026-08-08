"use client";

import { Reveal } from "@/components/Reveal";
import { Squiggle } from "@/components/LineArt";
import { StarButton } from "@/components/Star";

export function SectionHeading({
  index,
  title,
  intro,
  italicFrom,
}: {
  index: string;
  title: string;
  intro?: string;
  /** Word index from which the headline turns italic, magazine-style. */
  italicFrom?: number;
}) {
  const words = title.split(" ");

  return (
    <Reveal className="mb-10 sm:mb-14">
      <div className="rule flex items-baseline justify-between gap-4 pt-3">
        <span className="kicker text-fg/50">{index}</span>
        <StarButton size={14} label={`Star ${title}`} />
      </div>

      <h2 className="display mt-5 text-[clamp(2.6rem,8vw,6rem)]">
        {words.map((word, i) => (
          <span
            key={word + i}
            className={italicFrom !== undefined && i >= italicFrom ? "italic" : ""}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </h2>

      <Squiggle className="mt-4 h-4 w-40 text-accent" />

      {intro && <p className="mt-4 max-w-md text-sm leading-relaxed text-fg/70">{intro}</p>}
    </Reveal>
  );
}
