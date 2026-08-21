# Video

Two places a clip can play.

## The window on the cover

Its glass is genuinely transparent, so the video sits **behind** the frame
and you see it through the panes — the view outside.

Drop an `.mp4` in here, then in `src/content/site.ts` find the `window`
object in `cover.objects` and set:

    video: { src: "/video/city.mp4", youtubeId: null, poster: null }

It plays muted on a loop, because the frame is on top of it and there is no
way to reach a control. Keep it short and small — a few seconds, a few MB.

## The camcorder on the Sound & reel spread

Its screen is opaque, so the video plays **on top** of it, with controls,
and waits for a click.

    reel.camcorder.video.src = "/video/your-clip.mp4"

A YouTube ID works instead of a file in either place — set `youtubeId` to
the part after `watch?v=`.
