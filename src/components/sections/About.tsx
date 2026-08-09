"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { about, site } from "@/content/site";
import { Frame } from "@/components/Frame";
import { EASE, Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1400px] scroll-mt-20 px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20"
    >
      <SectionHeading
        index="01 / About"
        title="The way she wears it"
        italicFrom={2}
      />

      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <Reveal className="col-span-12 md:col-span-5 lg:col-span-4" y={40}>
          <FlipPortrait />
        </Reveal>

        <div className="col-span-12 md:col-span-7 lg:col-span-6 lg:col-start-6">
          <Reveal>
            <p className="font-display text-2xl italic leading-snug sm:text-3xl">
              {about.standfirst}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {about.columns.map((paragraph, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <p className={`column ${i === 0 ? "column--dropcap" : ""}`}>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <dl className="rule mt-10 grid grid-cols-2 gap-x-6 gap-y-4 pt-6 sm:grid-cols-4">
              {about.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="kicker text-fg/45">{fact.label}</dt>
                  <dd className="mt-1 text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="kicker link-underline"
                >
                  {social.label} ↗
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Easter egg: the portrait is a physical print. Turn it over and there's
 * something written on the back.
 */
function FlipPortrait() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full max-w-xs">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        aria-label={flipped ? "Turn the photo back over" : "Turn the photo over"}
        className="block w-full text-left [perspective:1400px]"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="relative [transform-style:preserve-3d]"
          style={{ aspectRatio: "3 / 4" }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <Frame
              photo={about.portrait}
              showCaption={false}
              sizes="(max-width: 768px) 80vw, 30vw"
              className="h-full [&>div]:h-full"
            />
          </div>

          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="grain relative flex h-full flex-col justify-between overflow-hidden bg-[#efe8d8] p-6 text-[#14110f]">
              <span className="kicker text-[#14110f]/45">On the back</span>
              <p className="font-display text-lg italic leading-snug">
                {about.portraitBackNote}
              </p>
              <span className="kicker text-[#14110f]/45">{about.portrait.caption}</span>
            </div>
          </div>
        </motion.div>
      </button>

      <p className="kicker mt-2 text-fg/45">{about.portrait.caption}</p>
    </div>
  );
}
