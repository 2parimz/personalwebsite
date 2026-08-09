"use client";

import { motion } from "framer-motion";
import { reel } from "@/content/site";

/**
 * The video slot as a flip-out camcorder LCD: matte black panel, four
 * control buttons down the left bezel, brushed hinge, and the body
 * suggested at the right edge. Restrained on purpose — it should read as
 * a 90s object photographed for a magazine, not a rendering of one.
 *
 * The whole composition tilts via CSS on the wrapper, so the SVG chassis
 * and the HTML video overlay rotate together and can never drift apart.
 */

const VB = { w: 1000, h: 620 };
/** LCD aperture in viewBox units. 620 x 349 is 16:9. */
const SCREEN = { x: 190, y: 136, w: 620, h: 349 };

const screenBox: React.CSSProperties = {
  left: `${(SCREEN.x / VB.w) * 100}%`,
  top: `${(SCREEN.y / VB.h) * 100}%`,
  width: `${(SCREEN.w / VB.w) * 100}%`,
  height: `${(SCREEN.h / VB.h) * 100}%`,
};

const BUTTONS = [175, 265, 355, 445];

export function Camcorder() {
  const { src, youtubeId, poster, caption } = reel.video;
  const hasVideo = Boolean(src || youtubeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="relative w-full [transform:rotate(-1.2deg)]">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="h-auto w-full" role="presentation">
          <defs>
            <linearGradient id="cc-panel" x1="0" y1="0" x2="0.25" y2="1">
              <stop offset="0%" stopColor="#3a3634" />
              <stop offset="45%" stopColor="#201d1c" />
              <stop offset="100%" stopColor="#100f0e" />
            </linearGradient>
            <linearGradient id="cc-hinge" x1="0" y1="0" x2="1" y2="0.2">
              <stop offset="0%" stopColor="#6f6960" />
              <stop offset="42%" stopColor="#2b2724" />
              <stop offset="76%" stopColor="#837c73" />
              <stop offset="100%" stopColor="#1e1b19" />
            </linearGradient>
            <linearGradient id="cc-body" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#4a443e" />
              <stop offset="45%" stopColor="#262220" />
              <stop offset="100%" stopColor="#111010" />
            </linearGradient>
            <linearGradient id="cc-key" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#403b38" />
              <stop offset="100%" stopColor="#191716" />
            </linearGradient>
            <filter id="cc-shadow" x="-20%" y="-40%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>

          {/* ground shadow */}
          <ellipse
            cx="470"
            cy="580"
            rx="392"
            ry="26"
            fill="#14110f"
            opacity="0.3"
            filter="url(#cc-shadow)"
          />

          {/* ---- the camera body, mostly out of frame behind the panel.
                  Dark and cropped by the right edge, like the reference:
                  the panel is the subject, this is just enough to say
                  there's a camera attached. ---- */}
          <g>
            <path
              d="M868 156 Q868 136 890 133 L1000 120 L1000 498 L890 485 Q868 482 868 462 Z"
              fill="url(#cc-body)"
            />
            {/* top edge catching light */}
            <path
              d="M884 143 L1000 130"
              stroke="#8d857c"
              strokeOpacity="0.5"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* shell seam */}
            <path d="M934 138 L934 482" stroke="#0a0908" strokeOpacity="0.55" strokeWidth="2" />
            {/* strap lug and a standby lamp */}
            <rect x="952" y="298" width="48" height="18" rx="9" fill="#0d0c0b" opacity="0.75" />
            <circle cx="962" cy="200" r="6" fill="#c8382c" />
          </g>

          {/* ---- hinge knuckles ---- */}
          <rect x="850" y="182" width="26" height="88" rx="13" fill="url(#cc-hinge)" />
          <rect x="850" y="350" width="26" height="88" rx="13" fill="url(#cc-hinge)" />
          <path
            d="M863 196 v60 M863 364 v60"
            stroke="#0d0c0b"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* ---- LCD panel ---- */}
          <rect x="40" y="60" width="822" height="500" rx="30" fill="url(#cc-panel)" />
          {/* top bevel highlight */}
          <path
            d="M70 74 Q450 62 834 78"
            fill="none"
            stroke="#a9a29a"
            strokeOpacity="0.45"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* bezel screws, like the reference */}
          <circle cx="836" cy="90" r="7" fill="#0d0c0b" opacity="0.8" />
          <circle cx="836" cy="530" r="7" fill="#0d0c0b" opacity="0.8" />

          {/* screen recess */}
          <rect
            x={SCREEN.x - 9}
            y={SCREEN.y - 9}
            width={SCREEN.w + 18}
            height={SCREEN.h + 18}
            rx="6"
            fill="#050607"
          />

          {/* ---- four control buttons down the left bezel ---- */}
          <g>
            {BUTTONS.map((cy, i) => (
              <g key={cy}>
                <circle cx="115" cy={cy} r="30" fill="url(#cc-key)" stroke="#0c0b0a" strokeWidth="2" />
                <circle cx="115" cy={cy - 3} r="27" fill="none" stroke="#6b645c" strokeOpacity="0.35" strokeWidth="1.5" />
                {i === 0 && (
                  /* home glyph, drawn around this button's centre */
                  <path
                    d={`M115 ${cy - 13} L131 ${cy + 1} L127 ${cy + 1} L127 ${cy + 14} L119 ${
                      cy + 14
                    } L119 ${cy + 5} L111 ${cy + 5} L111 ${cy + 14} L103 ${cy + 14} L103 ${
                      cy + 1
                    } L99 ${cy + 1} Z`}
                    fill="#cfc8bf"
                  />
                )}
                {i === 1 && (
                  <text
                    x="115"
                    y={cy + 9}
                    textAnchor="middle"
                    fill="#cfc8bf"
                    fontSize="26"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                  >
                    i
                  </text>
                )}
                {i === 2 && (
                  <text
                    x="115"
                    y={cy + 8}
                    textAnchor="middle"
                    fill="#cfc8bf"
                    fontSize="22"
                    fontFamily="Helvetica, Arial, sans-serif"
                    fontWeight="600"
                  >
                    W
                  </text>
                )}
                {i === 3 && <circle cx="115" cy={cy} r="11" fill="#c8382c" />}
              </g>
            ))}
          </g>

          {/* panel foot, catching light */}
          <path
            d="M74 546 Q450 558 828 544"
            fill="none"
            stroke="#000000"
            strokeOpacity="0.5"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* The video, sitting in the LCD aperture */}
        <div className="absolute overflow-hidden bg-black" style={screenBox}>
          {src ? (
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              preload="none"
              poster={poster ?? undefined}
            >
              <source src={src} />
              Your browser cannot play this video.
            </video>
          ) : youtubeId ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title={caption}
              style={{ border: 0 }}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <StandbyScreen />
          )}

          {/* viewfinder furniture, kept clear of the video controls */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2 sm:p-3">
            <span className="kicker rounded-[2px] border border-white/40 px-1 text-[0.4rem] text-white/70 sm:text-[0.45rem]">
              {hasVideo ? "PLAY" : "STBY"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="kicker text-[0.4rem] text-white/70 sm:text-[0.45rem]">
                {reel.dates}
              </span>
              <motion.span
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="block h-1.5 w-1.5 rounded-full bg-[#ff3b30]"
              />
            </span>
          </div>
        </div>
      </div>

      <p className="kicker mt-5 text-fg/50">{caption}</p>
    </motion.div>
  );
}

function StandbyScreen() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 bg-[#0d100e] px-4 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px)",
        }}
      />
      <p className="kicker text-[0.55rem] text-[#e8e2d6]/80 sm:text-[0.65rem]">No tape in the deck</p>
      <p className="max-w-[80%] text-[0.6rem] leading-relaxed text-[#e8e2d6]/45 sm:text-[0.7rem]">
        Drop an .mp4 into <code>/public/video</code> and set <code>reel.video.src</code>,
        or paste a YouTube ID into <code>reel.video.youtubeId</code>.
      </p>
    </div>
  );
}
