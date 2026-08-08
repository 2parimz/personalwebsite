/**
 * Everything on the site reads from this file.
 * Edit here, nowhere else — no CMS, no backend.
 *
 * Photos: drop files in /public/photos and reference them as "/photos/name.jpg".
 * Any item with `src: null` renders as a styled placeholder frame instead,
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
    { label: "Sound", href: "#music" },
    { label: "Obsessions", href: "#obsessions" },
    { label: "Table", href: "#restaurants" },
    { label: "Elsewhere", href: "#trip" },
  ],

  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Email", href: "mailto:hello@example.com" },
    { label: "Read.cv", href: "https://read.cv/" },
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
  /** Hidden until you flip the portrait over. Easter egg #4. */
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
  /** Local file in /public, e.g. "/audio/track.mp3". Null = link-only row. */
  src: string | null;
  href?: string;
};

export const music = {
  /**
   * Optional Spotify embed. Grab it from Share → Embed playlist and paste
   * only the src URL. Set to null to hide the embed entirely.
   */
  spotifyEmbedUrl: null as string | null,
  // e.g. "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?theme=0"

  nowPlaying: [
    { title: "Track one", artist: "Artist name", src: null, href: "#" },
    { title: "Track two", artist: "Artist name", src: null, href: "#" },
    { title: "Track three", artist: "Artist name", src: null, href: "#" },
    { title: "Track four", artist: "Artist name", src: null, href: "#" },
    { title: "Track five", artist: "Artist name", src: null, href: "#" },
  ] as Track[],

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

  /** Easter egg #2 — appears only once you type the secret word. */
  secretTrack: {
    title: "The one I don't tell people about",
    artist: "—",
    src: null,
    href: "#",
  } as Track,
};

/* ------------------------------ Summer list ------------------------------- */

export const obsessions = {
  intro: "The running list. Updated whenever something displaces something else.",
  items: [
    { title: "A thing", note: "Why it has taken over your life this summer." },
    { title: "Another thing", note: "One dry, specific line. No adjectives you'd find in an ad." },
    { title: "A show", note: "The episode you have rewatched." },
    { title: "A garment", note: "Bought secondhand, worn to death." },
    { title: "A snack", note: "Indefensible. Non-negotiable." },
    { title: "A book", note: "Still on page 40. Counts anyway." },
  ],
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

/* ---------------------------------- Trip ---------------------------------- */

export const trip = {
  title: "Elsewhere",
  place: "Somewhere",
  dates: "June 2026",
  blurb:
    "A line or two about the trip — what you went for and what you actually came back with.",
  photos: [
    { src: null, alt: "Trip photo 1", caption: "Morning, day one", ratio: "portrait" },
    { src: null, alt: "Trip photo 2", caption: "The good coffee", ratio: "landscape" },
    { src: null, alt: "Trip photo 3", caption: "Got lost here", ratio: "square" },
    { src: null, alt: "Trip photo 4", caption: "Worth the walk", ratio: "portrait" },
    { src: null, alt: "Trip photo 5", caption: "Last night", ratio: "landscape" },
    { src: null, alt: "Trip photo 6", caption: "The window", ratio: "square" },
    { src: null, alt: "Trip photo 7", caption: "Unplanned", ratio: "portrait" },
    { src: null, alt: "Trip photo 8", caption: "Going back", ratio: "landscape" },
  ] as Photo[],
};

/* ------------------------------- Easter eggs ------------------------------ */

export const eggs = {
  /** Type these letters anywhere on the page to unlock the secret track. */
  secretWord: "muse",
  /** Messages shown when each egg fires. */
  konami: "DIRECTOR'S CUT UNLOCKED — the issue goes to press in black.",
  secretTrackFound: "You typed the word. One more track just appeared.",
  starShower: "★ Seven stars. Somebody's clicking.",
  endOfIssue: "You reached the end of the issue. There isn't more. Go outside.",
};
