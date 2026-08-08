"use client";

import { motion } from "framer-motion";
import { obsessions, site } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, RevealGroup, revealChild } from "@/components/Reveal";
import { Doily } from "@/components/Doily";
import { StarButton, StarIcon } from "@/components/Star";

export function Obsessions() {
  return (
    <section
      id="obsessions"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeading
        index="03 / The list"
        title="Summer obsessions"
        italicFrom={1}
        intro={obsessions.intro}
      />

      <div className="grid grid-cols-12 gap-x-6 gap-y-14">
        {/* The doily card — a keepsake pinned to the page */}
        <Reveal className="col-span-12 md:col-span-5 lg:col-span-4" y={44}>
          <motion.div
            initial={{ rotate: -2.5 }}
            whileHover={{ rotate: 0, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
          >
            <Doily>
              <p className="kicker text-[0.55rem] text-[#14110f]/50">{site.season}</p>

              <p className="font-display text-[clamp(1.35rem,2.6vw,2.1rem)] italic leading-[0.98]">
                What I cannot stop thinking about
              </p>

              <div className="flex items-center gap-2 text-[#cf3b2c]">
                <StarIcon size={13} />
                <StarIcon size={13} />
                <StarIcon size={13} />
              </div>

              <p className="text-[0.7rem] leading-relaxed text-[#14110f]/65">
                Cut out and kept. Replaced without ceremony the moment something
                better turns up.
              </p>
            </Doily>
          </motion.div>
        </Reveal>

        {/* Numbered sidebar list */}
        <RevealGroup className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
          {obsessions.items.map((item, i) => (
            <motion.div
              key={item.title + i}
              variants={revealChild}
              className="group border-b border-rule"
            >
              <div className="flex items-baseline gap-4 py-5 transition-transform duration-500 group-hover:translate-x-2">
                <span className="font-display text-2xl text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-fg/65">{item.note}</p>
                </div>
                <StarButton size={16} label={`Star ${item.title}`} />
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
