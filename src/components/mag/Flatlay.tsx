"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CoverObject } from "@/content/site";
import { useEggs } from "@/components/eggs/EasterEggs";

/**
 * The cover's styled flatlay: objects sitting on the page, each one draggable,
 * layerable and resizable.
 *
 * Positions are kept as percentages of the spread rather than pixels, so the
 * arrangement holds its proportions at any window size and there is no
 * seeding pass on mount.
 *
 * During a gesture the node's style is written directly and React is left
 * alone — no state, no re-render, no reconciliation per frame. The final
 * value is committed once on pointerup, and because it matches what was
 * already written there is no jump.
 *
 *   drag                 move
 *   shift-drag / corner  resize (width drives; height follows the image)
 *   click                bring to front
 *   L                    copy the current arrangement to the clipboard
 */

type Placed = CoverObject & { z: number };

type Gesture = {
  id: string;
  mode: "move" | "resize";
  pointerX: number;
  pointerY: number;
  startX: number;
  startY: number;
  startW: number;
};

export function Flatlay({ objects }: { objects: CoverObject[] }) {
  const surface = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef(0);
  const latest = useRef<{ x: number; y: number; w: number } | null>(null);

  const { say } = useEggs();
  const [items, setItems] = useState<Placed[]>(() =>
    objects.map((o, i) => ({ ...o, z: i + 1 }))
  );

  const bringToFront = useCallback((id: string) => {
    setItems((prev) => {
      const top = Math.max(...prev.map((p) => p.z));
      if (prev.find((p) => p.id === id)?.z === top) return prev;
      return prev.map((p) => (p.id === id ? { ...p, z: top + 1 } : p));
    });
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>, item: Placed) => {
    // Stops the browser's own image-drag ghost.
    event.preventDefault();
    const target = event.target as HTMLElement;
    // The video and its controls are not a drag surface.
    if (target.closest("[data-no-drag]")) {
      bringToFront(item.id);
      return;
    }
    const handle = target.dataset.handle === "resize";
    const node = nodes.current.get(item.id);
    if (!node) return;

    gesture.current = {
      id: item.id,
      mode: handle || event.shiftKey ? "resize" : "move",
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: item.x,
      startY: item.y,
      startW: item.w,
    };
    latest.current = { x: item.x, y: item.y, w: item.w };
    node.setPointerCapture(event.pointerId);
    node.dataset.dragging = "true";
    bringToFront(item.id);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    const box = surface.current?.getBoundingClientRect();
    if (!g || !box) return;

    const dx = ((event.clientX - g.pointerX) / box.width) * 100;
    const dy = ((event.clientY - g.pointerY) / box.height) * 100;

    latest.current =
      g.mode === "move"
        ? { x: g.startX + dx, y: g.startY + dy, w: g.startW }
        : { x: g.startX, y: g.startY, w: Math.max(3, Math.min(95, g.startW + dx)) };

    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const node = nodes.current.get(g.id);
      const v = latest.current;
      if (!node || !v) return;
      node.style.left = `${v.x}%`;
      node.style.top = `${v.y}%`;
      node.style.width = `${v.w}%`;
    });
  };

  const endGesture = () => {
    const g = gesture.current;
    const v = latest.current;
    gesture.current = null;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (!g || !v) return;
    const node = nodes.current.get(g.id);
    if (node) delete node.dataset.dragging;
    setItems((prev) => prev.map((p) => (p.id === g.id ? { ...p, x: v.x, y: v.y, w: v.w } : p)));
  };

  /** Press L to get the arrangement back as something you can paste. */
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "l") return;
      const t = event.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      const code = items
        .slice()
        .sort((a, b) => a.z - b.z)
        .map(
          (o) =>
            `    { id: "${o.id}", src: ${o.src ? `"${o.src}"` : "null"}, label: "${o.label}", x: ${o.x.toFixed(1)}, y: ${o.y.toFixed(1)}, w: ${o.w.toFixed(1)}${o.rotate ? `, rotate: ${o.rotate}` : ""} },`
        )
        .join("\n");
      navigator.clipboard
        ?.writeText(`objects: [\n${code}\n  ] as CoverObject[],`)
        .then(() => say("Layout copied — paste it over cover.objects in site.ts"))
        .catch(() => say("Couldn't reach the clipboard"));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, say]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div ref={surface} className="pointer-events-none absolute inset-0">
      {items.map((item) => (
        <div
          key={item.id}
          ref={(el) => {
            if (el) nodes.current.set(item.id, el);
            else nodes.current.delete(item.id);
          }}
          onPointerDown={(e) => onPointerDown(e, item)}
          onPointerMove={onPointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.w}%`,
            zIndex: item.z,
            rotate: item.rotate ? `${item.rotate}deg` : undefined,
          }}
          className="group pointer-events-auto absolute cursor-grab touch-none select-none transition-[filter,transform] duration-300 data-[dragging]:cursor-grabbing data-[dragging]:scale-[1.02]"
        >
          {/* a scene behind the glass — the frame draws on top of it */}
          {item.screenLayer === "behind" && item.video && (
            <div className="absolute inset-0 overflow-hidden">
              <Screen item={item} />
            </div>
          )}

          {item.src ? (
            /* width/height are the file's real pixel size, which lets Next
               re-compress and serve a right-sized copy; `h-auto w-full` then
               overrides both so the on-page size stays driven by the drag. */
            <Image
              src={item.src}
              alt={item.label}
              width={item.natural?.[0] ?? 1200}
              height={item.natural?.[1] ?? 1200}
              sizes="(max-width: 768px) 60vw, 45vw"
              draggable={false}
              className="relative z-10 block h-auto w-full [filter:drop-shadow(0_16px_20px_rgba(20,17,15,0.26))] group-data-[dragging]:[filter:drop-shadow(0_30px_34px_rgba(20,17,15,0.34))]"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-sm border border-dashed border-fg/30 bg-paper/70 shadow-[0_16px_20px_rgba(20,17,15,0.14)]">
              <span className="kicker px-2 text-center text-[0.5rem] text-fg/45">
                {item.label}
              </span>
            </div>
          )}

          {/* a screen set into the object — the camcorder's LCD */}
          {item.screen && item.screenLayer !== "behind" && (
            <div
              data-no-drag
              style={{
                left: `${item.screen.x}%`,
                top: `${item.screen.y}%`,
                width: `${item.screen.w}%`,
                height: `${item.screen.h}%`,
              }}
              className="absolute overflow-hidden bg-black"
            >
              <Screen item={item} />
            </div>
          )}

          {/* corner grip — appears on hover, drag it to resize */}
          <span
            data-handle="resize"
            className="absolute -bottom-1 -right-1 h-3.5 w-3.5 cursor-nwse-resize rounded-full border border-fg/40 bg-bg opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>
      ))}
    </div>
  );
}

/** What plays inside an object's screen, or a standby panel until you add a clip. */
function Screen({ item }: { item: Placed }) {
  const v = item.video;

  const behind = item.screenLayer === "behind";

  if (v?.src) {
    return (
      <video
        className="h-full w-full object-cover"
        // Nothing can reach a backdrop's controls — the frame sits on top —
        // so it plays itself. Muted, which browsers require for autoplay.
        controls={!behind}
        autoPlay={behind}
        loop={behind}
        muted={behind}
        playsInline
        preload={behind ? "auto" : "none"}
        poster={v.poster ?? undefined}
      >
        <source src={v.src} />
      </video>
    );
  }

  if (v?.youtubeId) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
        title={item.label}
        style={{ border: 0 }}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // An empty window is just bright glass, not a dead screen.
  if (behind) return null;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-1 bg-[#0d100e] px-2 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px)",
        }}
      />
      <span className="kicker text-[0.45rem] text-[#7de08a]">No tape</span>
      <span className="text-[0.4rem] leading-tight text-[#7de08a]/60">
        add a clip to /public/video
      </span>
    </div>
  );
}
