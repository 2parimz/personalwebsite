/**
 * The marker loop that draws itself around a nav item on hover — the way
 * you'd ring a word in a puzzle. One continuous stroke that overshoots
 * where it started, because nobody closes a circle neatly.
 *
 * The draw-on is pure CSS (see `.marker` in globals.css): `pathLength="1"`
 * normalises the path so a dasharray of 1 works whatever the word's width,
 * and the parent's `group` hover moves the dashoffset. No JS, no state.
 */
export function MarkerCircle() {
  return (
    <svg
      className="marker pointer-events-none absolute -inset-x-3 -inset-y-2"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        pathLength={1}
        d="M 16 33 C 3 30 2 13 19 8 C 43 2 82 4 93 13 C 102 20 93 33 67 36.5 C 44 39.5 17 38 8.5 30 C 4.5 26 7 20 13 16.5"
      />
    </svg>
  );
}
