/**
 * Peel geometry.
 *
 * A real page turn is a reflection. Given the page's bottom-right corner P
 * and wherever the reader has dragged that corner to (C), the crease is the
 * perpendicular bisector of P–C. Everything on P's side of the crease lifts
 * off and lands mirrored across it — that mirrored shape is the back of the
 * paper you can see.
 *
 * So there are three shapes per frame:
 *   keep  — the part of the page still lying flat (clips the live page)
 *   flap  — the lifted corner, drawn as the paper's reverse
 *   crease — the line between them, where the shadow goes
 *
 * The crease is drawn as a shallow curve rather than a straight cut so the
 * fold reads as a curl. Both shapes bow by the same amount and the flap sits
 * on top, so the overlap hides the seam.
 */

export type Pt = { x: number; y: number };

export type Peel = {
  keepPath: string;
  flapPath: string;
  creasePath: string;
  /** Unit vector from the crease toward the lifted corner — shades the flap. */
  normal: Pt;
  /** Midpoint of the crease, for positioning gradients. */
  mid: Pt;
  /** 0 at rest, 1 when the corner has been pulled a full page width. */
  progress: number;
};

const EPS = 0.5;

function sub(a: Pt, b: Pt): Pt {
  return { x: a.x - b.x, y: a.y - b.y };
}

function norm(v: Pt): Pt {
  const l = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / l, y: v.y / l };
}

/** Signed distance from the crease; positive on the lifting side. */
function side(p: Pt, m: Pt, n: Pt) {
  return (p.x - m.x) * n.x + (p.y - m.y) * n.y;
}

function reflect(p: Pt, m: Pt, n: Pt): Pt {
  const d = side(p, m, n);
  return { x: p.x - 2 * d * n.x, y: p.y - 2 * d * n.y };
}

/** Sutherland–Hodgman against a single half-plane. */
function clipHalf(poly: Pt[], m: Pt, n: Pt, keepPositive: boolean): Pt[] {
  const inside = (p: Pt) => (keepPositive ? side(p, m, n) >= 0 : side(p, m, n) <= 0);
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const ain = inside(a);
    const bin = inside(b);
    if (ain) out.push(a);
    if (ain !== bin) {
      const fa = side(a, m, n);
      const fb = side(b, m, n);
      const t = fa / (fa - fb);
      out.push({ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
    }
  }
  return out;
}

/**
 * Walk a polygon into path data, bowing the one edge that lies along the
 * crease so the fold curves instead of breaking.
 */
function toPath(poly: Pt[], m: Pt, n: Pt, bulge: number): string {
  if (poly.length < 3) return "";
  let d = `M ${poly[0].x.toFixed(2)} ${poly[0].y.toFixed(2)}`;
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const onCrease = Math.abs(side(a, m, n)) < EPS && Math.abs(side(b, m, n)) < EPS;
    if (onCrease && bulge > 0.5) {
      const cx = (a.x + b.x) / 2 + n.x * bulge;
      const cy = (a.y + b.y) / 2 + n.y * bulge;
      d += ` Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    } else {
      d += ` L ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    }
  }
  return `${d} Z`;
}

/** The two points where the crease crosses the page edge. */
function creaseEnds(poly: Pt[], m: Pt, n: Pt): Pt[] {
  return poly.filter((p) => Math.abs(side(p, m, n)) < EPS);
}

/**
 * @param w page width
 * @param h page height
 * @param c where the bottom-right corner has been dragged to
 */
export function peelFrom(w: number, h: number, c: Pt): Peel | null {
  const P: Pt = { x: w, y: h };
  const d = sub(P, c);
  const dist = Math.hypot(d.x, d.y);
  if (dist < 2) return null;

  const n = norm(d);
  const mid: Pt = { x: (P.x + c.x) / 2, y: (P.y + c.y) / 2 };
  const rect: Pt[] = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];

  const lifted = clipHalf(rect, mid, n, true);
  if (lifted.length < 3) return null;
  const kept = clipHalf(rect, mid, n, false);

  // The curl deepens as the corner comes away, then settles.
  const bulge = Math.min(30, dist * 0.09);

  const flap = lifted.map((p) => reflect(p, mid, n));
  const ends = creaseEnds(lifted, mid, n);
  const creasePath =
    ends.length >= 2
      ? `M ${ends[0].x.toFixed(2)} ${ends[0].y.toFixed(2)} Q ${(
          (ends[0].x + ends[1].x) / 2 +
          n.x * bulge
        ).toFixed(2)} ${((ends[0].y + ends[1].y) / 2 + n.y * bulge).toFixed(2)} ${ends[1].x.toFixed(
          2
        )} ${ends[1].y.toFixed(2)}`
      : "";

  return {
    keepPath: toPath(kept, mid, n, bulge),
    flapPath: toPath(flap, mid, n, bulge),
    creasePath,
    normal: n,
    mid,
    progress: Math.min(1, Math.max(0, (w - c.x) / w)),
  };
}

/** Where the corner ends up on a completed turn — off the left edge. */
export function restingCorner(w: number, h: number): Pt {
  return { x: -w * 0.28, y: h * 0.42 };
}
