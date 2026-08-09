/**
 * Everything on the site reads from this file.
 * Edit here, nowhere else — no CMS, no backend.
 *
 * Photos: drop files in /public/photos and reference them as "/photos/name.jpg".
 * Any item with `src: null` renders a styled placeholder frame instead,
 * so the layout never breaks while you're still gathering images.
 */

export type Photo = {
  src: string | null;
  alt: string;
  caption?: string;
  /** Rough aspect ratio; drives the masonry rhythm. */
  ratio?: "portrait" | "landscape" | "square";
};

export const site = {
  name: "Parima",
  /** Sits above your name like a masthead issue line. */
  issue: "Issue No. 01",
  season: "Summer 2026",
  tagline: "Who's that girl?",
  role: "Designer, collector of small obsessions",
  location: "New York",

  nav: [
    { label: "About", href: "#about" },
    { label: "Studio", href: "#studio" },
    { label: "Table", href: "#restaurants" },
    { label: "Reel", href: "#reel" },
  ],

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
    { label: "Email", href: "mailto:pshel25@gmail.com" },
  ],
} as const;

/* ---------------------------------- About --------------------------------- */

export const about = {
  /** The standfirst — the italic paragraph under a magazine headline. */
  standfirst:
    "A short, personality-forward line about who you are and what you are currently deep in. Keep it to one breath.",
  /** Two columns of body copy. First one gets the drop cap. */
  columns: [
    "Replace this with the real thing. Write the way you talk — where you grew up, what you do now, the detour you took to get there, the thing you will happily argue about at dinner. Magazine profiles work because they are specific, so name names: the album, the street, the bad job.",
    "Second column. Somewhere in here mention what you are making at the moment and what you want to make next. End on something small and human rather than a mission statement — the running list in your notes app, the coffee order you have not changed in six years.",
  ],
  portrait: {
    src: null,
    alt: "Portrait",
    caption: "Somewhere, this year",
  } as Photo,
  /** Hidden until you flip the portrait over. */
  portraitBackNote:
    "shot on a disposable i forgot to develop for eleven months. hi, you found the back of the photo.",
  facts: [
    { label: "Currently", value: "Building things on the internet" },
    { label: "Based", value: "New York" },
    { label: "Drinks", value: "Iced oat latte, no sugar" },
    { label: "Cannot", value: "Whistle" },
  ],
};

/* ---------------------------------- Music --------------------------------- */

export type Track = {
  title: string;
  artist: string;
  /** Local file in /public/audio, e.g. "/audio/track.mp3". Null = nothing to play yet. */
  src: string | null;
};

export type Cassette = {
  id: string;
  /** Handwritten label on the tape. */
  label: string;
  /** Small print under the label. */
  sublabel: string;
  /** Shell colour — pick anything, these match the reference tapes. */
  color: string;
  track: Track;
};

export const music = {
  /**
   * Three tapes in the tray. Drag one into the boombox (or just click it),
   * then hit play. Nothing plays until a tape is loaded.
   */
  cassettes: [
    {
      id: "rock",
      label: "'80s ROCK",
      sublabel: "SONY · LOW-NOISE · 90",
      color: "#d8d2c2",
      track: { title: "Side A, track one", artist: "Something loud", src: null },
    },
    {
      id: "miracle",
      label: "MIRACLE LOVE",
      sublabel: "INFONICS · 4 CHANNEL · 60",
      color: "#f2c3d1",
      track: { title: "The pink tape", artist: "Something soft", src: null },
    },
    {
      id: "holiday",
      label: "HOLIDAY MIXTAPE",
      sublabel: "SANYO · C-60LN · CHROME",
      color: "#4f7d52",
      track: { title: "Recorded off the radio", artist: "Various", src: null },
    },
  ] as Cassette[],

  /** Unlocked by typing the secret word. A fourth tape appears in the tray. */
  secretCassette: {
    id: "secret",
    label: "DO NOT PLAY",
    sublabel: "UNLABELLED · FOUND IN A DRAWER",
    color: "#d4af37",
    track: { title: "The one I don't tell people about", artist: "—", src: null },
  } as Cassette,

  /** Scrolling ticker of artists. */
  onRepeat: [
    "Sade",
    "Frank Ocean",
    "Nina Simone",
    "Jai Paul",
    "Little Simz",
    "Cocteau Twins",
    "Solange",
    "Arthur Russell",
  ],
};

