import React, { useCallback, useState } from 'react';
import { LeadershipDetail } from '@/components/portfolio/LeadershipPins';

// Illustrated landscape (public/about/landscape.*) with hand-penned hotspots drawn over it.
// Items are matched to spots by their `scene` key: cadets, church, fellowship, mecha, frisbee.
// Coordinates are in the image's own pixels (1024 x 547), so the overlay scales with it.

const W = 1024;
const H = 547;
const INK = '#2B2622';
const PAPER = '#F7F3EA';
const RUST = '#C8553D';
const HAND = "'Caveat', 'Segoe Print', 'Bradley Hand', cursive";

// target: dashed ring around the feature. label: where the text sits (anchor = text-anchor).
// arrow: hand-drawn pointer from the label to the ring. kind: ring style.
const SPOTS = {
  cadets: {
    tag: 'Aviation',
    target: { cx: 230, cy: 88, rx: 48, ry: 24 },
    label: { x: 300, y: 50, anchor: 'start' },
    arrow: 'M296 52 C282 54 276 60 272 72',
    kind: 'dotted',
  },
  church: {
    tag: 'Church',
    target: { cx: 142, cy: 338, rx: 62, ry: 96 },
    label: { x: 34, y: 222, anchor: 'start' },
    arrow: 'M92 230 C102 236 106 242 110 252',
    kind: 'dashed',
  },
  fellowship: {
    tag: 'Fellowship',
    target: { cx: 690, cy: 344, rx: 54, ry: 40 },
    label: { x: 690, y: 250, anchor: 'middle' },
    pin: { x: 690, y: 302 },
    kind: 'dashed',
  },
  mecha: {
    tag: 'Robotics',
    target: { cx: 828, cy: 348, rx: 64, ry: 34 },
    label: { x: 988, y: 290, anchor: 'end' },
    arrow: 'M928 298 C912 306 896 314 884 326',
    kind: 'dashed',
  },
  frisbee: {
    tag: 'Ultimate Frisbee',
    target: { cx: 378, cy: 458, rx: 104, ry: 34 },
    label: { x: 290, y: 414, anchor: 'end' },
    arrow: 'M294 410 C306 412 314 420 318 432',
    kind: 'arc',
  },
};

// Text with a paper-coloured halo so it stays legible over ink and wash.
const halo = { paintOrder: 'stroke', stroke: PAPER, strokeWidth: 5, strokeLinejoin: 'round' };

export default function LeadershipMap({ items }) {
  const [hovered, setHovered] = useState(null);
  const [openKey, setOpenKey] = useState(null);
  const byScene = Object.fromEntries(items.map((i) => [i.scene, i]));
  const close = useCallback(() => setOpenKey(null), []);
  const spots = Object.entries(SPOTS).filter(([key]) => byScene[key]);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border shadow-md dark:brightness-90" style={{ borderColor: '#d9d0bf' }}>
        <picture>
          <source srcSet="/about/landscape.webp" type="image/webp" />
          <img
            src="/about/landscape.jpg"
            alt="Ink-and-watercolour landscape with a plane, a church, a campus, a robotics arena and a frisbee field"
            width={W}
            height={H}
            loading="lazy"
            className="block h-auto w-full select-none"
            draggable={false}
          />
        </picture>

        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" fill="none" stroke={INK} strokeLinecap="round">
          <defs>
            <filter id="lm-wobble">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" />
              <feDisplacementMap in="SourceGraphic" scale="2.5" />
            </filter>
            <marker id="lm-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1 1 L8 5 L1 9" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
            </marker>
          </defs>

          {spots.map(([key, s]) => {
            const item = byScene[key];
            const active = hovered === key;
            const { cx, cy, rx, ry } = s.target;
            const ring = active ? RUST : INK;
            const open = () => setOpenKey(key);
            return (
              <g
                key={key}
                role="button"
                tabIndex={0}
                aria-label={`${item.title}: view details`}
                onClick={open}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(key)}
                onBlur={() => setHovered(null)}
                className="cursor-pointer focus:outline-none"
                style={{ opacity: active ? 1 : 0.62, transition: 'opacity 0.25s ease' }}
              >
                {/* Generous invisible hit area over the feature */}
                <ellipse cx={cx} cy={cy} rx={rx + 10} ry={ry + 10} fill="transparent" stroke="none" />

                <g filter="url(#lm-wobble)">
                  {active && <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={RUST} fillOpacity="0.1" stroke="none" />}
                  {s.kind === 'arc' ? (
                    <path
                      d={`M${cx - rx} ${cy + 6} C${cx - rx * 0.8} ${cy - ry * 1.5} ${cx + rx * 0.8} ${cy - ry * 1.5} ${cx + rx} ${cy + 6}`}
                      stroke={ring}
                      strokeWidth={active ? 1.8 : 1.3}
                      strokeDasharray="1 6"
                    />
                  ) : (
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={rx}
                      ry={ry}
                      stroke={ring}
                      strokeWidth={active ? 1.8 : 1.2}
                      strokeDasharray={s.kind === 'dotted' ? '1 5' : '6 5'}
                      style={{ transition: 'stroke 0.25s ease' }}
                    />
                  )}
                  {s.kind === 'dotted' && <circle cx={cx} cy={cy} r={3} fill={ring} stroke="none" />}
                  {s.arrow && <path d={s.arrow} strokeWidth="1.2" markerEnd="url(#lm-head)" />}
                  {s.pin && <SketchPin {...s.pin} color={active ? RUST : INK} />}
                </g>

                <text
                  x={s.label.x}
                  y={s.label.y}
                  textAnchor={s.label.anchor}
                  fill={active ? RUST : INK}
                  stroke="none"
                  fontFamily={HAND}
                  fontWeight="700"
                  fontSize="22"
                  letterSpacing="1.5"
                  style={{ ...halo, transition: 'fill 0.25s ease' }}
                >
                  {s.tag.toUpperCase()}
                </text>
                <text
                  x={s.label.x}
                  y={s.label.y + 17}
                  textAnchor={s.label.anchor}
                  fill={INK}
                  stroke="none"
                  fontFamily={HAND}
                  fontWeight="500"
                  fontSize="16"
                  style={{ ...halo, opacity: active ? 1 : 0, transition: 'opacity 0.25s ease' }}
                >
                  {item.short ?? item.title} · {item.dates}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Labels get tiny on phones, so offer plain buttons there too */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 md:hidden">
        {spots.map(([key, s]) => (
          <button
            key={key}
            onClick={() => setOpenKey(key)}
            className="rounded-full border px-3 py-1 text-sm"
            style={{ borderColor: INK, color: INK, background: PAPER, fontFamily: HAND }}
          >
            {s.tag}
          </button>
        ))}
      </div>

      <p className="mt-5 text-center text-xs tracking-wide text-cloud dark:text-cloud-light">
        Hover over a spot on the map to see what's there, and click to explore
      </p>

      <LeadershipDetail item={openKey ? byScene[openKey] : null} onClose={close} />
    </>
  );
}

// Hand-sketched pin-drop whose tip touches (x, y).
function SketchPin({ x, y, color }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} strokeWidth="1.3">
      <path d="M0 0 C-2 -6 -8 -11 -8 -17 A8 8 0 0 1 8 -17 C8 -11 2 -6 0 0 Z" fill={PAPER} />
      <circle cx="0" cy="-17" r="2.6" fill={color} stroke="none" />
    </g>
  );
}
