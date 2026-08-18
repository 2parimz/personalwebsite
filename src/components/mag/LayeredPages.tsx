"use client";

import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { DeckContext } from "@/components/mag/deck";
import { Nav } from "@/components/Nav";
import { ReadingProgress } from "@/components/ReadingProgress";

/* -------------------------------------------------------------------------
 * Every knob for the transition lives here.
 * ---------------------------------------------------------------------- */
export const LAYER = {
  /** Travel easing. Physical, no overshoot. */
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** How long one page takes to slide over the last, in ms. */
  duration: 780,
  /** How far the buried page fades and recedes. */
  buriedOpacity: 0.95,
  buriedScale: 0.975,
  /** Paper resting on paper — falls on the page underneath. */
  edgeShadow: "-30px 0 70px rgba(20, 17, 15, 0.2)",
  /** Wheel delta needed to commit to a turn, and the cooldown after one. */
  wheelThreshold: 60,
  wheelLockMs: 620,
};

/** Cubic-bezier solver, so the tween uses the real curve rather than an approximation. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i += 1) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-4) break;
      const s = slopeX(t);
      if (Math.abs(s) < 1e-6) break;
      t -= dx / s;
    }
    return sampleY(Math.min(1, Math.max(0, t)));
  };
}

/**
 * Horizontal stack. Each spread sits in a full-width slot, and inside that
 * slot it is `position: sticky` — so once a page reaches the left edge it
 * stays put while the following page slides across and buries it. The page
 * underneath never moves; the one on top does all the travelling.
 *
 * The stacking itself is CSS (sticky + scroll-snap), which keeps it on the
 * compositor. Only the depth cue and the stagger are scripted, and the depth
 * cue runs on motion values so it never re-renders React per frame.
 */
export function LayeredPages({ children }: { children: ReactNode }) {
  const pages = Children.toArray(children);
  const total = pages.length;

  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  /** Scroll position expressed in pages: 2.4 means 40% into the third turn. */
  const progress = useMotionValue(0);

  const indexRef = useRef(0);
  const scrollRaf = useRef(0);
  const tweenRaf = useRef(0);
  const ease = useMemo(() => bezier(...LAYER.ease), []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  /* Track native scrolling (touch drag) and keep `progress` current. */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      if (scrollRaf.current) return;
      scrollRaf.current = requestAnimationFrame(() => {
        scrollRaf.current = 0;
        const w = el.clientWidth || 1;
        const p = el.scrollLeft / w;
        progress.set(p);
        // Flipping at the halfway point means the arriving page starts its
        // stagger while it is still moving, not after it lands.
        const nearest = Math.round(p);
        if (nearest !== indexRef.current) setIndex(nearest);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf.current);
    };
  }, [progress]);

  const goTo = useCallback(
    (target: number) => {
      const el = scroller.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(total - 1, target));
      const w = el.clientWidth;
      const from = el.scrollLeft;
      const to = clamped * w;
      if (Math.abs(to - from) < 1) return;

      setAnimating(true);
      // The tween owns the motion; CSS snap would fight it mid-flight.
      const previousSnap = el.style.scrollSnapType;
      el.style.scrollSnapType = "none";

      const start = performance.now();
      cancelAnimationFrame(tweenRaf.current);
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / LAYER.duration);
        el.scrollLeft = from + (to - from) * ease(t);
        if (t < 1) {
          tweenRaf.current = requestAnimationFrame(step);
        } else {
          tweenRaf.current = 0;
          el.style.scrollSnapType = previousSnap;
          setIndex(clamped);
          setAnimating(false);
        }
      };
      tweenRaf.current = requestAnimationFrame(step);
    },
    [total, ease]
  );

  const go = useCallback((delta: number) => goTo(indexRef.current + delta), [goTo]);

  /* Wheel, keys, and re-alignment on resize. Native touch drag needs nothing. */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let acc = 0;
    let lock = false;

    function onWheel(event: WheelEvent) {
      if ((event.target as HTMLElement)?.closest?.("[data-layer-ignore]")) return;
      event.preventDefault();
      acc += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (lock || Math.abs(acc) < LAYER.wheelThreshold) return;
      lock = true;
      go(acc > 0 ? 1 : -1);
      acc = 0;
      window.setTimeout(() => {
        lock = false;
      }, LAYER.wheelLockMs);
    }

    function onKey(event: KeyboardEvent) {
      const t = event.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    }

    function onResize() {
      if (!el) return;
      el.scrollLeft = indexRef.current * el.clientWidth;
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [go]);

  useEffect(
    () => () => {
      cancelAnimationFrame(tweenRaf.current);
      cancelAnimationFrame(scrollRaf.current);
    },
    []
  );

  const deck = useMemo(
    () => ({ index, total, go, turning: animating }),
    [index, total, go, animating]
  );

  return (
    <DeckContext.Provider value={deck}>
      <ReadingProgress />
      <Nav />

      <div
        ref={scroller}
        className="h-[100svh] w-full snap-x snap-mandatory touch-pan-x overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* No w-max: the slots are w-full, which resolves against the
            scroller, so each page is exactly one viewport wide. */}
        <div className="flex h-full">
          {pages.map((child, i) => (
            <div key={i} className="h-full w-full shrink-0 snap-start">
              <Layer index={i} current={index} progress={progress}>
                {child}
              </Layer>
            </div>
          ))}
        </div>
      </div>

      <PageDots total={total} index={index} onPick={goTo} />
    </DeckContext.Provider>
  );
}

/** One spread's layer: pinned by sticky, receding as it gets covered. */
function Layer({
  index,
  current,
  progress,
  children,
}: {
  index: number;
  current: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const buried = useTransform(progress, (p) => Math.min(1, Math.max(0, p - index)));
  const scale = useTransform(buried, [0, 1], [1, LAYER.buriedScale]);
  const opacity = useTransform(buried, [0, 1], [1, LAYER.buriedOpacity]);

  // Only the page either side of the current one can be seen; hiding the
  // rest keeps paint work off seven full-screen layers.
  const near = Math.abs(index - current) <= 1;

  return (
    <motion.div
      data-stage={index === current ? "in" : "out"}
      style={{
        zIndex: index,
        scale,
        opacity,
        boxShadow: LAYER.edgeShadow,
        visibility: near ? "visible" : "hidden",
      }}
      className="sticky left-0 h-full w-full"
    >
      {children}
    </motion.div>
  );
}

function PageDots({
  total,
  index,
  onPick,
}: {
  total: number;
  index: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[55] flex -translate-x-1/2 items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(i)}
          aria-label={`Spread ${i + 1}`}
          aria-current={i === index}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i === index ? "w-6 bg-fg/70" : "w-1.5 bg-fg/25 hover:bg-fg/45"
          }`}
        />
      ))}
    </div>
  );
}
