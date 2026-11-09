import { useEffect, useRef } from "react";

/* -------------------------------------------------------------------------- */
/*     Origami paper plane — hand-rolled faceted 3D renderer on <canvas>      */
/* -------------------------------------------------------------------------- */

type V3 = [number, number, number];

// Each folded-paper form shares this mesh so its vertices can morph smoothly.
const shapes: V3[][] = [
  // Paper plane
  [
    [1.62, 0.04, 0], [-0.98, 0.2, 0], [-0.86, -0.46, -0.05], [-0.86, -0.46, 0.05],
    [-1.04, 0.3, -1.02], [-0.88, 0.06, -0.42], [-1.06, 0.02, -0.94],
    [-1.04, 0.3, 1.02], [-0.88, 0.06, 0.42], [-1.06, 0.02, 0.94],
  ],
  // Paper boat, with a pointed bow and folded hull
  [
    [1.38, 0.02, 0], [-1.15, 0.02, 0], [-0.70, -0.48, -0.28], [-0.70, -0.48, 0.28],
    [-0.24, 0.04, -0.94], [-0.90, 0.02, -0.58], [-0.46, 0.30, -0.72],
    [-0.24, 0.04, 0.94], [-0.90, 0.02, 0.58], [-0.46, 0.30, 0.72],
  ],
  // Origami crane, with a raised head and broad swept wings
  [
    [1.30, 0.48, 0], [-0.28, 0.04, 0], [-0.98, -0.28, -0.10], [-0.98, -0.28, 0.10],
    [-0.12, 0.22, -1.14], [-0.48, 0.02, -0.42], [-0.90, -0.14, -0.82],
    [-0.12, 0.22, 1.14], [-0.48, 0.02, 0.42], [-0.90, -0.14, 0.82],
  ],
];

const faces: number[][] = [
  [0, 4, 5], [0, 5, 1], [4, 6, 5],
  [0, 8, 7], [0, 1, 8], [7, 8, 9],
  [0, 1, 2], [0, 3, 1], [1, 3, 2],
];


function rotate(v: V3, ax: number, ay: number, az: number): V3 {
  let [x, y, z] = v;
  // Z (roll)
  let c = Math.cos(az), s = Math.sin(az);
  [x, y] = [x * c - y * s, x * s + y * c];
  // Y (yaw)
  c = Math.cos(ay); s = Math.sin(ay);
  [x, z] = [x * c + z * s, -x * s + z * c];
  // X (pitch)
  c = Math.cos(ax); s = Math.sin(ax);
  [y, z] = [y * c - z * s, y * s + z * c];
  return [x, y, z];
}

const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

export default function OrigamiObject({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // pointer target (-1..1)
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      // track pointer anywhere in the hero-sized neighbourhood for a lively feel
      target.x = Math.max(-1.4, Math.min(1.4, ((e.clientX - (r.left + r.width / 2)) / (r.width || 1)) * 2));
      target.y = Math.max(-1.2, Math.min(1.2, ((e.clientY - (r.top + r.height / 2)) / (r.height || 1)) * 2));
    };
    const onLeave = () => { target.x = 0; target.y = 0; };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const light: V3 = (() => {
      const l: V3 = [-0.45, 0.8, 0.6];
      const m = Math.hypot(l[0], l[1], l[2]);
      return [l[0] / m, l[1] / m, l[2] / m];
    })();

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 1 / 60;
      cur.x += (target.x - cur.x) * 0.055;
      cur.y += (target.y - cur.y) * 0.055;

      const drift = reduce ? 0 : 1;
      const ay = cur.x * 0.9 + Math.sin(t) * 0.28 * drift;
      const ax = -cur.y * 0.55 + Math.sin(t * 0.8 + 1) * 0.12 * drift - 0.1;
      const az = cur.x * -0.12 + Math.sin(t * 0.6) * 0.05 * drift;

      const progress = reduce ? 0 : (t % 9) / 3;
      const shapeIndex = Math.floor(progress);
      const nextShapeIndex = (shapeIndex + 1) % shapes.length;
      const morph = reduce ? 0 : (1 - Math.cos(Math.PI * (progress - shapeIndex))) / 2;
      const vertices = shapes[shapeIndex].map((point, index) => {
        const next = shapes[nextShapeIndex][index];
        return [
          point[0] + (next[0] - point[0]) * morph,
          point[1] + (next[1] - point[1]) * morph,
          point[2] + (next[2] - point[2]) * morph,
        ] as V3;
      });

      const scale = Math.min(W, H) * 0.3;
      const cx = W / 2;
      const cy = H / 2;
      const camZ = 4.2;

      type Prepped = { pts: [number, number][]; depth: number; shade: number };
      const prepped: Prepped[] = [];

      for (const f of faces) {
        const r = f.map((index) => rotate(vertices[index], ax, ay, az));
        const e1: V3 = [r[1][0] - r[0][0], r[1][1] - r[0][1], r[1][2] - r[0][2]];
        const e2: V3 = [r[2][0] - r[0][0], r[2][1] - r[0][1], r[2][2] - r[0][2]];
        let n = cross(e1, e2);
        const nm = Math.hypot(n[0], n[1], n[2]) || 1;
        n = [n[0] / nm, n[1] / nm, n[2] / nm];
        const lambert = Math.abs(n[0] * light[0] + n[1] * light[1] + n[2] * light[2]);

        const pts = r.map((v) => {
          const p = camZ / (camZ - v[2]);
          return [cx + v[0] * scale * p, cy - v[1] * scale * p] as [number, number];
        });
        const depth = (r[0][2] + r[1][2] + r[2][2]) / 3;
        prepped.push({ pts, depth, shade: lambert });
      }

      prepped.sort((a, b) => a.depth - b.depth);

      ctx.clearRect(0, 0, W, H);

      // soft ground shadow
      ctx.save();
      const g = ctx.createRadialGradient(cx, cy + scale * 1.05, 0, cx, cy + scale * 1.05, scale * 1.1);
      g.addColorStop(0, "rgba(3,12,36,0.45)");
      g.addColorStop(1, "rgba(3,12,36,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy + scale * 1.05, scale * 1.0, scale * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      for (const f of prepped) {
        const s = 0.34 + f.shade * 0.66;
        const rr = Math.round(238 * s + 12);
        const gg = Math.round(240 * s + 16);
        const bb = Math.round(246 * s + 30);
        ctx.beginPath();
        ctx.moveTo(f.pts[0][0], f.pts[0][1]);
        for (let i = 1; i < f.pts.length; i++) ctx.lineTo(f.pts[i][0], f.pts[i][1]);
        ctx.closePath();
        ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(9,26,66,0.28)";
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.14),transparent_65%)]" />
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
