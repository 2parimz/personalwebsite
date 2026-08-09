/**
 * A small puppet head glancing hard to one side. Original artwork — the
 * side-eye is the joke, not the likeness.
 */
export function PuppetHead({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      {/* collar */}
      <path d="M26 92 Q50 78 74 92 L74 100 L26 100 Z" fill="#7fb8a4" stroke="#14110f" strokeWidth="3.5" strokeLinejoin="round" />

      {/* head */}
      <ellipse cx="50" cy="54" rx="33" ry="35" fill="#e8bb8f" stroke="#14110f" strokeWidth="3.5" />

      {/* hair */}
      <path
        d="M17 50 Q14 20 38 13 Q50 8 64 13 Q86 21 83 50 Q76 34 62 30 Q50 27 38 31 Q24 36 17 50 Z"
        fill="#9c5c2c"
        stroke="#14110f"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* muzzle */}
      <ellipse cx="50" cy="70" rx="19" ry="13" fill="#f4d6b4" stroke="#14110f" strokeWidth="3" />
      <path d="M43 71 Q50 76 57 71" fill="none" stroke="#14110f" strokeWidth="2.6" strokeLinecap="round" />

      {/* eyes, pupils shoved to the right */}
      <circle cx="37" cy="48" r="12" fill="#ffffff" stroke="#14110f" strokeWidth="3" />
      <circle cx="64" cy="48" r="12" fill="#ffffff" stroke="#14110f" strokeWidth="3" />
      <circle cx="43" cy="49" r="4.6" fill="#14110f" />
      <circle cx="70" cy="49" r="4.6" fill="#14110f" />
    </svg>
  );
}
