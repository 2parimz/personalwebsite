"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { music, obsessions } from "@/content/site";
import { SectionHeading } from "@/components/SectionHeading";
import { EASE, Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { Boombox } from "@/components/Boombox";
import { DraggableCassette } from "@/components/Cassette";
import { ObsessionBoard } from "@/components/ObsessionBoard";
import { BananaSpot } from "@/components/eggs/BananaSpot";
import { useEggs } from "@/components/eggs/EasterEggs";

/** Music and the summer list, sharing one room. */
export function Studio() {
  const { secretUnlocked, say } = useEggs();

  const tapes = useMemo(
    () => (secretUnlocked ? [...music.cassettes, music.secretCassette] : music.cassettes),
    [secretUnlocked]
  );

  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);

  const deckRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const loaded = tapes.find((tape) => tape.id === loadedId) ?? null;
  const tray = tapes.filter((tape) => tape.id !== loadedId);

  // Only ever plays off a click — never on load.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing && loaded?.track.src) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, loaded]);

  function load(id: string) {
    setLoadedId(id);
    setPlaying(false);
    const tape = tapes.find((t) => t.id === id);
    if (tape) say(`${tape.label} loaded. Hit play.`);
  }

  function togglePlay() {
    if (!loaded) {
      say("The deck is empty — drag a tape in first.");
      return;
    }
    if (!loaded.track.src) {
      say("That tape has no audio file on it yet.");
      return;
    }
    setPlaying((v) => !v);
  }

  function eject() {
    setPlaying(false);
    setLoadedId(null);
  }

  return (
    <section
      id="studio"
      className="relative mx-auto max-w-[1400px] scroll-mt-20 px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-20"
    >
      {/* Banana #2 */}
      <BananaSpot className="right-[4%] top-[6%]" size={28} rotate={24} />

      <SectionHeading
        index="03 / Studio"
        title="Sound and obsessions"
        italicFrom={2}
        intro="One room. A tape deck on one wall, the running list pinned to the other."
      />

      <div className="grid grid-cols-12 gap-x-8 gap-y-16">
        {/* --- The deck --- */}
        <div className="col-span-12 lg:col-span-5">
          <Reveal>
            <Boombox
              loaded={loaded}
              playing={playing}
              onTogglePlay={togglePlay}
              onEject={eject}
              deckRef={deckRef}
              dropHint={dragging}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8">
              <p className="kicker text-fg/45">
                {loaded ? "Now playing" : `Pick a tape — ${tray.length} in the tray`}
              </p>

              <AnimatePresence mode="wait">
                <motion.p
                  key={loaded?.id ?? "empty"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="mt-2 font-display text-2xl leading-tight sm:text-3xl"
                >
                  {loaded ? loaded.track.title : "Nothing in the deck"}
                </motion.p>
              </AnimatePresence>

              <p className="mt-1 text-sm text-fg/55">
                {loaded ? loaded.track.artist : "Drag one across, or just click it."}
              </p>
            </div>
          </Reveal>

          {/* the tray */}
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-4 rounded-sm border border-dashed border-rule p-4">
              {tray.map((cassette, i) => (
                <DraggableCassette
                  key={cassette.id}
                  cassette={cassette}
                  index={i}
                  deckRef={deckRef}
                  onLoad={load}
                  setDragging={setDragging}
                />
              ))}
              {tray.length === 0 && (
                <p className="kicker py-6 text-fg/40">Tray empty — eject to put it back.</p>
              )}
            </div>
          </Reveal>

          <audio
            ref={audioRef}
            src={loaded?.track.src ?? undefined}
            onEnded={() => setPlaying(false)}
            preload="none"
          />
        </div>

        {/* --- The wall --- */}
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <p className="kicker mb-6 text-fg/45">{obsessions.intro}</p>
          </Reveal>
          <ObsessionBoard items={obsessions.items} />
        </div>
      </div>

      <Reveal className="mt-20">
        <div className="border-y border-rule py-6">
          <Marquee items={music.onRepeat} duration={46} />
        </div>
      </Reveal>
    </section>
  );
}
