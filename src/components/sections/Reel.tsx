"use client";

import { reel } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { FilmStrip } from "@/components/FilmStrip";
import { Camcorder } from "@/components/Camcorder";

export function Reel() {
  return (
    <section id="reel" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          index="05 / Elsewhere"
          title={`Recently, ${reel.place}`}
          italicFrom={1}
          intro={reel.blurb}
        />

        <div className="grid grid-cols-12 items-start gap-x-8 gap-y-12">
          <Reveal className="col-span-12 lg:col-span-7">
            <Camcorder />
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-4 lg:col-start-9" delay={0.1}>
            <p className="kicker text-fg/45">{reel.dates}</p>
            <p className="mt-3 font-display text-3xl italic leading-tight">
              {reel.photos.length} frames and one clip that didn&apos;t make the cut.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg/65">
              The strip runs on its own. Hover to hold it still, or step through
              frame by frame with the arrows. Click any frame to blow it up.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed strip */}
      <div className="mt-16">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <FilmStrip photos={reel.photos} />
        </div>
      </div>
    </section>
  );
}
