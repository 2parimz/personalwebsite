# Cover objects

The draggable pieces on the front spread. Each one is listed in
`cover.objects` in `src/content/site.ts`.

| File | What it is |
| --- | --- |
| `rug.jpg` | Persian rug (stored landscape so it lies flat) |
| `window.png` | Casement window — the pane is empty, ready for a view |
| `chandelier.png` | Crystal chandelier |
| `coffee-table.png` | Noguchi-style glass coffee table |
| `side-table.png` | Brass pedestal side table |
| `plant.png` | Bird-of-paradise |
| `lamp.png` | Brass scalloped table lamp |
| `tulips.png` | Tulips in the blue patterned vase |
| `flower.jpg` | Flowers |

`camcorder.png` lives here too but is not a cover object — it sits on the
Sound & reel spread and plays a video in its screen. See `reel.camcorder`.

## Adding another

1. Drop the file in here — a transparent PNG cut-out works best
2. Add a line to `cover.objects` with its real pixel size as `natural: [w, h]`,
   which lets Next serve a smaller, re-compressed copy

## Arranging

- **Drag** to move, **click** to bring to the front
- **Shift-drag**, or pull the circle at the bottom-right, to resize
- Press **L** to copy the arrangement to your clipboard, then paste it over
  the `objects:` array in `site.ts` to keep it

Positions are percentages, so a layout holds its proportions at any size.
