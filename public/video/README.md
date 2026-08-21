# Video

The clip that plays in the camcorder on the Sound & reel spread.

Drop an `.mp4` in here, then in `src/content/site.ts` set:

    reel.camcorder.video.src = "/video/your-clip.mp4"

Or, instead of hosting a file, paste a YouTube ID (the part after
`watch?v=`) into `reel.camcorder.video.youtubeId`.

Leave both `null` and the screen shows a standby panel.

Optional: `poster` takes an image path shown before playback starts.

Keep it small — a few MB. Nothing autoplays; it waits for a click.
