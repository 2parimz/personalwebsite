"use client";

import Image from "next/image";

/**
 * The picture spread's image slot. Whatever goes in gets flattened to
 * greyscale and re-tinted, so any photo lands as an art-directed plate
 * rather than a snapshot. Empty, it draws its own graphic instead.
 */
export function DuotoneFrame({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#ffd7e6] ${className}`}>
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover [filter:grayscale(1)_contrast(1.15)]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#ff2f86] mix-blend-color" />
          <div className="pointer-events-none absolute inset-0 bg-[#ffe3ee] opacity-40 mix-blend-lighten" />
        </>
      ) : (
        <PlaceholderPlate />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.35) 0 1px, transparent 1px 3px)",
        }}
      />
    </div>
  );
}

/** A loose spray-paint mark, in the spirit of the reference plate. */
function PlaceholderPlate() {
  return (
    <svg viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <rect width="600" height="700" fill="#ffc2d9" />
      <path
        d="M120 470 Q88 360 168 296 Q262 222 344 292 Q404 344 350 396 Q300 442 254 402 Q224 374 252 350"
        fill="none"
        stroke="#ff2f86"
        strokeWidth="34"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M120 470 Q88 360 168 296 Q262 222 344 292 Q404 344 350 396 Q300 442 254 402 Q224 374 252 350"
        fill="none"
        stroke="#fff0f6"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path d="M372 214 L430 176 M400 250 L470 232" stroke="#ff2f86" strokeWidth="12" strokeLinecap="round" />
      <rect x="70" y="120" width="150" height="112" fill="none" stroke="#ff2f86" strokeWidth="8" />
      <circle cx="452" cy="470" r="46" fill="none" stroke="#ff2f86" strokeWidth="12" />
    </svg>
  );
}
