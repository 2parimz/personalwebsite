"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { about, eggs, feature, music, obsessions, reel, restaurants, site } from "@/content/site";
import { Page } from "@/components/mag/Page";
import { DuotoneFrame } from "@/components/mag/DuotoneFrame";
import { CollageBoard } from "@/components/mag/CollageBoard";
import { Frame } from "@/components/Frame";
import { TrouserPlate } from "@/components/LineArt";
import { StarButton, StarIcon } from "@/components/Star";
import { Boombox } from "@/components/Boombox";
import { DraggableCassette } from "@/components/Cassette";
import { FilmStrip } from "@/components/FilmStrip";
import { Camcorder } from "@/components/Camcorder";
import { BananaSpot } from "@/components/eggs/BananaSpot";
import { useEggs } from "@/components/eggs/EasterEggs";

/**
 * Every spread uses the same two faces and the same rule weights; what
 * changes page to page is the layout, so the issue reads as one magazine
 * rather than a set of themed screens.
 */

function Rule() {
  return <div className="h-px w-full bg-fg/25" />;
}

/** Slug line: the small caps section marker every spread opens with. */
function Slug({ index, children }: { index: string; children: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="kicker text-[0.55rem] text-fg/45">{index}</span>
      <div className="h-px flex-1 bg-fg/25" />
      <span className="kicker text-[0.55rem] text-fg/45">{children}</span>
    </div>
  );
}

/* 01 — Cover --------------------------------------------------------------- */

export function CoverPage() {
  const words = site.tagline.split(" ");
  return (
    <Page folio="Cover" runningHead={site.season}>
      <BananaSpot className="bottom-[14%] right-[7%]" size={24} rotate={-12} />

      <div className="grid min-h-0 flex-1 grid-cols-12 items-center gap-8">
        <div className="col-span-12 lg:col-span-7">
          <p className="kicker text-fg/55">
            {site.issue} — {site.season}
          </p>
          <h1 className="display mt-4 text-[clamp(3rem,8.6vw,7.6rem)]">
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
          <div className="mt-7 max-w-md">
            <Rule />
            <p className="mt-3 text-sm leading-relaxed">
              <strong className="font-display not-italic">{site.name.toUpperCase()}</strong> — {site.role}.
              Based in {site.location}.
            </p>
            <p className="kicker mt-4 text-fg/45">
              Scroll, or pull the bottom corner
            </p>
          </div>
        </div>

        <div className="col-span-5 hidden h-full max-h-[60vh] items-center lg:flex">
          <Frame photo={about.portrait} priority showCaption={false} sizes="36vw" className="w-full -rotate-1" />
        </div>
      </div>

      <div className="absolute bottom-16 right-12 hidden w-32 opacity-90 lg:block">
        <TrouserPlate className="h-auto w-full" />
      </div>
    </Page>
  );
}

/* 02 — About: the classic feature opener ----------------------------------- */

export function AboutPage() {
  return (
    <Page id="about" folio="02" runningHead="About">
      <Slug index="01">Feature</Slug>

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-12 gap-x-10 gap-y-5 overflow-hidden">
        {/* headline block */}
        <div className="col-span-12 lg:col-span-5">
          <h2 className="display text-[clamp(2rem,4.4vw,3.6rem)] uppercase leading-[0.95] tracking-[0.01em]">
            The way
            <br />
            she wears it
          </h2>
          <div className="mt-3 max-w-xs">
            <Rule />
            <p className="kicker mt-2 text-[0.5rem] text-fg/50">
              Pictures — {site.name} · Words — {site.name}
            </p>
          </div>
          <p className="mt-5 max-w-sm text-center font-display text-[clamp(0.95rem,1.5vw,1.25rem)] italic leading-snug">
            {about.standfirst}
          </p>
        </div>

        {/* picture block — your images go here */}
        <div className="col-span-12 grid min-h-0 grid-cols-3 grid-rows-2 gap-2 overflow-hidden lg:col-span-7">
          <Frame photo={about.gallery[0]} showCaption={false} sizes="30vw" className="col-span-2 [&>div]:h-full" keepRatio={false} boxClassName="h-full" />
          <Frame photo={about.gallery[1]} showCaption={false} sizes="20vw" className="row-span-2 [&>div]:h-full" keepRatio={false} boxClassName="h-full" />
          <Frame photo={about.gallery[2]} showCaption={false} sizes="20vw" className="[&>div]:h-full" keepRatio={false} boxClassName="h-full" />
          <Frame photo={about.gallery[3]} showCaption={false} sizes="20vw" className="[&>div]:h-full" keepRatio={false} boxClassName="h-full" />
        </div>

        {/* three justified columns, like a real feature */}
        <div className="col-span-12 grid min-h-0 grid-cols-1 gap-x-8 overflow-hidden sm:grid-cols-3">
          {about.columns.map((p, i) => (
            <p key={i} className={`column text-[0.7rem] leading-[1.5] ${i === 0 ? "column--dropcap" : ""}`}>
              {p}
            </p>
          ))}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 self-start">
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt className="kicker text-[0.45rem] text-fg/40">{f.label}</dt>
                <dd className="text-[0.7rem]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Page>
  );
}

