"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { music, type Track } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { EASE, Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { StarIcon } from "@/components/Star";
import { useEggs } from "@/components/eggs/EasterEggs";

export function Music() {
  const { secretUnlocked } = useEggs();

  const tracks: Track[] = useMemo(
    () => (secretUnlocked ? [...music.nowPlaying, music.secretTrack] : [...music.nowPlaying]),
    [secretUnlocked]
  );

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const current = tracks[index];
  const playable = Boolean(current?.src);

  // The hidden track slides in and takes the needle.
  useEffect(() => {
    if (secretUnlocked) setIndex(music.nowPlaying.length);
  }, [secretUnlocked]);

  // Never autoplays on load — only ever in response to a click.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing && playable) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, playable, index]);

  function choose(next: number) {
    if (next === index) {
      setPlaying((v) => !v);
      return;
    }
    setIndex(next);
    setProgress(0);
    setPlaying(true);
  }

  function onTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress(audio.currentTime / audio.duration);
  }

  function seek(event: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  }

  return (
    <section id="music" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionHeading
          index="02 / Sound"
          title="On repeat"
          italicFrom={1}
          intro="No autoplay. Press play when you want it."
        />

        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          {/* Player */}
          <Reveal className="col-span-12 lg:col-span-5">
            <div className="grain relative overflow-hidden border border-rule bg-paper p-6 sm:p-8">
              <span className="kicker text-fg/45">Now playing</span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="mt-3"
                >
                  <p className="font-display text-3xl leading-tight sm:text-4xl">
                    {current?.title}
                  </p>
                  <p className="mt-1 text-sm text-fg/60">{current?.artist}</p>
                </motion.div>
              </AnimatePresence>

              {/* Progress */}
              <div
                onClick={seek}
                role="presentation"
                className="mt-6 h-[3px] w-full cursor-pointer bg-rule"
              >
                <div
                  className="h-full bg-accent transition-[width] duration-150"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <button
                  type="button"
                  disabled={!playable}
                  onClick={() => setPlaying((v) => !v)}
                  aria-label={playing ? "Pause" : "Play"}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-fg text-fg transition-colors hover:bg-fg hover:text-bg disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-fg"
                >
                  {playing ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <rect x="2" y="1" width="4" height="14" />
                      <rect x="10" y="1" width="4" height="14" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M3 1 L15 8 L3 15 Z" />
                    </svg>
                  )}
                </button>

                <div className="text-xs leading-relaxed text-fg/50">
                  {playable ? (
                    <span>Track {index + 1} of {tracks.length}</span>
                  ) : (
                    <span>
                      No audio file yet — add an mp3 to <code>/public/audio</code> and set{" "}
                      <code>src</code> in <code>site.ts</code>.
                    </span>
                  )}
                </div>
              </div>

              <audio
                ref={audioRef}
                src={current?.src ?? undefined}
                onTimeUpdate={onTimeUpdate}
                onEnded={() => {
                  setPlaying(false);
                  setProgress(0);
                }}
                preload="none"
              />
            </div>

            {music.spotifyEmbedUrl && (
              <div className="mt-6 overflow-hidden border border-rule">
                <iframe
                  src={music.spotifyEmbedUrl}
                  width="100%"
                  height="352"
                  style={{ border: 0 }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Playlist"
                />
              </div>
            )}
          </Reveal>

          {/* Track list */}
          <Reveal className="col-span-12 lg:col-span-6 lg:col-start-7" delay={0.1}>
            <ol className="rule pt-4">
              {tracks.map((track, i) => {
                const isSecret = secretUnlocked && i === tracks.length - 1;
                const active = i === index;
                return (
                  <motion.li
                    key={track.title + i}
                    initial={isSecret ? { opacity: 0, height: 0 } : false}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="overflow-hidden border-b border-rule"
                  >
                    <button
                      type="button"
                      onClick={() => choose(i)}
                      className="group flex w-full items-center gap-4 py-4 text-left"
                    >
                      <span className="kicker w-8 shrink-0 text-fg/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate font-display text-xl transition-colors sm:text-2xl ${
                            active ? "text-accent" : "group-hover:text-accent"
                          }`}
                        >
                          {track.title}
                        </span>
                        <span className="block truncate text-xs text-fg/50">{track.artist}</span>
                      </span>
                      {isSecret && (
                        <span className="kicker shrink-0 text-accent">Hidden</span>
                      )}
                      <span
                        className={`shrink-0 transition-opacity ${
                          active ? "text-accent opacity-100" : "opacity-0 group-hover:opacity-60"
                        }`}
                      >
                        <StarIcon size={16} filled={active} />
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </div>

      {/* Artist ticker */}
      <Reveal className="mt-20">
        <div className="border-y border-rule py-6">
          <Marquee items={music.onRepeat} duration={46} />
        </div>
      </Reveal>
    </section>
  );
}
