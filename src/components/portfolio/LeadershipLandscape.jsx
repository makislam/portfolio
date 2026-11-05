import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { LeadershipDetail } from '@/components/portfolio/LeadershipPins';

// Ink-and-watercolour landscape where each part of life is a spot in the scene, marked by a pin.
// Items are matched to spots by their `scene` key: cadets, church, fellowship, mecha, frisbee.
// Ink line work and pencil hatching carry the drawing; loose watercolour washes add colour in places.
// Light comes from the upper left, so right-facing faces are hatched and washed slate.
// All the "random" texture comes from a seeded generator, so the drawing never changes.

const INK = '#2B2622';
const PAPER = '#F7F3EA';
const RUST = '#C8553D';
const W = 1200;
const H = 640;

// Watercolour pigments
const P = {
  sky: '#7FB3D5',
  gold: '#E2A04A',
  slate: '#8C9AB0',
  mutedLit: '#D8BC8E',
  mutedShade: '#9EA9BA',
  ice: '#9DB9D4',
  cloudShade: '#B7B3C4',
  back: '#C4B45E',
  mid: '#B5B552',
  front: '#D9A84E',
  river: '#3AA8C4',
  rock: '#B9B2A6',
};
const AUTUMN = ['#D9822B', '#C4492F', '#E3B23C', '#8D74B8', '#D9822B', '#E3B23C', '#A9B04E', '#C4492F'];

// ---------- seeded texture ----------

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261105);
const rr = (a, b) => a + rand() * (b - a);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const f = (n) => n.toFixed(1);