/* ------------------------------ Summer list ------------------------------- */

export type Obsession = {
  title: string;
  note: string;
  /** "/photos/name.jpg" — or null for a tonal placeholder. */
  image: string | null;
};

export const obsessions = {
  intro: "The running list, pinned to the wall. Drag them around if you like.",
  items: [
    { title: "A thing", note: "Why it has taken over your life this summer.", image: null },
    { title: "Another thing", note: "One dry, specific line. No ad adjectives.", image: null },
    { title: "A show", note: "The episode you have rewatched.", image: null },
    { title: "A garment", note: "Bought secondhand, worn to death.", image: null },
    { title: "A snack", note: "Indefensible. Non-negotiable.", image: null },
    { title: "A book", note: "Still on page 40. Counts anyway.", image: null },
  ] as Obsession[],
};

/* ------------------------------- Restaurants ------------------------------ */

export const restaurants = {
  intro: "Where I take people I like.",
  items: [
    { name: "Restaurant name", city: "New York", note: "Order the thing that sounds boring.", stars: 5, order: "The boring thing" },
    { name: "Restaurant name", city: "New York", note: "Go at 3pm on a Tuesday. Trust me.", stars: 4, order: "Half a chicken" },
    { name: "Restaurant name", city: "Lisbon", note: "Counter seats only. Cash only. Worth it.", stars: 5, order: "Whatever is on the board" },
    { name: "Restaurant name", city: "Mexico City", note: "The one I think about on the plane home.", stars: 5, order: "Two of everything" },
    { name: "Restaurant name", city: "Paris", note: "Overrated, and I keep going back.", stars: 3, order: "Just the bread" },
    { name: "Restaurant name", city: "Tokyo", note: "Eleven seats. Book the second it opens.", stars: 5, order: "Omakase" },
  ],
};

/* ------------------------------ Reel & travel ----------------------------- */

export const reel = {
  place: "Somewhere",
  dates: "June 2026",
  blurb:
    "A line or two about the trip — what you went for and what you actually came back with.",

  /** Frames on the film strip. Add or remove freely. */
  photos: [
    { src: null, alt: "Frame 1", caption: "Morning, day one" },
    { src: null, alt: "Frame 2", caption: "The good coffee" },
    { src: null, alt: "Frame 3", caption: "Got lost here" },
    { src: null, alt: "Frame 4", caption: "Worth the walk" },
    { src: null, alt: "Frame 5", caption: "Last night" },
    { src: null, alt: "Frame 6", caption: "The window" },
    { src: null, alt: "Frame 7", caption: "Unplanned" },
    { src: null, alt: "Frame 8", caption: "Going back" },
  ] as Photo[],

  /**
   * The camcorder screen. Two ways to fill it:
   *   1. Drop an .mp4 in /public/video and set `src: "/video/clip.mp4"`
   *   2. Or paste a YouTube video ID (the bit after "watch?v=")
   * Leave both null and it shows a standby screen.
   */
  video: {
    src: null as string | null,
    youtubeId: null as string | null,
    poster: null as string | null,
    caption: "Handheld, unedited",
  },
};

/* ------------------------------- Easter eggs ------------------------------ */

export const eggs = {
  /** Type these letters anywhere on the page to unlock the fourth cassette. */
  secretWord: "muse",
  konami: "DIRECTOR'S CUT UNLOCKED — the issue goes to press in black.",
  secretTrackFound: "A fourth tape just turned up in the tray.",
  starShower: "★ Seven stars. Somebody's clicking.",
  endOfIssue: "You reached the end of the issue. There isn't more. Go outside.",

  /** Banana. Three of them, hidden at different depths. */
  banana: {
    title: "Whoops!",
    body: "You slipped on the banana! You owe Parima a coffee.",
    button: "I'll pay up",
  },

  /** The little switch in the corner. */
  party: {
    on: "You found Parima's alter ego!",
    off: "Back to the quiet issue.",
  },
};
