# Portfolio

An editorial-magazine portfolio — cream newsprint, Didone headlines, collaged
cards, and a star motif borrowed from a pinboard.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Editing content

**Everything lives in one file: `src/content/site.ts`.** Name, sections, track
list, obsessions, restaurants, trip photos, and the easter-egg copy. No CMS, no
backend, no database.

- Photos → drop into `public/photos`, reference as `/photos/name.jpg`
- Audio → drop into `public/audio`, reference as `/audio/track.mp3`
- Anything with `src: null` renders a designed placeholder instead of breaking

## Structure

| Route | What's there |
| --- | --- |
| `/` | Hero masthead, About, Music, Summer obsessions, Restaurants, Trip gallery |
| `/about` | The long-form profile spread |

Sections live in `src/components/sections/`. Shared pieces — `Frame` (photo or
placeholder), `Doily` (the lace card), `Marquee`, `Star`, `Reveal` — sit one
level up in `src/components/`.

## The easter eggs

Six of them, all client-side. Copy for each is in the `eggs` block of
`site.ts`.

1. **Konami code** — `↑ ↑ ↓ ↓ ← → ← → B A` flips the whole issue into
   "director's cut": black paper, cream ink. Enter it again to go back.
2. **The secret word** — type `muse` anywhere (no input needed) and a hidden
   seventh track slides into the music list.
3. **Seven stars** — the little outlined stars scattered through the margins
   are clickable. Click seven and it rains stars.
4. **Turn the photo over** — hover or tap the portrait in About; it's a
   physical print with something written on the back.
5. **Past the last page** — keep scrolling at the very bottom and the footer
   rubber-bands open to reveal the colophon.
6. **Triple-click the masthead** — three fast clicks on your name in the nav
   and it whispers the Konami code at you.

Change the secret word via `eggs.secretWord`.

## Notes

- Nothing autoplays. The audio player only ever starts on a click.
- `prefers-reduced-motion` is respected throughout — Lenis, the custom cursor,
  the marquee, and the star shower all stand down.
- The custom star cursor only mounts on fine pointers, so touch is unaffected.

## Deploying

Push to GitHub and import the repo on Vercel — it needs no configuration.
