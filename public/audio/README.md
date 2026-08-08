# Audio

Drop `.mp3` or `.m4a` files here and point `music.nowPlaying[].src` in
`src/content/site.ts` at them, e.g. `/audio/track.mp3`.

Tracks left as `src: null` still show in the list — the play button just stays
disabled. Nothing ever autoplays on load.

Prefer not to host files? Set `music.spotifyEmbedUrl` instead and use the
Spotify player.
