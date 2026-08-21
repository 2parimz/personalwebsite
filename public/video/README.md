# Video

Two places a clip can play.

## The window on the cover

Its glass is genuinely transparent, so the video sits **behind** the frame
and you see it through the panes — the view outside.

`window-scene.mp4` is the clip currently playing behind the glass.

To change it, drop a new `.mp4` in here and point the `window` object in
`cover.objects` at it:

    video: { src: "/video/city.mp4", youtubeId: null, poster: null }

It plays muted on a loop, because the frame is on top of it and there is no
way to reach a control. Keep it short and small — a few seconds, a few MB.

## The camcorder on the Sound & reel spread

Its screen is opaque, so the video plays **on top** of it, with controls,
and waits for a click.

    reel.camcorder.video.src = "/video/your-clip.mp4"

A YouTube ID works instead of a file in either place — set `youtubeId` to
the part after `watch?v=`.

## A note on formats

`.mov` only plays reliably in Safari — Chrome and Firefox often refuse it.
Save as `.mp4` (H.264), or hand me a `.mov` and I will convert it.

Phone video is usually 4K, which is far more than a small on-page frame
needs and slow to load. The clip here was 3840x2160 and 24MB before being
re-encoded down to 464K.
