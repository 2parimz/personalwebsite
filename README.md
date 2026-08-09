# Portfolio

An editorial-magazine portfolio — cream newsprint, Didone headlines, collaged
cards, and a pinboard of stars.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Editing content

**Everything lives in one file: `src/content/site.ts`.** Name, bio, cassettes,
obsessions, restaurants, film-strip photos, the video, and every line of
easter-egg copy. No CMS, no backend, no database.

- Photos → drop into `public/photos`, reference as `/photos/name.jpg`
- Audio → drop into `public/audio`, reference as `/audio/track.mp3`
- Video → drop into `public/video`, or paste a YouTube ID
- Anything left `null` renders a designed placeholder instead of breaking

## Structure

| Route | What's there |
| --- | --- |
| `/` | Hero, About, Studio (music + obsessions), Restaurants, Reel |
| `/about` | The long-form profile spread |

### The Studio

Music and the summer list share one room. Four cassettes sit in a tray — drag
one into the boombox deck (or click it, which does the same thing and keeps it
usable without a mouse), then hit play. Nothing plays until a tape is loaded.
Eject puts it back in the tray.

The obsessions are polaroids pinned to the opposite wall. Each is draggable,
and the note comes up over the photo on hover.

### The Reel

A film strip that scrolls on its own — hover to hold it, or step through frame
by frame with the arrows. Clicking a frame opens it full size. Above it, a
camcorder whose flip-out screen plays whatever you put in `reel.video`.

## The easter eggs

Seven of them, all client-side. Copy for each is in the `eggs` block of
`site.ts`.

1. **Konami code** — `↑ ↑ ↓ ↓ ← → ← → B A` flips the issue into "director's
   cut": black paper, cream ink. Enter it again to go back.
2. **The secret word** — type `muse` anywhere and a fifth gold cassette
   turns up in the tray.
3. **Three bananas** — hidden in the hero, the studio, and the restaurants.
   Click one and you owe Parima a coffee.
4. **Seven stars** — the outlined stars in the margins are clickable. Click
   seven and it rains stars.
5. **Turn the photo over** — hover or tap the portrait in About; there's
   something written on the back.
6. **Past the last page** — keep scrolling at the very bottom and the footer
   rubber-bands open.
7. **Triple-click the masthead** — three fast clicks on your name in the nav
   and it whispers the Konami code.

Change the secret word via `eggs.secretWord`.

## Notes

- Nothing autoplays. Audio only ever starts on a click.
- `prefers-reduced-motion` is respected throughout — Lenis, the star cursor,
  the film strip, the marquee, and the star shower all stand down.
- The star cursor only mounts on fine pointers, so touch is unaffected.
- The camcorder is one SVG chassis with the video positioned over the LCD
  aperture; both carry the same tilt so they stay registered at any size.

## Deploying

Push to GitHub; Vercel builds it with no configuration.
