"use client";

import { motion } from "framer-motion";
import { reel } from "@/content/site";

/**
 * A video slot dressed as a camcorder: chunky body and lens on the right,
 * flip-out LCD on the left holding whatever you drop in `reel.video`.
 */
export function Camcorder() {
  const { src, youtubeId, poster, caption } = reel.video;
  const hasVideo = Boolean(src || youtubeId);

  return (
    <div className="relative">
      <div className="flex items-stretch">
        {/* Flip-out screen */}
        <motion.div
          initial={{ rotate: -3, opacity: 0, x: -20 }}
          whileInView={{ rotate: -1.6, opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl origin-right"
        >
          {/* hinge */}
          <span
            aria-hidden="true"
            className="absolute -right-2 top-1/2 h-16 w-3 -translate-y-1/2 rounded-sm bg-[#2a2724]"
          />

          <div className="grain relative rounded-lg bg-[#232020] p-3 shadow-2xl sm:p-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black">
              {src ? (
                <video
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="none"
                  poster={poster ?? undefined}
                >
                  <source src={src} />
                  Your browser cannot play this video.
                </video>
              ) : youtubeId ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                  title={caption}
                  style={{ border: 0 }}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <StandbyScreen />
              )}

              {/* viewfinder furniture */}
              <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-3">
                <span className="flex items-center gap-1.5">
                  <motion.span
                    animate={{ opacity: [1, 0.15, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="block h-2 w-2 rounded-full bg-[#ff3b30]"
                  />
                  <span className="kicker text-[0.5rem] text-white/80">REC</span>
                </span>
                <span className="kicker text-[0.5rem] text-white/70">{reel.dates}</span>
              </div>
              <div className="pointer-events-none absolute bottom-3 left-3">
                <span className="kicker text-[0.5rem] text-white/70">
                  {hasVideo ? "PLAY" : "STANDBY"}
                </span>
              </div>
            </div>
          </div>

          <p className="kicker mt-3 text-fg/50">{caption}</p>
        </motion.div>

        {/* Body + lens */}
        <div aria-hidden="true" className="relative -ml-6 hidden w-44 shrink-0 sm:block">
          <div className="grain absolute inset-y-6 left-0 right-0 rounded-2xl bg-gradient-to-br from-[#332f2b] to-[#191614] shadow-xl">
            <span className="absolute right-5 top-1/2 block h-24 w-24 -translate-y-1/2 rounded-full bg-[#0d0b0a] ring-4 ring-[#3a3531]">
              <span className="absolute inset-3 rounded-full bg-[#161312] ring-2 ring-[#4a443f]" />
              <span className="absolute inset-7 rounded-full bg-gradient-to-tr from-[#2b3a4a] to-[#0a0a0a]" />
              <span className="absolute left-8 top-7 block h-3 w-3 rounded-full bg-white/25 blur-[1px]" />
            </span>
            <span className="absolute left-4 top-6 block h-1.5 w-10 rounded-full bg-[#4a443f]" />
            <span className="absolute left-4 top-9 block h-1.5 w-7 rounded-full bg-[#4a443f]" />
            <span className="absolute bottom-6 left-4 block h-2 w-2 rounded-full bg-[#f5cf3d]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StandbyScreen() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0e1410] text-center">
      {/* faint scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px)",
        }}
      />
      <p className="kicker text-[#7de08a]">No tape in the deck</p>
      <p className="max-w-xs px-6 text-[0.7rem] leading-relaxed text-[#7de08a]/60">
        Drop an .mp4 into <code>/public/video</code> and set <code>reel.video.src</code>,
        or paste a YouTube ID into <code>reel.video.youtubeId</code>.
      </p>
    </div>
  );
}
