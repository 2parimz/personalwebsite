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
    { label: "Sound", href: "#sound" },
    { label: "Obsessions", href: "#obsessions" },
    { label: "Feature", href: "#feature" },
    { label: "Table", href: "#table" },
  ],

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle" },
    { label: "Email", href: "mailto:pshel25@gmail.com" },
  ],
} as const;

/* ------------------------------ Cover flatlay ----------------------------- */

export type CoverObject = {
  id: string;
  /** File in /public/objects. Cut-outs on transparent PNG work best. */
  src: string | null;
  label: string;
  /** Starting position and width, as % of the spread. Drag to change. */
  x: number;
  y: number;
  w: number;
  rotate?: number;
  /**
   * The file's real pixel size. Next needs it to reserve the right shape and
   * to serve a correctly sized, re-compressed copy — it is not the size the
   * object appears at, which is `w` above.
   */
  natural?: [number, number];
  /**
   * A rectangle inside the image that plays a video — the camcorder's LCD.
   * Percentages of the object itself, not of the page.
   */
  screen?: { x: number; y: number; w: number; h: number };
  /** What plays in that screen. */
  video?: { src: string | null; youtubeId: string | null; poster: string | null };
};

/**
 * The objects scattered across the cover. Array order sets the starting
 * stacking order — first is furthest back. Clicking an object brings it to
 * the front, dragging moves it, and shift-drag (or the corner handle)
 * resizes it. Press L to copy the arrangement back out as code.
 */
export const cover = {
  objects: [
    { id: "rug", src: "/objects/rug.jpg", label: "Rug", x: 30, y: 54, w: 52, rotate: -1, natural: [915, 600] },
    { id: "window", src: "/objects/window.png", label: "Window", x: 52, y: 5, w: 21, natural: [860, 630] },
    { id: "chandelier", src: "/objects/chandelier.png", label: "Chandelier", x: 34, y: -3, w: 10, natural: [782, 1172] },
    { id: "coffee-table", src: "/objects/coffee-table.png", label: "Coffee table", x: 44, y: 64, w: 25, natural: [914, 452] },
    { id: "side-table", src: "/objects/side-table.png", label: "Side table", x: 82, y: 50, w: 13, natural: [1200, 1200] },
    { id: "plant", src: "/objects/plant.png", label: "Plant", x: 75, y: 13, w: 12, natural: [531, 1000] },
    { id: "lamp", src: "/objects/lamp.png", label: "Lamp", x: 85, y: 37, w: 6.5, natural: [398, 595] },
    { id: "tulips", src: "/objects/tulips.png", label: "Tulips", x: 46, y: 46, w: 8, rotate: -3, natural: [644, 707] },
    { id: "flower", src: "/objects/flower.jpg", label: "Flowers", x: 66, y: 62, w: 7, rotate: 2, natural: [715, 1000] },
  ] as CoverObject[],
};

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

  /** The picture block on the About spread. Four of your own images. */
  gallery: [
    { src: null, alt: "Picture one", caption: "", ratio: "landscape" },
    { src: null, alt: "Picture two", caption: "", ratio: "portrait" },
    { src: null, alt: "Picture three", caption: "", ratio: "portrait" },
    { src: null, alt: "Picture four", caption: "", ratio: "landscape" },
  ] as Photo[],
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
    {
      id: "soundtrack",
      label: "SOUND TRACK No. 2",
      sublabel: "INDEX · COMPACT CASSETTE · 90",
      color: "#e0a25e",
      track: { title: "For the drive home", artist: "Somebody's score", src: null },
    },
  ] as Cassette[],

  /** Unlocked by typing the secret word. A fifth tape appears in the tray. */
  secretCassette: {
    id: "secret",
    label: "DO NOT PLAY",
    sublabel: "UNLABELLED · FOUND IN A DRAWER",
    color: "#d4af37",
    track: { title: "The one I don't tell people about", artist: "—", src: null },
  } as Cassette,

  /** The standfirst on the sound spread. */
  note:
    "Four tapes, one deck. Drag a tape across and press play — nothing starts on its own. What follows is roughly what has been on in the background of everything else in this issue.",

};

