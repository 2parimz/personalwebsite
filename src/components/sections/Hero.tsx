"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { site, about } from "@/content/site";
import { Frame } from "@/components/Frame";
import { StarButton } from "@/components/Star";
import { TrouserPlate } from "@/components/LineArt";
import { BananaSpot } from "@/components/eggs/BananaSpot";
import { EASE } from "@/components/Reveal";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Layered parallax — the collage comes apart slightly as you leave.
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const plateY = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = site.tagline.split(" ");

  return (
    <section
      ref={ref}
      className="relative mx-auto min-h-[100svh] max-w-[1400px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32"
    >
      <div className="grid grid-cols-12 items-start gap-x-4 gap-y-10">
        {/* Portrait — the cover shot */}
        <motion.div
          style={{ y: portraitY }}
          initial={{ opacity: 0, y: 40, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: -1.8 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="col-span-7 sm:col-span-5 lg:col-span-3"
        >
          <Frame
            photo={about.portrait}
            priority
            sizes="(max-width: 1024px) 45vw, 24vw"
            className="origin-top-left"
          />
        </motion.div>

        {/* Masthead headline */}
        <motion.div
          style={{ y: titleY, opacity: fade }}
          className="col-span-12 lg:col-span-6 lg:pl-6"
        >
          <div className="rule flex items-center justify-between pt-3">
            <span className="kicker text-fg/60">
              {site.issue} — {site.season}
            </span>
            <StarButton size={16} label="Star the cover" />
          </div>

          <h1 className="display mt-6 text-[clamp(3.6rem,13vw,10rem)]">
            {words.map((word, i) => (
              <span key={word + i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.05, delay: 0.12 * i, ease: EASE }}
                  className={`block ${i === 1 ? "pl-[0.35em] italic" : ""} ${
                    i === words.length - 1 ? "pl-[0.12em]" : ""
                  }`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="mt-8 max-w-sm"
          >
            <p className="column">
              <strong className="font-display text-base not-italic">
                {site.name.toUpperCase()}
              </strong>{" "}
              — {site.role}. Based in {site.location}. This is the issue: what I am
              listening to, eating, wearing out, and coming back from.
            </p>
          </motion.div>
        </motion.div>

        {/* Illustration plate */}
        <motion.div
          style={{ y: plateY }}
          initial={{ opacity: 0, rotate: 6, scale: 0.94 }}
          animate={{ opacity: 1, rotate: 2.2, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
          className="col-span-5 self-end sm:col-span-4 lg:col-span-3"
        >
          <div className="grain relative overflow-hidden rounded-md bg-[#f4efe3] p-4">
            <TrouserPlate className="h-auto w-full" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="kicker text-fg/50">Plate 01</span>
            <StarButton size={14} label="Star the plate" />
          </div>
        </motion.div>
      </div>

      {/* Banana #1 */}
      <BananaSpot className="bottom-[16%] right-[12%]" size={32} rotate={-12} />

      {/* Scattered pins */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="pointer-events-auto absolute left-[30%] top-[14%]">
          <StarButton size={18} label="A star" />
        </div>
        <div className="pointer-events-auto absolute right-[6%] top-[8%]">
          <StarButton size={26} label="A star" />
        </div>
        <div className="pointer-events-auto absolute bottom-[22%] left-[8%]">
          <StarButton size={20} label="A star" />
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="mt-16 flex items-center gap-3 lg:mt-24"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="kicker text-fg/50"
        >
          Scroll
        </motion.span>
        <span className="h-px flex-1 bg-rule" />
        <span className="kicker text-fg/50">Turn the page</span>
      </motion.div>
    </section>
  );
}
