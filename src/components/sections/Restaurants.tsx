"use client";

import { motion } from "framer-motion";
import { restaurants } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { RevealGroup, revealChild } from "@/components/Reveal";
import { StarIcon } from "@/components/Star";

export function Restaurants() {
  return (
    <section
      id="restaurants"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeading
        index="04 / The table"
        title="Where I eat"
        italicFrom={1}
        intro={restaurants.intro}
      />

      <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {restaurants.items.map((place, i) => (
          <motion.article
            key={place.name + i}
            variants={revealChild}
            whileHover={{ y: -6, rotate: i % 2 === 0 ? -0.8 : 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="grain relative flex h-full flex-col border border-rule bg-paper p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl leading-tight">{place.name}</h3>
              <span className="kicker shrink-0 pt-1 text-fg/45">{place.city}</span>
            </div>

            <div className="mt-3 flex gap-1 text-accent" aria-label={`${place.stars} out of 5`}>
              {Array.from({ length: 5 }, (_, s) => (
                <StarIcon key={s} size={13} filled={s < place.stars} />
              ))}
            </div>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-fg/70">{place.note}</p>

            <p className="kicker mt-6 border-t border-rule pt-3 text-fg/50">
              Order — {place.order}
            </p>
          </motion.article>
        ))}
      </RevealGroup>
    </section>
  );
}
