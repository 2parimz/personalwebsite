"use client";

import { motion } from "framer-motion";
import { reel } from "@/content/site";

/**
 * A video slot dressed as a camcorder. The chassis is drawn as one SVG so
 * the shapes, gradients and highlights stay consistent at any size; the
 * video itself is an HTML element positioned over the LCD rectangle using
 * percentages derived from the same viewBox numbers.
 */

const VB = { w: 1000, h: 620 };
/** The LCD aperture, in viewBox units. 16:9. */
const SCREEN = { x: 48, y: 138, w: 484, h: 272 };

/**
 * The panel is tilted in the SVG, so the HTML overlay has to carry the
 * identical rotation about the identical point — expressed here relative to
 * the overlay's own box — or the video drifts out of the aperture.
 */
const PANEL_TILT = 1.2; // degrees
const PIVOT = { x: 290, y: 300 }; // viewBox units, matches the <g transform>

const screenBox: React.CSSProperties = {
  left: `${(SCREEN.x / VB.w) * 100}%`,
  top: `${(SCREEN.y / VB.h) * 100}%`,
  width: `${(SCREEN.w / VB.w) * 100}%`,
  height: `${(SCREEN.h / VB.h) * 100}%`,
  transform: `rotate(${PANEL_TILT}deg)`,
  transformOrigin: `${((PIVOT.x - SCREEN.x) / SCREEN.w) * 100}% ${
    ((PIVOT.y - SCREEN.y) / SCREEN.h) * 100
  }%`,
};

