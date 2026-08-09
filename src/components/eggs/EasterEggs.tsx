"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { eggs } from "@/content/site";
import { StarIcon } from "@/components/StarIcon";
import { BananaIcon } from "@/components/art/Banana";
import { Confetti, DiscoLights } from "@/components/eggs/Party";

export type Theme = "day" | "noir" | "party";

type EggState = {
  theme: Theme;
  /** Konami code — inverts the whole issue to black. */
  toggleNoir: () => void;
  /** The switch in the corner. */
  toggleParty: () => void;
  /** Typing the secret word puts a fourth cassette in the tray. */
  secretUnlocked: boolean;
  /** Bumped by every star on the page; seven of them makes it rain. */
  registerStarClick: () => void;
  /** Fired by the hidden bananas. */
  slip: () => void;
  say: (message: string) => void;
};

const EggContext = createContext<EggState | null>(null);

export function useEggs() {
  const ctx = useContext(EggContext);
  if (!ctx) throw new Error("useEggs must be used inside <EasterEggs>");
  return ctx;
}

const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const STAR_GOAL = 7;

export function EasterEggs({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("day");
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [raining, setRaining] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [slipped, setSlipped] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const starClicks = useRef(0);
  const buffer = useRef<string[]>([]);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback((next: string) => {
    setMessage(next);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(null), 4200);
  }, []);

  const toggleNoir = useCallback(() => {
    setTheme((current) => (current === "noir" ? "day" : "noir"));
  }, []);

  const toggleParty = useCallback(() => {
    setTheme((current) => {
      const next = current === "party" ? "day" : "party";
      if (next === "party") {
        setConfettiKey((k) => k + 1);
        say(eggs.party.on);
      } else {
        say(eggs.party.off);
      }
      return next;
    });
  }, [say]);

  const slip = useCallback(() => setSlipped(true), []);

  const registerStarClick = useCallback(() => {
    starClicks.current += 1;
    if (starClicks.current === STAR_GOAL) {
      setRaining(true);
      say(eggs.starShower);
      setTimeout(() => setRaining(false), 4000);
      starClicks.current = 0;
    }
  }, [say]);

  // Paint the theme onto <html> so CSS variables cascade to everything.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // One listener watches for both the Konami code and the secret word.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      buffer.current = [...buffer.current, key].slice(-24);
      const recent = buffer.current;

      const konamiTail = recent.slice(-KONAMI.length);
      if (konamiTail.length === KONAMI.length && konamiTail.every((k, i) => k === KONAMI[i])) {
        toggleNoir();
        say(eggs.konami);
        buffer.current = [];
        return;
      }

      const word = eggs.secretWord.toLowerCase();
      if (!secretUnlocked && recent.join("").endsWith(word)) {
        setSecretUnlocked(true);
        say(eggs.secretTrackFound);
        buffer.current = [];
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [say, secretUnlocked, toggleNoir]);

  useEffect(() => {
    return () => {
      if (messageTimer.current) clearTimeout(messageTimer.current);
    };
  }, []);

  const value = useMemo(
    () => ({ theme, toggleNoir, toggleParty, secretUnlocked, registerStarClick, slip, say }),
    [theme, toggleNoir, toggleParty, secretUnlocked, registerStarClick, slip, say]
  );

  return (
    <EggContext.Provider value={value}>
      <DiscoLights active={theme === "party"} />
      <div className="relative z-10">{children}</div>
      <Confetti fireKey={confettiKey} />
      <StarShower active={raining} />
      <SlipModal open={slipped} onClose={() => setSlipped(false)} />
      <Toast message={message} />
    </EggContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */

function StarShower({ active }: { active: boolean }) {
  // Positions are generated once so the stars don't reshuffle mid-fall.
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.4 + Math.random() * 1.6,
        size: 12 + Math.random() * 22,
        drift: (Math.random() - 0.5) * 160,
        spin: (Math.random() - 0.5) * 540,
      })),
    []
  );

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute top-0 text-accent"
              style={{ left: `${star.left}%` }}
              initial={{ y: -60, opacity: 0, rotate: 0 }}
              animate={{ y: "105vh", x: star.drift, opacity: [0, 1, 1, 0], rotate: star.spin }}
              exit={{ opacity: 0 }}
              transition={{ duration: star.duration, delay: star.delay, ease: "easeIn" }}
            >
              <StarIcon size={star.size} />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

function SlipModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={eggs.banana.title}
          className="fixed inset-0 z-[96] flex items-center justify-center p-5"
        >
          <div className="absolute inset-0 bg-fg/70 backdrop-blur-sm" />

          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ scale: 0.8, rotate: -8, y: 30 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative w-full max-w-sm border border-fg bg-paper p-8 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -14, 12, -6, 0] }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="mx-auto w-fit"
            >
              <BananaIcon size={72} />
            </motion.div>

            <h3 className="display mt-5 text-5xl">{eggs.banana.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg/75">{eggs.banana.body}</p>

            <button
              type="button"
              onClick={onClose}
              className="kicker mt-7 border border-fg px-5 py-3 transition-colors hover:bg-fg hover:text-bg"
            >
              {eggs.banana.button}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Toast({ message }: { message: string | null }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[95] flex justify-center px-4"
    >
      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="kicker max-w-md border border-fg bg-fg px-4 py-3 text-center text-bg"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
