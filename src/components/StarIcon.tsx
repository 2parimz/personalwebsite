/** The outlined star that repeats across the moodboard. No hooks, no state —
 *  kept separate from StarButton so the easter-egg provider can use it
 *  without importing back into itself. */
export function StarIcon({
  size = 20,
  filled = false,
  className = "",
}: {
  size?: number;
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.2 14.85 9.05 22.2 9.62 16.6 14.42 18.35 21.6 12 17.7 5.65 21.6 7.4 14.42 1.8 9.62 9.15 9.05Z" />
    </svg>
  );
}
