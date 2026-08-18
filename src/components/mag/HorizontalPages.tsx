"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { ScrollerContext } from "@/components/mag/scroller";
import { Nav } from "@/components/Nav";
import { ReadingProgress } from "@/components/ReadingProgress";

/**
 * The issue reads left to right. Lenis runs in horizontal mode with
 * `gestureOrientation: "both"`, so an ordinary downward wheel or two-finger
 * swipe walks across the spreads — no sideways gesture required.
 *
 * Anything that keeps its own scrolling (the film strip) carries
 * `data-lenis-prevent`, and Lenis leaves it alone.
 */
export function HorizontalPages({ children }: { children: ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapper.current;
    const inner = content.current;
    if (!el || !inner) return;

    // Reduced motion still reads sideways, just without the easing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const onWheel = (event: WheelEvent) => {
        if ((event.target as HTMLElement)?.closest?.("[data-lenis-prevent]")) return;
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        el.scrollLeft += event.deltaY;
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }

    const lenis = new Lenis({
      wrapper: el,
      content: inner,
      orientation: "horizontal",
      gestureOrientation: "both",
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.15,
      touchMultiplier: 1.6,
    });

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement);
      history.replaceState(null, "", href);
    }

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <ScrollerContext.Provider value={wrapper}>
      <ReadingProgress />
      <Nav />
      <div
        ref={wrapper}
        className="h-[100svh] w-screen overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div ref={content} className="flex h-full w-max [perspective:2200px]">
          {children}
        </div>
      </div>
    </ScrollerContext.Provider>
  );
}