export function Camcorder() {
  const { src, youtubeId, poster, caption } = reel.video;
  const hasVideo = Boolean(src || youtubeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
    >
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="h-auto w-full" role="presentation">
        <defs>
          <linearGradient id="cc-body" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#5e5850" />
            <stop offset="38%" stopColor="#332f2b" />
            <stop offset="100%" stopColor="#141211" />
          </linearGradient>
          <linearGradient id="cc-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a443e" />
            <stop offset="100%" stopColor="#100e0d" />
          </linearGradient>
          <linearGradient id="cc-panel" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#4c4640" />
            <stop offset="55%" stopColor="#262320" />
            <stop offset="100%" stopColor="#121110" />
          </linearGradient>
          <linearGradient id="cc-hinge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9c958c" />
            <stop offset="42%" stopColor="#454039" />
            <stop offset="72%" stopColor="#8b847c" />
            <stop offset="100%" stopColor="#3b3733" />
          </linearGradient>
          <linearGradient id="cc-ring" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#867e75" />
            <stop offset="50%" stopColor="#38332f" />
            <stop offset="100%" stopColor="#171514" />
          </linearGradient>
          <radialGradient id="cc-glass" cx="34%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#4b7fa6" />
            <stop offset="42%" stopColor="#16303f" />
            <stop offset="100%" stopColor="#04070a" />
          </radialGradient>
          <linearGradient id="cc-button" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6a635b" />
            <stop offset="100%" stopColor="#2b2724" />
          </linearGradient>
          <pattern id="cc-mesh" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#0a0908" />
          </pattern>
          <filter id="cc-shadow" x="-20%" y="-40%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        {/* ground shadow */}
        <ellipse
          cx="520"
          cy="548"
          rx="410"
          ry="26"
          fill="#14110f"
          opacity="0.22"
          filter="url(#cc-shadow)"
        />

        {/* ------------------------------ BODY ------------------------------ */}
        <g transform="rotate(-3.5 720 320)">
          {/* rear battery block */}
          <rect x="486" y="292" width="56" height="152" rx="16" fill="#100e0d" />
          <rect x="496" y="308" width="30" height="6" rx="3" fill="#3a3531" />

          {/* viewfinder eyecup */}
          <rect x="452" y="186" width="132" height="62" rx="28" fill="#1c1917" />
          <ellipse cx="458" cy="217" rx="17" ry="33" fill="#2a2521" />
          <ellipse cx="456" cy="217" rx="11" ry="24" fill="#0a0908" />

          {/* main body */}
          <rect x="518" y="168" width="392" height="296" rx="38" fill="url(#cc-body)" />
          {/* top edge highlight */}
          <path
            d="M556 172 Q700 160 872 176"
            fill="none"
            stroke="#9a9188"
            strokeOpacity="0.45"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* body seam */}
          <path
            d="M524 352 Q712 366 906 348"
            fill="none"
            stroke="#0b0a09"
            strokeOpacity="0.75"
            strokeWidth="2.5"
          />

          {/* front block the lens mounts into */}
          <rect x="828" y="182" width="116" height="270" rx="46" fill="url(#cc-front)" />

          {/* top furniture: mic mesh, zoom rocker, record button */}
          <rect x="606" y="150" width="132" height="30" rx="15" fill="#141211" />
          <rect x="612" y="156" width="120" height="18" rx="9" fill="url(#cc-mesh)" />
          <rect x="756" y="152" width="74" height="24" rx="12" fill="url(#cc-button)" />
          <path d="M772 164 h14 M800 164 h14" stroke="#0d0c0b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="576" cy="170" r="14" fill="#b8342a" stroke="#2a2724" strokeWidth="3" />

          {/* side detail: label plate and screws */}
          <rect x="566" y="392" width="150" height="44" rx="8" fill="#1b1917" opacity="0.9" />
          <path
            d="M582 408 h96 M582 420 h64"
            stroke="#6f6a63"
            strokeOpacity="0.6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="548" cy="200" r="4" fill="#0b0a09" />
          <circle cx="548" cy="436" r="4" fill="#0b0a09" />
          <circle cx="880" cy="200" r="3.5" fill="#f5cf3d" opacity="0.85" />

          {/* ------------------------------ LENS ------------------------------ */}
          <g>
            <ellipse cx="906" cy="318" rx="74" ry="92" fill="#241f1c" />
            <ellipse cx="908" cy="318" rx="66" ry="84" fill="url(#cc-ring)" />
            <ellipse cx="910" cy="318" rx="54" ry="70" fill="#151312" />
            <ellipse cx="912" cy="318" rx="45" ry="59" fill="#0a0908" />
            <ellipse cx="913" cy="318" rx="37" ry="49" fill="url(#cc-glass)" />
            {/* coating glints */}
            <ellipse
              cx="898"
              cy="290"
              rx="12"
              ry="19"
              fill="#ffffff"
              opacity="0.22"
              transform="rotate(-18 898 290)"
            />
            <ellipse cx="922" cy="344" rx="6" ry="10" fill="#7fd0ff" opacity="0.18" />
            {/* barrel highlight */}
            <path
              d="M868 250 Q852 318 868 388"
              fill="none"
              stroke="#a49a90"
              strokeOpacity="0.35"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* ------------------------------ HINGE ------------------------------ */}
        <rect x="543" y="168" width="28" height="258" rx="14" fill="url(#cc-hinge)" />
        <path
          d="M551 186 v222 M563 186 v222"
          stroke="#14110f"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* --------------------------- LCD PANEL ---------------------------- */}
        <g transform={`rotate(${PANEL_TILT} ${PIVOT.x} ${PIVOT.y})`}>
          <rect x="26" y="116" width="524" height="366" rx="20" fill="url(#cc-panel)" />
          {/* panel edge highlight */}
          <path
            d="M44 128 Q290 118 532 130"
            fill="none"
            stroke="#a49a90"
            strokeOpacity="0.4"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* screen recess */}
          <rect
            x={SCREEN.x - 6}
            y={SCREEN.y - 6}
            width={SCREEN.w + 12}
            height={SCREEN.h + 12}
            rx="8"
            fill="#07080a"
          />
          {/* under-bezel controls */}
          <rect x="60" y="432" width="86" height="16" rx="8" fill="#15130f" />
          <circle cx="176" cy="440" r="9" fill="#15130f" />
          <circle cx="204" cy="440" r="9" fill="#15130f" />
          <rect x="430" y="430" width="94" height="20" rx="10" fill="#15130f" />
          <circle cx="452" cy="440" r="5" fill="#4d5b3f" />
          <circle cx="476" cy="440" r="5" fill="#4d4843" />
        </g>
      </svg>

      {/* The actual video, sitting in the LCD aperture */}
      <div className="absolute overflow-hidden rounded-[3px] bg-black" style={screenBox}>
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

        {/* viewfinder furniture — never over the video controls */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-2 sm:p-3">
          <span className="flex items-center gap-1.5">
            <motion.span
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="block h-1.5 w-1.5 rounded-full bg-[#ff3b30] sm:h-2 sm:w-2"
            />
            <span className="kicker text-[0.45rem] text-white/80 sm:text-[0.5rem]">
              {hasVideo ? "PLAY" : "REC"}
            </span>
          </span>
          <span className="kicker text-[0.45rem] text-white/70 sm:text-[0.5rem]">
            {reel.dates}
          </span>
        </div>
      </div>

      <p className="kicker mt-4 text-fg/50">{caption}</p>
    </motion.div>
  );
}

function StandbyScreen() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 bg-[#0e1410] px-4 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px)",
        }}
      />
      <p className="kicker text-[0.55rem] text-[#7de08a] sm:text-[0.65rem]">No tape in the deck</p>
      <p className="max-w-[80%] text-[0.6rem] leading-relaxed text-[#7de08a]/60 sm:text-[0.7rem]">
        Drop an .mp4 into <code>/public/video</code> and set <code>reel.video.src</code>,
        or paste a YouTube ID into <code>reel.video.youtubeId</code>.
      </p>
    </div>
  );
}
