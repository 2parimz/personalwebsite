"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  about,
  eggs,
  feature,
  music,
  obsessions,
  reel,
  restaurants,
  site,
} from "@/content/site";
import { Page } from "@/components/mag/Page";
import { DuotoneFrame } from "@/components/mag/DuotoneFrame";
import { Frame } from "@/components/Frame";
import { Squiggle, TrouserPlate } from "@/components/LineArt";
import { StarButton, StarIcon } from "@/components/Star";
import { Marquee } from "@/components/Marquee";
import { Boombox } from "@/components/Boombox";
import { DraggableCassette } from "@/components/Cassette";
import { ObsessionBoard } from "@/components/ObsessionBoard";
import { FilmStrip } from "@/components/FilmStrip";
import { Camcorder } from "@/components/Camcorder";
import { BananaSpot } from "@/components/eggs/BananaSpot";
import { useEggs } from "@/components/eggs/EasterEggs";

/* Shared bits ------------------------------------------------------------- */

function Head({ index, title, italicFrom }: { index: string; title: string; italicFrom?: number }) {
  const words = title.split(" ");
  return (
    <header className="shrink-0">
      <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-3">
        <span className="kicker text-fg/50">{index}</span>
        <StarButton size={13} label={`Star ${title}`} />
      </div>
      <h2 className="display mt-3 text-[clamp(2rem,4.6vw,3.9rem)]">
        {words.map((w, i) => (
          <span key={w + i} className={italicFrom !== undefined && i >= italicFrom ? "italic" : ""}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </h2>
      <Squiggle className="mt-2 h-3 w-28 text-accent" />
    </header>
  );
}

/* 01 — Cover --------------------------------------------------------------- */

export function CoverPage() {
  const words = site.tagline.split(" ");
  return (
    <Page folio="Cover" runningHead={site.season} stripe="right">
      <BananaSpot className="bottom-[18%] right-[8%]" size={26} rotate={-12} />

      <div className="grid min-h-0 flex-1 grid-cols-12 items-center gap-6">
        <div className="col-span-5 hidden h-full max-h-[62vh] items-center lg:flex">
          <Frame photo={about.portrait} priority showCaption={false} sizes="34vw" className="w-full -rotate-2" />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <p className="kicker text-fg/55">
            {site.issue} — {site.season}
          </p>
          <h1 className="display mt-4 text-[clamp(3rem,8.4vw,7.5rem)]">
            {words.map((w, i) => (
              <span key={w + i} className="block overflow-hidden pb-[0.3em] [margin-bottom:-0.3em]">
                <motion.span
                  initial={{ y: "150%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                  className={`block ${i === 1 ? "pl-[0.3em] italic" : ""}`}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <p className="column mt-6 max-w-md">
            <strong className="font-display text-base not-italic">{site.name.toUpperCase()}</strong>{" "}
            — {site.role}. Based in {site.location}. Scroll to turn the page.
          </p>
          <div className="mt-6 w-40 opacity-90">
            <TrouserPlate className="h-auto w-full" />
          </div>
        </div>
      </div>
    </Page>
  );
}

/* 02 — About --------------------------------------------------------------- */

export function AboutPage() {
  return (
    <Page id="about" folio="02" runningHead="About" stripe="left">
      <Head index="01 / About" title="The way she wears it" italicFrom={2} />

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-12 gap-8 overflow-hidden">
        <div className="col-span-12 hidden max-h-[52vh] md:col-span-4 md:block">
          <Frame photo={about.portrait} sizes="30vw" className="h-full [&>div]:h-full" />
        </div>

        <div className="col-span-12 min-h-0 md:col-span-8">
          <p className="font-display text-[clamp(1.1rem,2vw,1.7rem)] italic leading-snug">
            {about.standfirst}
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {about.columns.map((p, i) => (
              <p key={i} className={`column text-[0.78rem] ${i === 0 ? "column--dropcap" : ""}`}>
                {p}
              </p>
            ))}
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-rule pt-4 sm:grid-cols-4">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt className="kicker text-[0.55rem] text-fg/45">{f.label}</dt>
                <dd className="mt-1 text-xs">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Page>
  );
}

/* 03 — Sound --------------------------------------------------------------- */

export function SoundPage() {
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

  const loaded = tapes.find((t) => t.id === loadedId) ?? null;
  const tray = tapes.filter((t) => t.id !== loadedId);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing && loaded?.track.src) void audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing, loaded]);

  function load(id: string) {
    setLoadedId(id);
    setPlaying(false);
    const tape = tapes.find((t) => t.id === id);
    if (tape) say(`${tape.label} loaded. Hit play.`);
  }

  function togglePlay() {
    if (!loaded) return say("The deck is empty — drag a tape in first.");
    if (!loaded.track.src) return say("That tape has no audio file on it yet.");
    setPlaying((v) => !v);
  }

  return (
    <Page id="sound" folio="03" runningHead="Sound" stripe="bottom">
      <Head index="02 / Sound" title="On repeat" italicFrom={1} />

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-12 gap-8 overflow-hidden">
        <div className="col-span-12 flex min-h-0 flex-col lg:col-span-5">
          <div className="min-h-0 flex-1">
            <Boombox
              loaded={loaded}
              playing={playing}
              onTogglePlay={togglePlay}
              onEject={() => {
                setPlaying(false);
                setLoadedId(null);
              }}
              deckRef={deckRef}
              dropHint={dragging}
            />
          </div>
          <audio ref={audioRef} src={loaded?.track.src ?? undefined} onEnded={() => setPlaying(false)} preload="none" />
        </div>

        <div className="col-span-12 flex min-h-0 flex-col lg:col-span-7">
          <p className="column max-w-lg text-[0.8rem]">{music.note}</p>

          <p className="kicker mt-5 text-fg/45">
            {loaded ? "Now playing" : `The tray — ${tray.length} tapes`}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={loaded?.id ?? "none"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="font-display text-2xl leading-tight"
            >
              {loaded ? loaded.track.title : "Nothing in the deck"}
            </motion.p>
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap gap-3 overflow-hidden rounded-sm border border-dashed border-rule p-3">
            {tray.map((c, i) => (
              <DraggableCassette
                key={c.id}
                cassette={c}
                index={i}
                deckRef={deckRef}
                onLoad={load}
                setDragging={setDragging}
              />
            ))}
          </div>

          <div className="mt-auto border-y border-rule py-3">
            <Marquee items={music.onRepeat} duration={44} />
          </div>
        </div>
      </div>
    </Page>
  );
}

/* 04 — Obsessions ---------------------------------------------------------- */

export function ObsessionsPage() {
  return (
    <Page id="obsessions" folio="04" runningHead="The list" stripe="right">
      <BananaSpot className="right-[6%] top-[14%]" size={24} rotate={26} />
      <Head index="03 / The list" title="Summer obsessions" italicFrom={1} />
      <p className="kicker mt-3 shrink-0 text-fg/45">{obsessions.intro}</p>
      <div className="mt-6 min-h-0 flex-1 overflow-hidden">
        <ObsessionBoard items={obsessions.items} />
      </div>
    </Page>
  );
}

/* 05 — Feature ------------------------------------------------------------- */

export function FeaturePage() {
  return (
    <Page id="feature" folio="06" runningHead={feature.kicker} stripe="none" className="bg-[#fff6f9]">
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-12 flex min-h-0 flex-col md:col-span-7">
          <p className="kicker text-[#c8175f]">{feature.kicker}</p>
          <h2 className="display mt-2 text-[clamp(2rem,5vw,4.2rem)] text-[#14110f]">
            {feature.title}
          </h2>
          <DuotoneFrame src={feature.image} alt={feature.caption} className="mt-4 min-h-0 flex-1" />
          <p className="kicker mt-2 text-[#c8175f]">{feature.caption}</p>
        </div>

        <div className="col-span-12 grid min-h-0 grid-cols-2 gap-5 overflow-hidden md:col-span-5">
          {feature.columns.map((c, i) => (
            <p
              key={i}
              className="font-mono text-[0.66rem] leading-[1.5] text-[#c8175f]"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              {c}
            </p>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* 06 — Table --------------------------------------------------------------- */

export function TablePage() {
  return (
    <Page id="table" folio="08" runningHead="The table" stripe="left">
      <BananaSpot className="bottom-[10%] left-[4%]" size={24} rotate={38} />
      <Head index="04 / The table" title="Where I eat" italicFrom={1} />
      <p className="kicker mt-3 shrink-0 text-fg/45">{restaurants.intro}</p>

      <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-hidden lg:grid-cols-3">
        {restaurants.items.map((place, i) => (
          <motion.article
            key={place.name + i}
            whileHover={{ y: -4, rotate: i % 2 === 0 ? -0.7 : 0.7 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="grain relative flex min-h-0 flex-col border border-rule bg-paper p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-base leading-tight">{place.name}</h3>
              <span className="kicker shrink-0 text-[0.5rem] text-fg/45">{place.city}</span>
            </div>
            <div className="mt-1.5 flex gap-0.5 text-accent">
              {Array.from({ length: 5 }, (_, s) => (
                <StarIcon key={s} size={10} filled={s < place.stars} />
              ))}
            </div>
            <p className="mt-2 flex-1 text-[0.7rem] leading-snug text-fg/70">{place.note}</p>
            <p className="kicker mt-2 border-t border-rule pt-1.5 text-[0.5rem] text-fg/50">
              {place.order}
            </p>
          </motion.article>
        ))}
      </div>
    </Page>
  );
}

/* 07 — Reel ---------------------------------------------------------------- */

export function ReelPage() {
  return (
    <Page id="reel" folio="10" runningHead="Elsewhere" stripe="bottom">
      <Head index="05 / Elsewhere" title={`Recently, ${reel.place}`} italicFrom={1} />

      <div className="mt-5 grid min-h-0 flex-1 grid-cols-12 items-center gap-6 overflow-hidden">
        <div className="col-span-12 min-h-0 lg:col-span-6">
          <Camcorder />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <p className="kicker text-fg/45">
            {reel.dates} · {reel.photos.length} frames
          </p>
          <p className="mt-2 font-display text-xl italic leading-tight">{reel.blurb}</p>
          <div className="mt-4" data-lenis-prevent>
            <FilmStrip photos={reel.photos} />
          </div>
        </div>
      </div>
    </Page>
  );
}

/* 08 — Colophon ------------------------------------------------------------ */

export function ColophonPage() {
  return (
    <Page folio="Back" runningHead="Colophon" stripe="right">
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <p className="display text-[clamp(3rem,10vw,8rem)]">{site.name}</p>
        <p className="kicker mt-4 text-fg/50">
          {site.issue} · {site.season} · Printed on the internet
        </p>
        <Squiggle className="mt-6 h-4 w-64 text-accent" />

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="kicker link-underline">
              {s.label} ↗
            </a>
          ))}
        </div>

        <p className="mt-10 max-w-sm font-display text-lg italic leading-snug text-fg/60">
          {eggs.endOfIssue}
        </p>
      </div>
    </Page>
  );
}
