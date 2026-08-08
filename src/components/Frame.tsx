"use client";

import Image from "next/image";
import type { Photo } from "@/content/site";
import { StarIcon } from "@/components/StarIcon";

const RATIO: Record<NonNullable<Photo["ratio"]>, string> = {
  portrait: "3 / 4",
  landscape: "4 / 3",
  square: "1 / 1",
};

/**
 * Tonal duotones drawn from the palette, so an un-filled gallery still
 * reads as a designed collage rather than a broken one.
 */
const WASHES = [
  "linear-gradient(150deg, #d9cfc0, #b5a894)",
  "linear-gradient(150deg, #cfc6b4, #8c7f6a)",
  "linear-gradient(160deg, #e0d6c6, #a2a06f)",
  "linear-gradient(140deg, #d6c9bd, #b06a5c)",
  "linear-gradient(165deg, #cdc3b6, #6f7042)",
  "linear-gradient(135deg, #e3d9c9, #7d7365)",
];

/** Stable per-photo choice — Math.random here would break hydration. */
function washFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return WASHES[hash % WASHES.length];
}

export function Frame({
  photo,
  className = "",
  boxClassName = "",
  showCaption = true,
  priority = false,
  fit = "cover",
  /** Pass null to let boxClassName control the height instead. */
  keepRatio = true,
  sizes = "(max-width: 768px) 100vw, 40vw",
}: {
  photo: Photo;
  className?: string;
  boxClassName?: string;
  showCaption?: boolean;
  priority?: boolean;
  fit?: "cover" | "contain";
  keepRatio?: boolean;
  sizes?: string;
}) {
  const ratio = RATIO[photo.ratio ?? "portrait"];

  return (
    <figure className={className}>
      <div
        className={`grain relative w-full overflow-hidden bg-paper ${boxClassName}`}
        style={keepRatio ? { aspectRatio: ratio } : undefined}
      >
        {photo.src ? (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={fit === "contain" ? "object-contain" : "object-cover"}
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ backgroundImage: washFor(photo.alt) }}
            role="img"
            aria-label={`${photo.alt} — placeholder`}
          >
            <span className="text-white/70">
              <StarIcon size={22} />
            </span>
            <span className="kicker text-white/60">{photo.alt}</span>
          </div>
        )}
      </div>

      {showCaption && photo.caption && (
        <figcaption className="kicker mt-2 flex items-center gap-2 text-fg/55">
          <span className="h-px w-4 bg-current" />
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}