/* ------------------------------ Summer list ------------------------------- */

export type Obsession = {
  /** Printed label under the object. */
  title: string;
  /** The handwritten annotation beside it. Keep it scrappy and short. */
  note: string;
  /** "/photos/name.jpg" — a cut-out on transparent PNG works best. */
  image: string | null;
  /** Where it sits on the table, as % of the spread. Drag moves it live. */
  x: number;
  y: number;
  /** Relative size, 1 = default. */
  size?: number;
};

export const obsessions = {
  title: "What's in my bag?",
  intro: "Everything I am actually carrying this summer. Drag it around.",
  items: [
    { title: "the bag", note: "thrifted, 2023 — brand unknown", image: null, x: 6, y: 20, size: 1.7 },
    { title: "sunglasses", note: "3rd pair this year ↗", image: null, x: 74, y: 6, size: 1 },
    { title: "the camera", note: "printed pictures are the best", image: null, x: 52, y: 14, size: 0.95 },
    { title: "lip gloss", note: "og fan since 2014", image: null, x: 28, y: 62, size: 0.8 },
    { title: "journal", note: "half diary, half receipts", image: null, x: 76, y: 46, size: 1.1 },
    { title: "headphones", note: "wired > wireless. always.", image: null, x: 40, y: 74, size: 0.9 },
    { title: "perfume", note: "signature. non-negotiable.", image: null, x: 10, y: 72, size: 0.7 },
    { title: "keys", note: "one of these opens nothing", image: null, x: 60, y: 60, size: 0.75 },
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
   * The camcorder on the sound spread. It behaves like a cover object —
   * drag it, click to bring it forward, shift-drag or pull the corner to
   * resize — and your clip plays in its flip-out screen.
   *
   * To fill the screen, either:
   *   1. Drop an .mp4 into /public/video and set `src: "/video/clip.mp4"`
   *   2. Or paste a YouTube video ID (the bit after "watch?v=")
   * Leave both null and it shows a standby screen.
   *
   * `screen` is measured off the image itself — the LCD aperture sits at
   * 12.8% from its left and 31% from its top.
   */
  camcorder: {
    id: "camcorder",
    src: "/objects/camcorder.png",
    label: "Camcorder",
    x: 46,
    y: 26,
    w: 40,
    natural: [1032, 800],
    screen: { x: 12.8, y: 31, w: 39, h: 38 },
    video: {
      src: null as string | null,
      youtubeId: null as string | null,
      poster: null as string | null,
    },
  } as CoverObject,
};

/* ------------------------------ Feature spread ---------------------------- */

/**
 * The full-bleed picture spread. The image gets a duotone wash so any photo
 * you drop in reads as art-directed rather than as a snapshot.
 */
export const feature = {
  kicker: "Feature",
  title: "In colour",
  /** "/photos/name.jpg" — or null for a treated placeholder. */
  image: null as string | null,
  caption: "Shot on the street, printed too pink.",
  /** Two narrow columns, set in mono like the reference spread. */
  columns: [
    "Replace this with the real thing. The column is deliberately narrow and set in a monospaced face, the way picture-led magazine spreads run their captions — the picture does the talking and the text is texture around it.",
    "A second column. Keep it short: on a spread like this anything longer than a few sentences fights the image. Say where it was taken, why you kept it, and stop.",
  ],
};

/* ------------------------------- Easter eggs ------------------------------ */

export const eggs = {
  /** Type these letters anywhere on the page to unlock the fourth cassette. */
  secretWord: "muse",
  konami: "DIRECTOR'S CUT UNLOCKED — the issue goes to press in black.",
  secretTrackFound: "An unlabelled tape just turned up in the tray.",
  starShower: "★ Seven stars. Somebody's clicking.",
  endOfIssue: "You reached the end of the issue. There isn't more. Go outside.",

  /** Banana. Three of them, hidden at different depths. */
  banana: {
    title: "Whoops!",
    body: "You slipped on the banana! You owe Parima a coffee.",
    button: "I'll pay up",
  },
};
