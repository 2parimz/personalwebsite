"use client";

/**
 * Decorative line art in the spirit of the moodboard's fashion illustration:
 * one striped trouser leg, one leopard, red pointed boots. Vector-only so it
 * stays crisp and weighs nothing.
 */
export function TrouserPlate({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 210"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="stripes" width="9" height="10" patternUnits="userSpaceOnUse">
          <rect width="9" height="10" fill="#f4efe3" />
          <path d="M2 0 Q4.5 5 2 10" stroke="#14110f" strokeWidth="3.2" fill="none" />
        </pattern>

        <pattern id="leopard" width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="#f4efe3" />
          <g fill="#14110f">
            <ellipse cx="6" cy="6" rx="3.4" ry="2.5" transform="rotate(-18 6 6)" />
            <ellipse cx="19" cy="11" rx="3.9" ry="2.7" transform="rotate(24 19 11)" />
            <ellipse cx="10" cy="19" rx="3.1" ry="2.3" transform="rotate(-8 10 19)" />
            <ellipse cx="23" cy="22" rx="2.6" ry="1.9" transform="rotate(36 23 22)" />
            <ellipse cx="1" cy="15" rx="2.4" ry="1.8" transform="rotate(12 1 15)" />
          </g>
        </pattern>
      </defs>

      {/* Striped leg, crossing to the left */}
      <path
        d="M96 0 L150 0 L134 132 Q131 150 118 152 L96 156 Q86 150 89 132 Z"
        fill="url(#stripes)"
        stroke="#14110f"
        strokeWidth="1.6"
      />
      {/* Leopard leg, kicking right */}
      <path
        d="M158 0 L212 0 Q226 78 246 126 Q250 138 240 145 L218 155 Q206 108 178 60 Z"
        fill="url(#leopard)"
        stroke="#14110f"
        strokeWidth="1.6"
      />

      {/* Red boots — pointed toe, slim heel */}
      <g fill="#cf3b2c">
        <path d="M96 156 L118 152 Q124 168 108 176 L52 196 Q42 198 42 190 Q42 184 52 180 Z" />
        <path d="M42 190 L46 196 L44 206 L38 206 L38 194 Z" />
        <path d="M218 155 L240 145 Q252 160 240 170 L196 198 Q186 202 183 195 Q181 189 190 184 Z" />
        <path d="M183 195 L189 199 L188 209 L182 209 L180 198 Z" />
      </g>
    </svg>
  );
}

/** A loose ink squiggle used as a section divider. */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 16" className={className} aria-hidden="true" fill="none">
      <path
        d="M2 9 Q16 1 30 9 T58 9 T86 9 T114 9 T142 9 T170 9 T198 9 T218 7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
