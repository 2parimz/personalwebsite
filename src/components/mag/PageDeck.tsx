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
import { DeckContext } from "@/components/mag/deck";
import { peelFrom, restingCorner, type Peel, type Pt } from "@/components/mag/peel";
import { Nav } from "@/components/Nav";
import { ReadingProgress } from "@/components/ReadingProgress";

/**
 * The spreads are stacked rather than laid end to end, so the top one can
 * peel away and show the next underneath. Every page stays mounted, which
 * keeps things like the loaded cassette and the film strip position intact
 * as you move through the issue.
 *
 * Turns come from: dragging the bottom-right corner, the wheel, the arrow
 * keys, or a horizontal swipe. Past 40% of the page the turn completes on
 * release; below that it springs back.
 */

const COMPLETE_AT = 0.4;
const HOTSPOT = 170;
const HINT_DEPTH = 54;

export function PageDeck({ children }: { children: ReactNode }) {
  const pages = Children.toArray(children);
  const total = pages.length;

  const shell = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [index, setIndex] = useState(0);
  const [corner, setCorner] = useState<Pt | null>(null);
  const [turning, setTurning] = useState(false);

  const dragging = useRef(false);
  /**
   * Two separate handles on purpose. They used to share one, which meant a
   * finished tween left a stale id behind and the drag throttle's
   * `if (moveRaf.current) return` then swallowed every later pointermove.
   */
  const tweenRaf = useRef(0);
  const moveRaf = useRef(0);
  const pending = useRef<Pt | null>(null);

  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const peel: Peel | null = useMemo(
    () => (corner && size.w ? peelFrom(size.w, size.h, corner) : null),
    [corner, size.w, size.h]
  );

  /** Tween the corner between two points; used by every non-drag trigger. */
  const tween = useCallback((from: Pt, to: Pt, ms: number, done?: () => void) => {
    const start = performance.now();
    cancelAnimationFrame(tweenRaf.current);
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      setCorner({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
      if (t < 1) {
        tweenRaf.current = requestAnimationFrame(step);
      } else {
        tweenRaf.current = 0;
        done?.();
      }
    };
    tweenRaf.current = requestAnimationFrame(step);
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (turning || !size.w) return;
      const next = index + delta;
      if (next < 0 || next >= total) return;
      const P: Pt = { x: size.w, y: size.h };
      const away = restingCorner(size.w, size.h);
      setTurning(true);

      if (delta > 0) {
        tween(corner ?? P, away, 620, () => {
          setIndex(next);
          setCorner(null);
          setTurning(false);
        });
      } else {
        // Going back: show the previous spread already open, then close it.
        setIndex(next);
        setCorner(away);
        requestAnimationFrame(() =>
          tween(away, P, 620, () => {
            setCorner(null);
            setTurning(false);
          })
        );
      }
    },
    [index, total, turning, size, corner, tween]
  );

  /* -------------------------------- drag -------------------------------- */

  const onPointerDown = (event: React.PointerEvent) => {
    if (turning || !size.w) return;
    const r = shell.current!.getBoundingClientRect();
    const x = event.clientX - r.left;
    const y = event.clientY - r.top;
    if (size.w - x > HOTSPOT || size.h - y > HOTSPOT) return;
    if (index >= total - 1) return;
    dragging.current = true;
    (event.target as Element).setPointerCapture?.(event.pointerId);
    setCorner({ x, y });
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    const r = shell.current!.getBoundingClientRect();
    pending.current = { x: event.clientX - r.left, y: event.clientY - r.top };
    if (moveRaf.current) return;
    moveRaf.current = requestAnimationFrame(() => {
      moveRaf.current = 0;
      if (pending.current) setCorner(pending.current);
    });
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    cancelAnimationFrame(moveRaf.current);
    moveRaf.current = 0;
    const p = peel?.progress ?? 0;
    if (p > COMPLETE_AT) go(1);
    else if (corner) {
      setTurning(true);
      tween(corner, { x: size.w, y: size.h }, 380, () => {
        setCorner(null);
        setTurning(false);
      });
    }
  };

  /* ------------------------ hover hint on the corner ---------------------- */

  const hint = (on: boolean) => {
    if (dragging.current || turning || !size.w || index >= total - 1) return;
    if (on) setCorner({ x: size.w - HINT_DEPTH, y: size.h - HINT_DEPTH });
    else setCorner(null);
  };

  /* ------------------------- wheel / keys / swipe ------------------------- */

  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    let acc = 0;
    let lock = false;

    function onWheel(event: WheelEvent) {
      if ((event.target as HTMLElement)?.closest?.("[data-peel-ignore]")) return;
      event.preventDefault();
      acc += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (lock || Math.abs(acc) < 90) return;
      lock = true;
      go(acc > 0 ? 1 : -1);
      acc = 0;
      window.setTimeout(() => {
        lock = false;
      }, 700);
    }

    function onKey(event: KeyboardEvent) {
      const t = event.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    }

    let sx = 0;
    let sy = 0;
    function onTouchStart(e: TouchEvent) {
      sx = e.touches[0]?.clientX ?? 0;
      sy = e.touches[0]?.clientY ?? 0;
    }
    function onTouchEnd(e: TouchEvent) {
      if (dragging.current) return;
      const dx = (e.changedTouches[0]?.clientX ?? 0) - sx;
      const dy = (e.changedTouches[0]?.clientY ?? 0) - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [go]);

  useEffect(
    () => () => {
      cancelAnimationFrame(tweenRaf.current);
      cancelAnimationFrame(moveRaf.current);
    },
    []
  );

  /* -------------------------------- render -------------------------------- */

  const deck = useMemo(() => ({ index, total, go, turning }), [index, total, go, turning]);
  const shading = peel ? Math.min(1, peel.progress * 2.4 + 0.25) : 0;

  return (
    <DeckContext.Provider value={deck}>
      <ReadingProgress />
      <Nav />

      <div
        ref={shell}
        className="relative h-[100svh] w-full touch-pan-y overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {pages.map((child, i) => {
          const isCurrent = i === index;
          const isNext = i === index + 1;
          return (
            <div
              key={i}
              aria-hidden={!isCurrent}
              className="absolute inset-0"
              style={{
                zIndex: isCurrent ? 20 : isNext ? 10 : 0,
                visibility: isCurrent || isNext ? "visible" : "hidden",
                pointerEvents: isCurrent ? "auto" : "none",
                // Only clip while a peel is actually happening.
                clipPath: isCurrent && peel ? "url(#peel-keep)" : undefined,
              }}
            >
              {child}
            </div>
          );
        })}

        {/* the lifted corner */}
        {peel && size.w > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 z-30"
            width="100%"
            height="100%"
            viewBox={`0 0 ${size.w} ${size.h}`}
          >
            <defs>
              <clipPath id="peel-keep" clipPathUnits="userSpaceOnUse">
                <path d={peel.keepPath} />
              </clipPath>
              <linearGradient
                id="peel-paper"
                gradientUnits="userSpaceOnUse"
                x1={peel.mid.x}
                y1={peel.mid.y}
                x2={peel.mid.x - peel.normal.x * 260}
                y2={peel.mid.y - peel.normal.y * 260}
              >
                <stop offset="0" stopColor="#c9c1b0" />
                <stop offset="0.14" stopColor="#e6dfd1" />
                <stop offset="0.55" stopColor="var(--paper)" />
                <stop offset="1" stopColor="#f7f3ea" />
              </linearGradient>
              <filter id="peel-lift" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="-8" dy="-6" stdDeviation="12" floodColor="#14110f" floodOpacity="0.34" />
              </filter>
              <filter id="peel-soft" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="11" />
              </filter>
            </defs>

            {/* shadow the flap casts onto the page below */}
            <path
              d={peel.creasePath}
              fill="none"
              stroke="#14110f"
              strokeWidth={26}
              strokeLinecap="round"
              opacity={0.3 * shading}
              filter="url(#peel-soft)"
            />

            {/* the back of the paper */}
            <path d={peel.flapPath} fill="url(#peel-paper)" filter="url(#peel-lift)" />

            {/* a sheen just past the crease, where the curl catches light */}
            <path
              d={peel.creasePath}
              fill="none"
              stroke="#ffffff"
              strokeWidth={9}
              strokeLinecap="round"
              opacity={0.35 * shading}
              filter="url(#peel-soft)"
            />
          </svg>
        )}

        {/* corner hotspot — invisible, but it is what you grab */}
        {index < total - 1 && (
          <div
            onPointerEnter={() => hint(true)}
            onPointerLeave={() => hint(false)}
            style={{ width: HOTSPOT, height: HOTSPOT }}
            className="absolute bottom-0 right-0 z-40 cursor-grab active:cursor-grabbing"
            aria-hidden="true"
          />
        )}
      </div>
    </DeckContext.Provider>
  );
}
