/** A small banana. Purely a shape — the click behaviour lives in BananaSpot. */
export function BananaIcon({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <g transform="rotate(-18 50 50)">
        {/* body */}
        <path
          d="M18 22 Q22 64 60 78 Q86 86 90 66 Q70 70 50 56 Q30 42 30 18 Q22 12 18 22 Z"
          fill="#f5cf3d"
          stroke="#14110f"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* inner shading line */}
        <path
          d="M27 26 Q31 58 60 70"
          fill="none"
          stroke="#14110f"
          strokeOpacity="0.35"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* stem and tip */}
        <path d="M30 18 L26 8 Q24 4 20 6 L18 22" fill="#7a5c1f" stroke="#14110f" strokeWidth="3" strokeLinejoin="round" />
        <path d="M90 66 Q95 64 94 70 Q92 75 87 73 Z" fill="#7a5c1f" stroke="#14110f" strokeWidth="2.6" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
