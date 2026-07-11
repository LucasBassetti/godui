// Generates a 360° rotation of a shaded cube as SVG data-URL frames, so the
// SpinViewer story is fully self-contained (no binary assets). In real usage you
// pass an ordered array of product photo / render URLs instead.

type Vec = [number, number, number];

const V: Vec[] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];
const F: number[][] = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4, 7, 3],
  [1, 5, 6, 2],
  [3, 7, 6, 2],
  [0, 4, 5, 1],
];

const rotY = ([x, y, z]: Vec, a: number): Vec => [
  x * Math.cos(a) + z * Math.sin(a),
  y,
  -x * Math.sin(a) + z * Math.cos(a),
];
const rotX = ([x, y, z]: Vec, a: number): Vec => [
  x,
  y * Math.cos(a) - z * Math.sin(a),
  y * Math.sin(a) + z * Math.cos(a),
];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a: Vec, b: Vec): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: Vec): Vec => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

const SIZE = 240;
const C = SIZE / 2;
const S = 52;
const TILT = -0.42;
const LIGHT = norm([-0.4, 0.72, 0.62]);

function frame(angle: number): string {
  const p = V.map((v) => rotX(rotY(v, angle), TILT));
  const faces = F.map((f) => {
    const a = p[f[0]];
    const b = p[f[1]];
    const c = p[f[2]];
    const n = norm(cross(sub(b, a), sub(c, a)));
    const raw = dot(n, LIGHT);
    const intensity = Math.max(0.18, raw < 0 ? -raw * 0.55 : raw);
    const lightness = Math.round(26 + intensity * 44);
    const avgZ = f.reduce((s, i) => s + p[i][2], 0) / f.length;
    const points = f
      .map(
        (i) =>
          `${(C + p[i][0] * S).toFixed(1)},${(C - p[i][1] * S).toFixed(1)}`,
      )
      .join(" ");
    return { avgZ, points, fill: `hsl(214 78% ${lightness}%)` };
  }).sort((x, y) => x.avgZ - y.avgZ);

  const polys = faces
    .map(
      (fc) =>
        `<polygon points='${fc.points}' fill='${fc.fill}' stroke='hsl(214 82% 15%)' stroke-width='1' stroke-linejoin='round'/>`,
    )
    .join("");

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}' viewBox='0 0 ${SIZE} ${SIZE}'><ellipse cx='${C}' cy='${SIZE - 34}' rx='70' ry='12' fill='hsl(214 40% 12% / 0.28)'/>${polys}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function makeCubeFrames(count = 48): string[] {
  return Array.from({ length: count }, (_, i) =>
    frame((i / count) * Math.PI * 2),
  );
}
