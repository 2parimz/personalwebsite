"use client";

import type { ReactNode } from "react";

/**
 * The paper doily from the moodboard, drawn procedurally: a black card,
 * a scalloped cream lace border, punched holes, and a plain panel in the
 * middle for content. Scales with the container via preserveAspectRatio.
 */
export function Doily({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const W = 400;
  const H = 520;
  const M = 18; // card padding before the lace starts
  const R = 12; // scallop radius
  const STEP = R * 2;

  const laceX0 = M;
  const laceY0 = M;
  const laceX1 = W - M;
  const laceY1 = H - M;

  const scallops: { cx: number; cy: number }[] = [];
  for (let x = laceX0 + R; x <= laceX1 - R; x += STEP) {
    scallops.push({ cx: x, cy: laceY0 }, { cx: x, cy: laceY1 });
  }
  for (let y = laceY0 + R; y <= laceY1 - R; y += STEP) {
    scallops.push({ cx: laceX0, cy: y }, { cx: laceX1, cy: y });
  }

  // Punched holes: two rings inside the lace band.
  const holes: { cx: number; cy: number; r: number }[] = [];
  const bands = [
    { inset: 13, r: 3.2, step: 15 },
    { inset: 27, r: 1.9, step: 11 },
  ];
  for (const band of bands) {
    const x0 = laceX0 + band.inset;
    const y0 = laceY0 + band.inset;
    const x1 = laceX1 - band.inset;
    const y1 = laceY1 - band.inset;
    for (let x = x0; x <= x1; x += band.step) {
      holes.push({ cx: x, cy: y0, r: band.r }, { cx: x, cy: y1, r: band.r });
    }
    for (let y = y0 + band.step; y <= y1 - band.step; y += band.step) {
      holes.push({ cx: x0, cy: y, r: band.r }, { cx: x1, cy: y, r: band.r });
    }
  }

  return (
    // The wrapper is locked to the artwork's ratio so the scallops stay
    // circles at every width.
    <div className={`relative ${className}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect x="0" y="0" width={W} height={H} rx="16" fill="#14110f" />

        <g fill="#f4efe3">
          {scallops.map((s, i) => (
            <circle key={`s${i}`} cx={s.cx} cy={s.cy} r={R} />
          ))}
          <rect
            x={laceX0}
            y={laceY0}
            width={laceX1 - laceX0}
            height={laceY1 - laceY0}
          />
        </g>

        <g fill="#14110f" opacity="0.9">
          {holes.map((h, i) => (
            <circle key={`h${i}`} cx={h.cx} cy={h.cy} r={h.r} />
          ))}
        </g>

        <rect
          x={laceX0 + 40}
          y={laceY0 + 40}
          width={laceX1 - laceX0 - 80}
          height={laceY1 - laceY0 - 80}
          fill="#efe8d8"
          stroke="#14110f"
          strokeOpacity="0.25"
          strokeWidth="1"
        />
      </svg>

      {/* Content sits on the inner panel. Dark text always — the doily
          keeps its cream paper even when the rest of the issue goes noir. */}
      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden px-[15%] py-[13%] text-[#14110f]">
        {children}
      </div>
    </div>
  );
}
