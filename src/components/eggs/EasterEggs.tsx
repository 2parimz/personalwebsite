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

type EggState = {
  /** Konami code — inverts the whole issue to black. */
  noir: boolean;
  toggleNoir: () => void;
  /** Typing the secret word reveals a hidden track in the player. */
  secretUnlocked: boolean;
  /** Bumped by every star on the page; seven of them makes it rain. */
  registerStarClick: () => void;
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
  const [noir, setNoir] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [raining, setRaining] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const starClicks = useRef(0);
  const buffer = useRef<string[]>([]);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback((next: string) => {
    setMessage(next);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(null), 4200);
  }, []);

  const toggleNoir = useCallback(() => setNoir((v) => !v), []);

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
    document.documentElement.dataset.theme = noir ? "noir" : "day";
  }, [noir]);

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
        setNoir((v) => !v);
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
  }, [say, secretUnlocked]);

  useEffect(() => {
    return () => {
      if (messageTimer.current) clearTimeout(messageTimer.current);
    };
  }, []);

  const value = useMemo(
    () => ({ noir, toggleNoir, secretUnlocked, registerStarClick, say }),
    [noir, toggleNoir, secretUnlocked, registerStarClick, say]
  );

  return (
    <EggContext.Provider value={value}>
      {children}
      <StarShower active={raining} />
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