const bbox = (d) => {
  const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

// Irregular parallel strokes across a box; clip them to a face to shade it.
function hatchLines([x0, y0, x1, y1], angle, gap, trim = 0.35) {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const R = Math.hypot(x1 - x0, y1 - y0) / 2;
  const a = (angle * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  let d = '';
  for (let t = -R; t <= R; t += gap * rr(0.7, 1.3)) {
    const px = cx - dy * t;
    const py = cy + dx * t;
    const s0 = -R + rand() * trim * R;
    const s1 = R - rand() * trim * R;
    const seg = (u, v) => `M${f(px + dx * u)} ${f(py + dy * u)}L${f(px + dx * v)} ${f(py + dy * v)}`;
    if (rand() < 0.3) {
      const cut = rr(s0, s1);
      d += seg(s0, cut - 3) + seg(cut + 4, s1);
    } else d += seg(s0, s1);
  }
  return d;
}

// ---------- terrain ----------

// Rolling hills as functions so buildings, shrubs and shading follow the ground.
// The back hill dips in the middle to open a valley under the glacier.
const backHill = (x) => 400 + 10 * Math.sin(x / 140) + 6 * Math.sin(x / 53 + 1) + 46 * Math.exp(-(((x - 740) / 170) ** 2));
const midHill = (x) => 468 + 9 * Math.sin(x / 170 + 2) + 4 * Math.sin(x / 61);
const frontHill = (x) => 562 + 12 * Math.sin(x / 210 + 0.5) + 5 * Math.sin(x / 77 + 2);

const crest = (fn, dy = 0) => {
  let d = `M0 ${f(fn(0) + dy)}`;
  for (let x = 20; x <= W; x += 20) d += ` L${x} ${f(fn(x) + dy)}`;
  return d;
};
const band = (fn, depth) => {
  let d = crest(fn);
  for (let x = W; x >= 0; x -= 20) d += ` L${x} ${f(fn(x) + depth * (0.65 + 0.35 * Math.sin(x / 90)))}`;
  return `${d} Z`;
};
const lowestGround = (fn, x0, x1) => {
  let y = -Infinity;
  for (let x = x0; x <= x1; x += 4) y = Math.max(y, fn(x));
  return y + 3;
};

function hillDetail(fn, depth, tufts) {
  let shade = '';
  for (let x = 8; x < W; x += 5) {
    const slope = fn(x + 4) - fn(x - 4);
    if (slope <= 0.4) continue;
    const y = fn(x) + rr(2, 5);
    const len = Math.min(22, 4 + slope * rr(4, 7));
    shade += `M${f(x)} ${f(y)}l${f(-len * 0.35)} ${f(len)}`;
  }
  let grass = '';
  for (let i = 0; i < tufts; i++) {
    const x = rr(0, W);
    const y = fn(x) + rr(6, depth);
    const k = rr(0.5, 1.1);
    grass += `M${f(x)} ${f(y)}l${f(-2.5 * k)} ${f(-5 * k)}M${f(x)} ${f(y)}l${f(rr(-1, 1))} ${f(-7 * k)}`;
    if (rand() < 0.6) grass += `M${f(x)} ${f(y)}l${f(3 * k)} ${f(-4.5 * k)}`;
  }
  let contours = '';
  for (let i = 0; i < 4; i++) {
    const x0 = rr(0, W - 260);
    const len = rr(140, 280);
    const dy = rr(14, depth - 6);
    contours += `M${f(x0)} ${f(fn(x0) + dy)}`;
    for (let x = x0 + 16; x <= x0 + len; x += 16) contours += ` L${f(x)} ${f(fn(x) + dy + Math.sin(x / 30) * 1.5)}`;
  }
  return { shade, grass, contours };
}
const HILLS = {
  back: hillDetail(backHill, 50, 26),
  mid: hillDetail(midHill, 80, 40),
  front: hillDetail(frontHill, 70, 44),
};

function forest(fn, x0, x1, n, s0, s1) {
  return Array.from({ length: n }, () => {
    const x = rr(x0, x1);
    return { x, y: fn(x) + rr(0, 8), s: rr(s0, s1) };
  }).sort((a, b) => a.y - b.y);
}
const FORESTS = {
  back: [...forest(backHill, 372, 470, 9, 0.4, 0.6), ...forest(backHill, 1110, 1195, 6, 0.45, 0.65)],
  mid: [...forest(midHill, 815, 875, 7, 0.6, 1), ...forest(midHill, 0, 110, 6, 0.7, 1), ...forest(midHill, 1120, 1200, 4, 0.7, 0.95)],
  front: [...forest(frontHill, 30, 210, 8, 1, 1.5), ...forest(frontHill, 1055, 1195, 8, 1, 1.5)],
};

// Autumn shrubs: a watercolour blob cluster with a scribbled ink crown.
function shrubs(fn, ranges, n, dy0, dy1, r0, r1) {
  return Array.from({ length: n }, () => {
    const [a, b] = pick(ranges);
    const x = rr(a, b);
    const r = rr(r0, r1);
    return {
      x,
      y: fn(x) + rr(dy0, dy1),
      r,
      c: pick(AUTUMN),
      blobs: Array.from({ length: 6 }, () => [rr(-r * 0.7, r * 0.7), rr(-r * 0.6, r * 0.1), rr(r * 0.4, r * 0.7)]),
    };
  }).sort((p, q) => p.y - q.y);
}
const SHRUBS = {
  mid: shrubs(midHill, [[0, 40], [390, 550], [700, 760], [1100, 1200]], 16, 18, 60, 5, 9),
  front: shrubs(frontHill, [[10, 255], [560, 705], [790, 1190]], 34, 24, 80, 12, 22),
};
const shrubInk = (list) =>
  list
    .map(({ x, y, r }) => {
      const b = (2 * r) / 3;
      return `M${f(x - r)} ${f(y)} a${f(b / 2)} ${f(b / 2)} 0 0 1 ${f(b)} ${f(-rr(0, 3))} a${f(b / 2)} ${f(b / 2)} 0 0 1 ${f(b)} ${f(rr(-2, 2))} a${f(b / 2)} ${f(b / 2)} 0 0 1 ${f(b)} ${f(rr(0, 3))} M${f(x - r * 0.3)} ${f(y - r * 0.4)} l2 -2 M${f(x + r * 0.3)} ${f(y - r * 0.2)} l2 -2 M${f(x - r * 0.8)} ${f(y + 2)} H${f(x + r * 0.8)}`;
    })
    .join(' ');

// River from the glacier down through the valley, widening as it comes forward.
const RIVER_PTS = [
  [764, 424, 2], [770, 440, 3], [778, 456, 4], [772, 472, 5], [786, 490, 6], [804, 506, 7], [800, 522, 8],
  [778, 536, 10], [752, 552, 12], [736, 572, 14], [730, 592, 17], [738, 614, 20], [752, 646, 26],
];
const RIVER = (() => {
  const L = [];
  const R = [];
  RIVER_PTS.forEach(([x, y, w], i) => {
    const [ax, ay] = RIVER_PTS[Math.max(0, i - 1)];
    const [bx, by] = RIVER_PTS[Math.min(RIVER_PTS.length - 1, i + 1)];
    const m = Math.hypot(bx - ax, by - ay);
    const nx = -(by - ay) / m;
    const ny = (bx - ax) / m;
    L.push([x + (nx * w) / 2, y + (ny * w) / 2]);
    R.push([x - (nx * w) / 2, y - (ny * w) / 2]);
  });
  const line = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ');
  return {
    area: `${line(L)} ${line([...R].reverse()).replace('M', 'L')} Z`,
    banks: `${line(L)} ${line(R)}`,
    glints: RIVER_PTS.slice(4).map(([x, y, w]) => `M${f(x - w * 0.2)} ${f(y)} h${f(w * 0.35)}`).join(' '),
  };
})();

// Vertical shift that sets each drawing (authored at a fixed base) onto its hill.
const SHIFT = {
  church: lowestGround(backHill, 40, 360) - 420,
  fellowship: lowestGround(midHill, 558, 702) - 482,
  mecha: lowestGround(midHill, 888, 1094) - 464,
  frisbee: 0,
  cadets: 0,
};

// Pin tip for each spot, in scene units before SHIFT.
const PINS = {
  cadets: { x: 232, y: 82 },
  church: { x: 230, y: 226 },
  fellowship: { x: 630, y: 322 },
  mecha: { x: 960, y: 378 },
  frisbee: { x: 452, y: 486 },
};

// ---------- the granite range ----------

// Each spire: outline, shadowed (right) face, ridge between them, granite cracks, snow ledges.
// `muted` spires sit further back and get softer washes.
const TEETH =
  'M790 430 L800 360 L812 320 L822 290 L830 252 L838 236 L846 258 L852 240 L860 222 L868 246 L876 272 L884 250 L892 232 L900 252 L910 280 L920 262 L930 270 L944 300 L958 286 L972 304 L990 330 L1010 352 L1040 380 L1080 410 L1100 430 Z';
const TOOTH_TIPS = [[838, 236], [860, 222], [892, 232], [930, 270], [958, 286]];
const SPIRES = [
  {
    id: 'far',
    muted: true,
    d: 'M380 430 L404 372 L420 330 L432 306 L440 290 L456 262 L466 270 L476 296 L486 320 L502 350 L520 380 L540 430 Z',
    shadow: 'M456 262 L466 270 L476 296 L486 320 L502 350 L520 380 L540 430 L490 430 L478 370 L466 310 Z',
    ridge: 'M456 262 L466 310 L478 370 L490 430',
    cracks: 'M440 300 L432 360 M448 290 L444 330 M420 340 L414 380',
    snow: 'M478 320 l6 16 M492 360 l6 14',
  },
  {
    id: 'teeth',
    muted: true,
    d: TEETH,
    shadow: TEETH,
    lit: TOOTH_TIPS.map(([x, y]) => `M${x - 9} ${y + 16} L${x} ${y} L${x - 2} ${y + 72} L${x - 13} ${y + 72} Z`).join(' '),
    ridge: TOOTH_TIPS.map(([x, y]) => `M${x} ${y} L${x - 2} ${y + 100}`).join(' '),
    cracks: 'M846 258 L848 330 M868 246 L870 320 M876 272 L874 340 M910 280 L912 350 M944 300 L946 360 M972 304 L974 370 M1000 340 L1004 390',
    snow: 'M846 290 l-2 24 M872 290 l2 20 M900 290 l-2 26 M940 320 l4 20 M980 340 l6 18 M1020 372 l8 12',
  },
  {
    // Broad granite needle with a stepped, notched profile
    id: 'needle',
    d: 'M512 430 L518 384 L526 336 L532 300 L538 296 L544 262 L552 226 L560 200 L566 196 L572 172 L580 156 L588 150 L594 154 L598 166 L604 176 L608 196 L614 228 L618 236 L624 270 L630 316 L636 370 L644 430 Z',
    shadow: 'M588 150 L594 154 L598 166 L604 176 L608 196 L614 228 L618 236 L624 270 L630 316 L636 370 L644 430 L604 430 L598 360 L594 290 L590 220 Z',
    ridge: 'M588 150 L590 220 L594 290 L598 360 L604 430',
    cracks: 'M556 220 L550 290 L546 370 M568 190 L566 260 L570 340 M540 300 L536 380 M580 200 L578 280 M560 320 L564 400 M614 260 L618 340',
    snow: 'M596 200 l4 24 M604 268 l5 22 M612 330 l4 18 M532 304 l8 -2 M562 202 l6 -2',
  },
  {
    id: 'small1',
    d: 'M620 430 L626 380 L632 330 L636 300 L642 270 L646 252 L652 244 L656 250 L660 262 L664 280 L670 330 L676 430 Z',
    shadow: 'M652 244 L656 250 L660 262 L664 280 L670 330 L676 430 L660 430 L656 330 Z',
    ridge: 'M652 244 L656 330 L660 430',
    cracks: 'M640 290 L636 360 M646 320 L644 400',
    snow: 'M662 300 l3 18',
  },
  {
    // Main massif: steep left wall, blocky summit, a shoulder on the right
    id: 'main',
    d: 'M650 430 L656 384 L662 330 L668 290 L674 262 L682 230 L692 196 L700 166 L708 140 L716 116 L724 100 L732 92 L740 88 L750 90 L758 98 L764 112 L770 134 L776 162 L782 192 L788 206 L798 212 L806 218 L812 236 L818 270 L824 316 L830 370 L838 430 Z',
    shadow:
      'M740 88 L750 90 L758 98 L764 112 L770 134 L776 162 L782 192 L788 206 L798 212 L806 218 L812 236 L818 270 L824 316 L830 370 L838 430 L770 430 L762 360 L756 290 L750 220 L746 150 Z',
    ridge: 'M740 88 L746 150 L750 220 L756 290 L762 360 L770 430',
    cracks:
      'M704 160 L698 230 L692 300 L688 380 M718 128 L714 200 L716 280 M682 262 L676 340 M730 200 L732 280 L736 360 M704 310 L708 400 M690 220 l-6 30 M722 330 l4 50 M794 260 L800 340 M810 300 L814 380 M784 220 L786 280',
    snow: 'M752 130 l6 22 M760 196 l8 30 M772 250 l6 24 M784 300 l8 26 M766 350 l6 24 M716 260 l-4 14 M800 228 l4 14 M688 232 l10 -3 M706 176 l9 -3 M676 320 l12 -3',
  },
].map((s) => ({
  ...s,
  tone: {
    lit: hatchLines(bbox(s.d), 76, 8, 0.6),
    shadow: hatchLines(bbox(s.shadow), 78, s.muted ? 4.2 : 3) + (s.muted ? '' : hatchLines(bbox(s.shadow), -32, 5, 0.6)),
  },
}));

const GLACIER_TOP =
  'M460 430 C500 404 540 396 580 392 C620 388 640 376 680 380 C720 384 760 372 800 376 C860 380 920 372 980 386 C1030 396 1070 410 1100 430';
const GLACIER = `${GLACIER_TOP} L1100 480 L460 480 Z`;
const DISTANT_L = 'M0 382 L50 344 L80 352 L130 306 L160 318 L200 286 L240 316 L280 300 L330 330 L380 318 L420 360 L420 420 L0 420 Z';
const DISTANT_R = 'M1040 340 L1090 300 L1110 308 L1150 282 L1200 310 L1200 420 L1040 420 Z';
const DISTANT_TONE = hatchLines([0, 280, 1200, 420], -60, 7, 0.5);

// Cumulus: billowing arcs that pile up towards the middle, a flat base, and inner billow lines.
function cloud(x, y, w, h) {
  let top = `M${x} ${y}`;
  let inner = '';
  let cx = x;
  while (cx < x + w) {
    const r = rr(h * 0.22, h * 0.4);
    const nx = Math.min(cx + r * 1.3, x + w);
    const ny = y - h * Math.sin((Math.PI * (nx - x)) / w) * rr(0.65, 1);
    top += ` A${f(r)} ${f(r)} 0 0 1 ${f(nx)} ${f(ny)}`;
    if (rand() < 0.5 && nx < x + w - 10) inner += `M${f(nx)} ${f(ny)} q${f(-r * 0.2)} ${f(r * 0.5)} ${f(r * 0.3)} ${f(r * 0.9)}`;
    cx = nx;
  }
  const area = `${top} L${x + w} ${y + h * 0.1} C${x + w * 0.7} ${y + h * 0.2} ${x + w * 0.3} ${y + h * 0.2} ${x} ${y + h * 0.1} Z`;
  return { top, inner, area, base: [x + w / 2, y + h * 0.02, w * 0.4, h * 0.22] };
}
const CLOUDS = [cloud(270, 236, 300, 90), cloud(820, 238, 340, 100), cloud(40, 74, 200, 54), cloud(530, 92, 240, 62), cloud(1000, 92, 160, 46)];

// ---------- component ----------

export default function LeadershipLandscape({ items }) {
  const [hovered, setHovered] = useState(null);
  const [openKey, setOpenKey] = useState(null);
  const byScene = Object.fromEntries(items.map((i) => [i.scene, i]));
  const close = useCallback(() => setOpenKey(null), []);

  const spot = (key) => ({
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered(null),
    onClick: () => setOpenKey(key),
    style: {
      cursor: 'pointer',
      transformBox: 'fill-box',
      transformOrigin: '50% 100%',
      transition: 'transform 0.25s ease',
      transform: hovered === key ? 'translateY(-5px) scale(1.05)' : 'none',
    },
  });

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl border shadow-md dark:brightness-90"
        style={{ borderColor: INK, background: PAPER }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Ink and watercolour sketch of a landscape with places from my life">
          <defs>
            {/* Wobbles every line slightly so it reads as hand-drawn */}
            <filter id="ll-sketch" x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" />
              <feDisplacementMap in="SourceGraphic" scale="1.1" />
            </filter>
            {/* Loose, bleeding edges for the watercolour washes */}
            <filter id="ll-wash" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="3" seed="2" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d" />
              <feGaussianBlur in="d" stdDeviation="0.5" />
            </filter>
            <filter id="ll-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="9" />
              <feColorMatrix values="0 0 0 0 0.17  0 0 0 0 0.15  0 0 0 0 0.13  0 0 0 0.1 0" />
            </filter>
            <Hatch id="ll-hatch" gap={3.2} angle={-35} width={0.9} />
            <Hatch id="ll-hatch-x" gap={3.6} angle={30} width={0.8} />
            <Hatch id="ll-hatch-light" gap={5.5} angle={-35} width={0.7} />
            <clipPath id="ll-clip-distant">
              <path d={`${DISTANT_L} ${DISTANT_R}`} />
            </clipPath>
            {SPIRES.map((s) => (
              <React.Fragment key={s.id}>
                <clipPath id={`ll-clip-${s.id}`}>
                  <path d={s.d} />
                </clipPath>
                <clipPath id={`ll-clip-${s.id}-s`}>
                  <path d={s.shadow} />
                </clipPath>
              </React.Fragment>
            ))}
          </defs>

          <rect width={W} height={H} fill={PAPER} />

          <g filter="url(#ll-sketch)" stroke={INK} strokeLinejoin="round" strokeLinecap="round" fill="none">
            {/* Sky: a loose blue wash with cumulus left as paper */}
            <Wash opacity={0.38}>
              <path
                d="M0 0 H1200 V220 C1100 250 1000 200 900 236 C800 214 700 256 600 226 C500 246 400 212 300 244 C200 222 100 258 0 236 Z"
                fill={P.sky}
              />
            </Wash>
            <Wash opacity={0.32}>
              <ellipse cx="420" cy="70" rx="260" ry="70" fill={P.sky} />
              <ellipse cx="960" cy="150" rx="220" ry="60" fill={P.sky} />
              <ellipse cx="140" cy="190" rx="160" ry="44" fill={P.sky} />
              <ellipse cx="1120" cy="40" rx="140" ry="40" fill="#5E97C4" />
            </Wash>
            {CLOUDS.map((c, i) => (
              <g key={i}>
                <path d={c.area} fill={PAPER} stroke="none" />
                <Wash opacity={0.45}>
                  <ellipse cx={c.base[0]} cy={c.base[1]} rx={c.base[2]} ry={c.base[3]} fill={P.cloudShade} />
                </Wash>
                <path d={c.top} strokeWidth="0.9" opacity="0.75" />
                <path d={c.inner} strokeWidth="0.6" opacity="0.45" />
              </g>
            ))}
            {/* Condor */}
            <path
              d="M1040 142 C1052 134 1062 134 1070 140 C1078 134 1090 132 1104 138 C1092 140 1082 144 1074 150 L1070 154 L1066 150 C1058 144 1050 142 1040 142 Z"
              fill={INK}
              stroke="none"
              opacity="0.85"
            />
            <g strokeWidth="1.1">
              <path d="M470 160 q7 -7 14 0 q7 -7 14 0" />
              <path d="M500 140 q5 -5 10 0 q5 -5 10 0" />
            </g>

            {/* Distant ranges */}
            <g opacity="0.5">
              <path d={`${DISTANT_L} ${DISTANT_R}`} fill={PAPER} stroke="none" />
              <Wash opacity={0.6}>
                <path d={`${DISTANT_L} ${DISTANT_R}`} fill={P.mutedShade} />
              </Wash>
              <path d={DISTANT_TONE} clipPath="url(#ll-clip-distant)" strokeWidth="0.5" opacity="0.6" />
              <path d={`${DISTANT_L} ${DISTANT_R}`} strokeWidth="1" />
            </g>

            {/* Granite spires */}
            {SPIRES.map((s) => (
              <g key={s.id}>
                <path d={s.d} fill={PAPER} stroke="none" />
                <Wash opacity={s.muted ? 0.45 : 0.5}>
                  {!s.lit && <path d={s.d} fill={s.muted ? P.mutedLit : P.gold} />}
                  <path d={s.shadow} fill={s.muted ? P.mutedShade : P.slate} />
                  {s.lit && <path d={s.lit} fill={P.mutedLit} />}
                </Wash>
                {!s.lit && <path d={s.tone.lit} clipPath={`url(#ll-clip-${s.id})`} strokeWidth="0.5" opacity="0.45" />}
                <path d={s.tone.shadow} clipPath={`url(#ll-clip-${s.id}-s)`} strokeWidth="0.75" opacity={s.muted ? 0.65 : 0.9} />
                <path d={s.snow} stroke="#FFFFFF" strokeWidth="2.4" opacity="0.9" />
                <path d={s.cracks} strokeWidth="0.8" opacity="0.75" />
                <path d={s.d} strokeWidth={s.muted ? 1.5 : 2.1} />
                <path d={s.ridge} strokeWidth={s.muted ? 1.1 : 1.7} />
              </g>
            ))}

            {/* Glacier */}
            <path d={GLACIER} fill={PAPER} stroke="none" />
            <Wash opacity={0.5}>
              <ellipse cx="560" cy="414" rx="44" ry="10" fill={P.ice} />
              <ellipse cx="790" cy="404" rx="64" ry="12" fill={P.ice} />
              <ellipse cx="960" cy="410" rx="54" ry="10" fill={P.ice} />
              <ellipse cx="680" cy="392" rx="30" ry="7" fill={P.ice} />
            </Wash>
            <path d={GLACIER_TOP} strokeWidth="1.3" />
            <path
              d="M520 410 q20 -6 40 0 M600 400 q16 -5 30 0 M700 396 q14 -4 28 0 M820 392 q22 -6 44 0 M900 400 q18 -5 36 0 M980 404 q14 -4 28 0 M760 410 q12 -3 24 0 M640 412 q10 -3 20 0"
              strokeWidth="0.8"
              opacity="0.7"
            />

            {/* Back hill, its trees, and the town */}
            <Hill fn={backHill} detail={HILLS.back} tint={P.back} depth={46} />
            {FORESTS.back.map((t, i) => (
              <Pine key={i} {...t} />
            ))}
            <g transform={`translate(0 ${SHIFT.church})`} strokeWidth="1.3">
              <Building x={50} y={348} w={40} h={72} rows={3} top="tank" tint="#EFE1CC" />
              <Building x={90} y={318} w={36} h={102} rows={4} top="antenna" door tint="#E2E6E3" />
              <Building x={126} y={362} w={44} h={58} rows={2} door tint="#F1DCCB" />
              <Building x={280} y={336} w={38} h={84} rows={3} top="antenna" door tint="#E2E6E3" />
              <Building x={318} y={366} w={34} h={54} rows={2} top="tank" tint="#EFE1CC" />
            </g>

            {/* Church */}
            <g transform={`translate(0 ${SHIFT.church})`}>
              <g {...spot('church')}>
                <rect x="220" y="280" width="20" height="40" fill={PAPER} strokeWidth="1.5" />
                <rect x="233" y="282" width="7" height="38" fill="url(#ll-hatch-light)" stroke="none" />
                <path d="M225 304 V294 A5 5 0 0 1 235 294 V304 Z" fill="url(#ll-hatch-x)" strokeWidth="1" />
                <path d="M216 282 L230 250 L244 282 Z" fill="#AFBCCF" strokeWidth="1.5" />
                <path d="M230 250 L244 282 L230 282 Z" fill="url(#ll-hatch)" stroke="none" />
                <path d="M230 250 V232 M224 239 H236" strokeWidth="1.9" />
                <rect x="198" y="340" width="64" height="80" fill={PAPER} strokeWidth="1.5" />
                <rect x="244" y="344" width="18" height="76" fill="url(#ll-hatch-light)" stroke="none" />
                <path d="M200 352 h6 M210 362 h7 M202 396 h6 M212 408 h6 M248 352 h6 M250 392 h6" strokeWidth="0.6" opacity="0.6" />
                <path d="M192 344 L230 310 L268 344 Z" fill="#E4A68C" strokeWidth="1.5" />
                <path d="M230 310 L268 344 L230 344 Z" fill="url(#ll-hatch)" stroke="none" />
                <circle cx="230" cy="358" r="6.5" fill="#D9E3EC" strokeWidth="1.2" />
                <path d="M223.5 358 H236.5 M230 351.5 V364.5 M225.4 353.4 L234.6 362.6 M234.6 353.4 L225.4 362.6" strokeWidth="0.6" />
                <path d="M221 420 V400 A9 9 0 0 1 239 400 V420" fill="url(#ll-hatch-x)" strokeWidth="1.3" />
                <path d="M230 391 V420" strokeWidth="0.7" />
                <path d="M205 388 V376 A4.5 4.5 0 0 1 214 376 V388 Z M246 388 V376 A4.5 4.5 0 0 1 255 376 V388 Z" fill="#D9E3EC" strokeWidth="1.1" />
                <path d="M216 420 H244 V424 H216 Z" fill={PAPER} strokeWidth="1" />
              </g>
            </g>

            {/* Middle hill */}
            <Hill fn={midHill} detail={HILLS.mid} tint={P.mid} depth={70} />
            {FORESTS.mid.map((t, i) => (
              <Pine key={i} {...t} />
            ))}
            <Shrubs list={SHRUBS.mid} />
            <Rock x={520} y={midHill(520) + 22} s={0.8} />

            {/* University (fellowship) */}
            <g transform={`translate(0 ${SHIFT.fellowship})`}>
              <g {...spot('fellowship')}>
                <path d="M630 342 V326" strokeWidth="1" />
                <path d="M630 327 l11 3.5 l-11 3.5 Z" fill={RUST} strokeWidth="0.8" />
                <rect x="618" y="360" width="24" height="34" fill={PAPER} strokeWidth="1.5" />
                <rect x="636" y="362" width="6" height="32" fill="url(#ll-hatch-light)" stroke="none" />
                <path d="M613 362 L630 342 L647 362 Z" fill="#E4A68C" strokeWidth="1.5" />
                <path d="M630 342 L647 362 L630 362 Z" fill="url(#ll-hatch)" stroke="none" />
                <circle cx="630" cy="376" r="5.5" fill={PAPER} strokeWidth="1.1" />
                <path d="M630 376 V372 M630 376 L633 378" strokeWidth="0.9" />
                <rect x="572" y="420" width="116" height="54" fill="#F1E6D2" strokeWidth="1.5" />
                <rect x="670" y="424" width="18" height="50" fill="url(#ll-hatch-light)" stroke="none" />
                {[582, 604, 626, 648, 670].map((x) => (
                  <g key={x}>
                    <rect x={x} y="426" width="8" height="46" fill={PAPER} strokeWidth="1" />
                    <rect x={x + 5} y="426" width="3" height="46" fill="url(#ll-hatch)" stroke="none" />
                    <path d={`M${x - 1} 426 h10 M${x - 1} 470 h10`} strokeWidth="0.8" />
                  </g>
                ))}
                <path d="M594 440 V462 h6 V440 Z M616 440 V462 h6 V440 Z M638 440 V462 h6 V440 Z M660 440 V462 h6 V440 Z" fill="url(#ll-hatch-x)" strokeWidth="0.7" />
                <path d="M562 423 L630 390 L698 423 Z" fill="#E4A68C" strokeWidth="1.5" />
                <path d="M630 390 L698 423 L630 423 Z" fill="url(#ll-hatch-light)" stroke="none" />
                <path d="M574 419 L630 394 L686 419" strokeWidth="0.6" />
                <circle cx="630" cy="410" r="4" fill={PAPER} strokeWidth="0.9" />
                <path d="M566 423 H694" strokeWidth="1" />
                <path d={Array.from({ length: 22 }, (_, i) => `M${572 + i * 5.3} 423 v3`).join('')} strokeWidth="0.6" />
                <path d="M558 472 H702 V482 H558 Z" fill={PAPER} strokeWidth="1.2" />
                <path d="M562 476 H698 M566 479 H694" strokeWidth="0.6" />
              </g>
            </g>

            {/* Arena + robot (Mecha Mayhem) */}
            <g transform={`translate(0 ${SHIFT.mecha})`}>
              <g {...spot('mecha')}>
                <rect x="895" y="420" width="130" height="44" fill="#F1E6D2" strokeWidth="1.5" />
                <rect x="992" y="423" width="33" height="41" fill="url(#ll-hatch-light)" stroke="none" />
                <path d="M888 423 Q960 358 1032 423 Z" fill="#B5D2D8" strokeWidth="1.5" />
                <path d="M960 391 Q996 396 1032 423 L960 423 Z" fill="url(#ll-hatch-light)" stroke="none" />
                <path d="M908 418 Q960 374 1012 418 M928 418 Q960 390 992 418" strokeWidth="0.8" />
                <path d="M912 416 L918 398 M936 412 L940 388 M960 410 V384 M984 412 L980 388 M1008 416 L1002 398" strokeWidth="0.6" opacity="0.7" />
                <rect x="920" y="425" width="80" height="10" fill="#E4A68C" strokeWidth="0.9" />
                <text x="960" y="432.6" textAnchor="middle" fontSize="6.6" letterSpacing="1.4" fill={INK} stroke="none" fontFamily="ui-sans-serif, system-ui">
                  MECHA MAYHEM
                </text>
                <path d="M903 442 h12 v8 h-12 Z M1005 442 h12 v8 h-12 Z" fill="#D9E3EC" strokeWidth="0.8" />
                <rect x="945" y="438" width="30" height="26" fill="url(#ll-hatch-x)" strokeWidth="1.2" />
                <path d="M960 438 V464" strokeWidth="0.7" />
                {/* robot */}
                <rect x="1050" y="446" width="10" height="16" rx="2" fill={PAPER} strokeWidth="1.1" />
                <rect x="1066" y="446" width="10" height="16" rx="2" fill="url(#ll-hatch)" strokeWidth="1.1" />
                <rect x="1046" y="424" width="34" height="26" rx="3" fill={PAPER} strokeWidth="1.5" />
                <rect x="1070" y="426" width="10" height="23" fill="url(#ll-hatch-light)" stroke="none" />
                <circle cx="1063" cy="437" r="3.5" fill={RUST} strokeWidth="1" />
                <rect x="1058" y="420" width="10" height="4" fill={PAPER} strokeWidth="0.9" />
                <rect x="1050" y="402" width="26" height="20" rx="3" fill="#F2C9A8" strokeWidth="1.5" />
                <circle cx="1058" cy="411" r="2.2" fill={INK} stroke="none" />
                <circle cx="1068" cy="411" r="2.2" fill={INK} stroke="none" />
                <path d="M1057 417 h12" strokeWidth="0.7" />
                <path d="M1063 402 V392" strokeWidth="1.2" />
                <circle cx="1063" cy="390" r="3" fill="#F2C14E" strokeWidth="1.1" />
                <path d="M1046 430 L1038 438 L1036 446 M1080 430 L1088 424 L1092 414" strokeWidth="2" />
              </g>
            </g>

            {/* Front hill */}
            <Hill fn={frontHill} detail={HILLS.front} tint={P.front} depth={64} />
            <Fence x0={800} x1={1020} />

            {/* Ultimate field, players and frisbee */}
            <g transform={`translate(0 ${SHIFT.frisbee})`}>
              <g {...spot('frisbee')}>
                <path d="M270 614 L540 614 L510 572 L300 572 Z" fill="#D3DCA4" strokeWidth="1.4" />
                <path d="M300 572 L326 572 L306 614 L270 614 Z M484 572 L510 572 L540 614 L504 614 Z" fill="url(#ll-hatch-light)" stroke="none" />
                <path
                  d={[582, 592, 603].map((y) => `M${f(300 - (30 * (y - 572)) / 42 + 4)} ${y} L${f(510 + (30 * (y - 572)) / 42 - 4)} ${y}`).join('')}
                  strokeWidth="0.5"
                  opacity="0.4"
                />
                <path d="M326 572 L306 614 M484 572 L504 614 M405 572 V614" strokeWidth="1" />
                <path d="M343 580 Q380 470 448 498" strokeWidth="1" strokeDasharray="4 6" />
                <Player x={336} y={598} pose="throw" />
                <Player x={474} y={606} pose="reach" />
                <Player x={418} y={590} pose="run" s={0.85} />
                <ellipse cx="452" cy="500" rx="20" ry="7" fill="#F2C14E" strokeWidth="1.5" />
                <path d="M432 500 Q452 512 472 500" fill="url(#ll-hatch)" strokeWidth="0.9" />
                <path d="M418 494 h-10 M420 502 h-14 M418 509 h-8" strokeWidth="0.6" opacity="0.6" />
              </g>
            </g>

            {FORESTS.front.map((t, i) => (
              <Pine key={i} {...t} />
            ))}

            {/* River from the glacier */}
            <path d={RIVER.area} fill={PAPER} stroke="none" />
            <Wash opacity={0.7}>
              <path d={RIVER.area} fill={P.river} />
            </Wash>
            <path d={RIVER.banks} strokeWidth="1" />
            <path d={RIVER.glints} stroke="#FFFFFF" strokeWidth="1.4" opacity="0.85" />
            <Rock x={706} y={frontHill(706) + 34} s={0.9} />
            <Rock x={782} y={frontHill(782) + 46} s={0.7} />
            <Rock x={990} y={frontHill(990) + 44} s={1.1} />

            <Shrubs list={SHRUBS.front} />

            {/* Plane (air cadets) */}
            <motion.g animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <g {...spot('cadets')}>
                <path d="M160 126 C110 132 70 120 20 136" strokeWidth="0.9" strokeDasharray="3 7" />
                <path d="M156 134 C120 140 90 134 50 146" strokeWidth="0.6" strokeDasharray="2 8" opacity="0.6" />
                <g transform="translate(232 122)">
                  <path d="M-60 0 L-72 -28 L-58 -28 L-40 -6 Z" fill="#E4A68C" strokeWidth="1.4" />
                  <path d="M-66 -14 L-62 -28 L-58 -28 L-48 -9 Z" fill="url(#ll-hatch)" stroke="none" />
                  <path d="M-62 0 C-40 -14 30 -14 55 -4 C62 0 62 6 55 8 C30 14 -40 10 -62 4 Z" fill={PAPER} strokeWidth="1.5" />
                  <path d="M-58 4 C-30 10 30 12 55 7 C40 11 -30 12 -58 6 Z" fill="url(#ll-hatch)" stroke="none" />
                  <path d="M-52 -1 H48 V2 H-52 Z" fill={RUST} stroke="none" opacity="0.85" />
                  <path d="M14 -9 L34 -8 L40 -2 L14 -2 Z" fill="#B5D2D8" strokeWidth="1" />
                  <path d="M24 -9 V-2" strokeWidth="0.6" />
                  <rect x="-6" y="-8" width="11" height="12" rx="1.5" strokeWidth="0.7" />
                  <rect x="-22" y="-17" width="62" height="5" rx="2" fill="#E4A68C" strokeWidth="1.3" />
                  <path d="M10 -12 L0 5 M0 10 V16 M40 9 V15" strokeWidth="1" />
                  <circle cx="0" cy="18" r="3" fill={PAPER} strokeWidth="1" />
                  <circle cx="40" cy="17" r="3" fill={PAPER} strokeWidth="1" />
                  <text x="-38" y="-3" fontSize="5" fill={INK} stroke="none" fontFamily="ui-sans-serif, system-ui" letterSpacing="0.5">
                    351
                  </text>
                  <ellipse cx="64" cy="2" rx="2.4" ry="17" strokeWidth="0.5" opacity="0.45" />
                  <path d="M64 -14 V18" strokeWidth="1.6" />
                  <circle cx="61" cy="2" r="2.2" fill={PAPER} strokeWidth="1" />
                </g>
              </g>
            </motion.g>
          </g>

          {/* Paper grain and an inset print border */}
          <rect width={W} height={H} filter="url(#ll-grain)" pointerEvents="none" />
          <rect x="12" y="12" width={W - 24} height={H - 24} rx="8" fill="none" stroke={INK} strokeWidth="0.8" opacity="0.5" pointerEvents="none" />
        </svg>

        {/* Pins: show the name on hover, open the details on click */}
        {Object.entries(PINS).map(([key, pin]) => {
          const item = byScene[key];
          if (!item) return null;
          const active = hovered === key;
          const left = (pin.x / W) * 100;
          const top = ((pin.y + SHIFT[key]) / H) * 100;
          const flip = left > 65;
          return (
            <button
              key={key}
              onClick={() => setOpenKey(key)}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(key)}
              onBlur={() => setHovered(null)}
              className="absolute z-10 -translate-x-1/2 -translate-y-full focus:outline-none"
              style={{ left: `${left}%`, top: `${top}%` }}
              aria-label={`${item.title}: view details`}
            >
              <span
                className="relative block transition-transform duration-200"
                style={{ transform: active ? 'translateY(-3px) scale(1.12)' : 'none' }}
              >
                {!hovered && (
                  <span
                    className="absolute left-1/2 top-[2px] h-[18px] w-[18px] -translate-x-1/2 animate-ping rounded-full opacity-40"
                    style={{ background: RUST }}
                  />
                )}
                <svg viewBox="0 0 22 30" className="relative block h-6 w-[18px] md:h-[30px] md:w-[22px] drop-shadow-sm">
                  <path d="M11 29 C11 29 2 17.5 2 11 A9 9 0 0 1 20 11 C20 17.5 11 29 11 29 Z" fill={RUST} stroke={INK} strokeWidth="1.3" />
                  <circle cx="11" cy="11" r="3.4" fill={PAPER} />
                </svg>
              </span>
              <span
                className={`pointer-events-none absolute top-0 whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-medium tracking-wide shadow-sm transition-all duration-200 ${
                  flip ? 'right-full mr-1.5' : 'left-full ml-1.5'
                }`}
                style={{
                  borderColor: INK,
                  color: INK,
                  background: PAPER,
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateX(0)' : `translateX(${flip ? 6 : -6}px)`,
                }}
              >
                {item.short ?? item.title}
                <span className="ml-1.5 opacity-60">{item.dates}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs tracking-wide text-cloud dark:text-cloud-light">
        Hover over a pin to see what's there, and click to explore
      </p>

      <LeadershipDetail item={openKey ? byScene[openKey] : null} onClose={close} />
    </>
  );
}

// ---------- drawing pieces ----------

// Watercolour layer: wobbly bleeding edges, multiplied onto the paper like real pigment.
function Wash({ children, opacity = 0.6 }) {
  return (
    <g filter="url(#ll-wash)" stroke="none" opacity={opacity} style={{ mixBlendMode: 'multiply' }}>
      {children}
    </g>
  );
}

function Hatch({ id, gap, angle, width }) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <line x1="0" y1="0" x2="0" y2={gap} stroke={INK} strokeWidth={width} />
    </pattern>
  );
}

// Paper-filled hill with a wash along its crest, slope shading, grass, and a doubled pencil crest.
function Hill({ fn, detail, tint, depth }) {
  return (
    <g>
      <path d={`${crest(fn)} V${H} H0 Z`} fill={PAPER} stroke="none" />
      <Wash opacity={0.5}>
        <path d={band(fn, depth)} fill={tint} />
      </Wash>
      <path d={detail.shade} strokeWidth="0.6" opacity="0.55" />
      <path d={detail.contours} strokeWidth="0.6" opacity="0.35" />
      <path d={detail.grass} strokeWidth="0.6" opacity="0.45" />
      <path d={crest(fn)} strokeWidth="1.5" />
      <path d={crest(fn, 1.6)} strokeWidth="0.5" opacity="0.4" />
    </g>
  );
}

function Shrubs({ list }) {
  return (
    <g>
      <Wash opacity={0.75}>
        {list.map((s, i) =>
          s.blobs.map(([dx, dy, r], j) => <circle key={`${i}-${j}`} cx={f(s.x + dx)} cy={f(s.y + dy)} r={f(r)} fill={s.c} />),
        )}
      </Wash>
      <path d={shrubInk(list)} strokeWidth="0.8" opacity="0.75" />
    </g>
  );
}

function Building({ x, y, w, h, rows, door, top, tint }) {
  const cols = [x + w * 0.16, x + w * 0.5];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={tint ?? PAPER} />
      <rect x={x + w * 0.74} y={y} width={w * 0.26} height={h} fill="url(#ll-hatch-light)" stroke="none" />
      <rect x={x} y={y} width={w} height={h} />
      <path d={`M${x - 2} ${y} H${x + w + 2} M${x} ${y + 4} H${x + w}`} strokeWidth="0.8" />
      {Array.from({ length: rows }, (_, r) =>
        cols.map((cx) => (
          <g key={`${r}-${cx}`}>
            <rect x={cx} y={y + 10 + r * 20} width={w * 0.2} height="9" fill="#D9E3EC" strokeWidth="0.8" />
            <path d={`M${cx + w * 0.1} ${y + 10 + r * 20} v9`} strokeWidth="0.4" />
          </g>
        )),
      )}
      {door && <rect x={x + w * 0.38} y={y + h - 12} width={w * 0.24} height="12" fill="url(#ll-hatch-x)" strokeWidth="0.8" />}
      {top === 'tank' && (
        <path d={`M${x + w * 0.3} ${y} v-5 M${x + w * 0.6} ${y} v-5 M${x + w * 0.24} ${y - 5} h${w * 0.42} v-7 h-${w * 0.42} Z`} fill={PAPER} strokeWidth="0.8" />
      )}
      {top === 'antenna' && <path d={`M${x + w * 0.7} ${y} v-14 M${x + w * 0.7 - 4} ${y - 10} h8`} strokeWidth="0.8" />}
    </g>
  );
}

function Pine({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${f(x)} ${f(y + 2)}) scale(${f(s)})`}>
      <path d="M0 0 V6" strokeWidth="1.5" />
      <path d="M0 -40 L10 -22 L5 -22 L13 -8 L7 -8 L15 2 L-15 2 L-7 -8 L-13 -8 L-5 -22 L-10 -22 Z" fill="#A9BE90" strokeWidth="1.2" />
      <path d="M0 -40 L10 -22 L5 -22 L13 -8 L7 -8 L15 2 L0 2 Z" fill="url(#ll-hatch)" stroke="none" />
      <path d="M-6 -24 l3 -2 M-9 -10 l4 -2 M-11 0 l5 -2" strokeWidth="0.6" opacity="0.7" />
    </g>
  );
}

function Rock({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)}) scale(${s})`}>
      <path d="M-14 0 C-15 -8 -6 -15 3 -14 C11 -13 16 -6 14 0 Z" fill="#D8D2C6" strokeWidth="1.2" />
      <path d="M3 -14 C11 -13 16 -6 14 0 L2 0 C4 -5 4 -10 3 -14 Z" fill="url(#ll-hatch)" stroke="none" />
      <path d="M-18 1 H18" strokeWidth="0.6" opacity="0.6" />
    </g>
  );
}