/* 03 — Sound & Reel -------------------------------------------------------- */

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
    <Page id="sound" folio="04" runningHead="Sound & reel">
      <Slug index="02">Sound &amp; reel</Slug>

      <div className="mt-4 grid min-h-0 flex-1 grid-cols-12 gap-x-10 gap-y-4 overflow-hidden">
        <div className="col-span-12 lg:col-span-4">
          <h2 className="display text-[clamp(1.9rem,3.6vw,3rem)] leading-none">
            On <span className="italic">repeat</span>
          </h2>
          <p className="column mt-3 text-[0.7rem] leading-[1.5]">{music.note}</p>

          <AnimatePresence mode="wait">
            <motion.p
              key={loaded?.id ?? "none"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 font-display text-lg leading-tight"
            >
              {loaded ? loaded.track.title : "Nothing in the deck"}
            </motion.p>
          </AnimatePresence>

          <div className="mt-3 flex flex-wrap gap-2 rounded-sm border border-dashed border-rule p-2">
            {tray.map((c, i) => (
              <div key={c.id} className="scale-[0.72] origin-top-left">
                <DraggableCassette cassette={c} index={i} deckRef={deckRef} onLoad={load} setDragging={setDragging} />
              </div>
            ))}
          </div>
          <audio ref={audioRef} src={loaded?.track.src ?? undefined} onEnded={() => setPlaying(false)} preload="none" />
        </div>

        <div className="col-span-6 hidden min-h-0 lg:col-span-4 lg:block">
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

        <div className="col-span-12 min-h-0 lg:col-span-4">
          <Camcorder />
        </div>

        {/* the reel, full width along the foot of the spread */}
        <div className="col-span-12 min-h-0" data-peel-ignore>
          <FilmStrip photos={reel.photos} />
        </div>
      </div>
    </Page>
  );
}

/* 04 — Obsessions: the flat lay --------------------------------------------- */

export function ObsessionsPage() {
  return (
    <Page id="obsessions" folio="06" runningHead="The list">
      <BananaSpot className="right-[5%] top-[12%]" size={22} rotate={26} />
      <Slug index="03">The list</Slug>

      <div className="mt-3 shrink-0">
        <h2 className="display text-[clamp(2rem,4.6vw,3.6rem)]">{obsessions.title}</h2>
        <p className="kicker mt-1 text-[0.5rem] text-fg/45">{obsessions.intro}</p>
      </div>

      <div className="mt-2 min-h-0 flex-1">
        <CollageBoard items={obsessions.items} />
      </div>
    </Page>
  );
}

/* 05 — Feature: the picture spread ----------------------------------------- */

export function FeaturePage() {
  return (
    <Page id="feature" folio="08" runningHead={feature.kicker}>
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-12 flex min-h-0 flex-col md:col-span-8">
          <div className="flex shrink-0 items-baseline gap-3">
            <span className="kicker text-[0.55rem] text-[#c8175f]">{feature.kicker}</span>
            <div className="h-px flex-1 bg-[#c8175f]/35" />
          </div>
          <h2 className="display mt-2 shrink-0 text-[clamp(2rem,5vw,4rem)] text-[#14110f]">{feature.title}</h2>
          <DuotoneFrame src={feature.image} alt={feature.caption} className="mt-3 min-h-0 flex-1" />
          <p className="kicker mt-2 shrink-0 text-[0.5rem] text-[#c8175f]">{feature.caption}</p>
        </div>

        <div className="col-span-12 flex min-h-0 flex-col justify-end gap-4 overflow-hidden md:col-span-4">
          {feature.columns.map((c, i) => (
            <p key={i} className="text-[0.7rem] leading-[1.55] text-[#c8175f]">
              {c}
            </p>
          ))}
        </div>
      </div>
    </Page>
  );
}

/* 06 — Table: the one spread with the olive field ---------------------------- */

export function TablePage() {
  return (
    <Page id="table" folio="10" runningHead="The table" stripe="right">
      <BananaSpot className="bottom-[8%] left-[4%]" size={22} rotate={38} />
      <Slug index="04">The table</Slug>

      <div className="mt-3 shrink-0">
        <h2 className="display text-[clamp(2rem,4.6vw,3.6rem)]">
          Where I <span className="italic">eat</span>
        </h2>
        <p className="kicker mt-1 text-[0.5rem] text-fg/45">{restaurants.intro}</p>
      </div>

      <div className="mt-4 grid min-h-0 flex-1 grid-cols-2 gap-x-8 gap-y-3 overflow-hidden lg:w-[58%] lg:grid-cols-2">
        {restaurants.items.map((place, i) => (
          <article key={place.name + i} className="flex min-h-0 flex-col border-t border-fg/25 pt-2">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-[0.95rem] leading-tight">{place.name}</h3>
              <span className="kicker text-[0.45rem] text-fg/45">{place.city}</span>
            </div>
            <div className="mt-1 flex gap-0.5 text-accent">
              {Array.from({ length: 5 }, (_, s) => (
                <StarIcon key={s} size={9} filled={s < place.stars} />
              ))}
            </div>
            <p className="mt-1 text-[0.65rem] leading-snug text-fg/70">{place.note}</p>
            <p className="kicker mt-1 text-[0.45rem] text-fg/45">{place.order}</p>
          </article>
        ))}
      </div>
    </Page>
  );
}

/* 07 — Colophon ------------------------------------------------------------- */

export function ColophonPage() {
  return (
    <Page folio="Back" runningHead="Colophon">
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <p className="display text-[clamp(3rem,10vw,8rem)]">{site.name}</p>
        <div className="mt-4 max-w-md">
          <Rule />
        </div>
        <p className="kicker mt-3 text-fg/50">
          {site.issue} · {site.season} · Printed on the internet
        </p>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="kicker link-underline">
              {s.label} ↗
            </a>
          ))}
          <StarButton size={14} label="One more star" />
        </div>

        <p className="mt-10 max-w-sm font-display text-base italic leading-snug text-fg/55">
          {eggs.endOfIssue}
        </p>
      </div>
    </Page>
  );
}
