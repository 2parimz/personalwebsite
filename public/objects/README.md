# Cover objects

The draggable pieces on the front spread. Save each image here with the
filename below, then set the matching `src` in the `cover.objects` list in
`src/content/site.ts` — e.g. `src: "/objects/plant.png"`.

Until a file is there, that object shows as a dashed outline with its name,
so you can still arrange the layout. Everything is in place except the zebra
cushion, which is still missing.

When you add a file, also set its real pixel size as `natural: [w, h]` in
`site.ts` — Next uses it to serve a smaller, re-compressed copy.

| Save as | Which image |
| --- | --- |
| `rug.jpg` | The rust / terracotta rug texture (stored landscape) |
| `sofa-velvet.png` | The brown velvet modular sofa |
| `sofa-linen.png` | The cream linen loveseat |
| `coffee-table.png` | The Noguchi-style glass coffee table |
| `plant.png` | The bird-of-paradise plant |
| `chandelier.png` | The crystal chandelier |
| `lamp.png` | The brass scalloped table lamp |
| `tulips.png` | The pink tulips in the blue patterned vase |
| `pillow-zebra.png` | The zebra-print cushion |

## Getting the best result

**Transparent PNGs.** Cut-outs sit on the page properly and take the drop
shadow around their actual silhouette. A JPG will show as a rectangle. The
rug is the exception — it's meant to read as a flat rectangle on the floor.

**Don't pre-shrink them.** Size is set on the page, so upload them large
(1200px or so on the long edge) and scale them down by dragging.

## Arranging

- **Drag** an object to move it
- **Click** it to bring it to the front
- **Shift-drag**, or drag the small circle at its bottom-right corner, to resize
- Press **L** to copy the current arrangement to your clipboard, then paste it
  over the `objects:` array in `site.ts` to make it permanent

Positions are stored as percentages, so a layout holds its proportions on
any screen size.