function Fence({ x0, x1 }) {
  const posts = [];
  for (let x = x0; x <= x1; x += 24) posts.push([x, frontHill(x) + 12]);
  const rail = (dy) => posts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${f(y - dy)}`).join(' ');
  return (
    <g>
      <path d={posts.map(([x, y]) => `M${x} ${f(y)} v-15`).join(' ')} strokeWidth="1.2" />
      <path d={`${rail(5)} ${rail(11)}`} strokeWidth="0.8" />
    </g>
  );
}

// Tiny stick figure: `throw` has an arm back, `reach` has both arms up, `run` is mid-stride.
function Player({ x, y, pose, s = 1 }) {
  const arms = {
    throw: 'M0 -14 L8 -17 M0 -14 L-6 -9',
    reach: 'M0 -14 L-4 -24 M0 -14 L4 -24',
    run: 'M0 -14 L6 -10 M0 -14 L-6 -12',
  }[pose];
  const legs = pose === 'run' ? 'M0 -8 L-5 0 M0 -8 L5 -2 L7 0' : 'M0 -8 L-4 0 M0 -8 L4 0';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-20" r="3.2" fill={PAPER} strokeWidth="1" />
      <path d={`M0 -17 V-8 ${arms} ${legs}`} strokeWidth="1.1" />
    </g>
  );
}
