import { useEffect, useMemo, useRef, useState } from "react";

export type Series = {
  label: string;
  values: (number | null)[];
  color: string;
  dashed?: boolean;
  width?: number;
  unit?: string;
};

type Props = {
  t: number[];
  series: Series[];
  height?: number;
  yLabel: string;
  playhead?: number;
  band?: number[]; // 0/1 per sample, shaded (e.g. ground-truth contact)
  bandLabel?: string;
  domain?: [number, number]; // time window
  yDomain?: [number, number];
  onScrub?: (t: number) => void;
  showXAxis?: boolean;
  digits?: number;
};

const PAD = { l: 40, r: 10, t: 8, b: 20 };

function niceTicks(lo: number, hi: number, n = 4) {
  const span = hi - lo || 1;
  const step0 = span / n;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0) ?? step0;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
}

export default function LineChart({
  t,
  series,
  height = 120,
  yLabel,
  playhead,
  band,
  bandLabel,
  domain,
  yDomain,
  onScrub,
  showXAxis = true,
  digits = 1,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(200, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [x0, x1] = domain ?? [t[0] ?? 0, t[t.length - 1] ?? 1];
  const [y0, y1] = useMemo(() => {
    if (yDomain) return yDomain;
    let lo = Infinity,
      hi = -Infinity;
    for (const s of series)
      for (let i = 0; i < s.values.length; i++) {
        const v = s.values[i];
        if (v == null || t[i] < x0 || t[i] > x1) continue;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    if (!Number.isFinite(lo)) return [0, 1];
    const pad = (hi - lo) * 0.08 || 1;
    return [lo - pad, hi + pad];
  }, [series, t, x0, x1, yDomain]);

  const W = width - PAD.l - PAD.r;
  const H = height - PAD.t - PAD.b * (showXAxis ? 1 : 0.4);
  const sx = (v: number) => PAD.l + ((v - x0) / (x1 - x0)) * W;
  const sy = (v: number) => PAD.t + (1 - (v - y0) / (y1 - y0)) * H;

  const paths = useMemo(() => {
    // decimate to ~2 points per pixel
    const idx: number[] = [];
    for (let i = 0; i < t.length; i++) if (t[i] >= x0 && t[i] <= x1) idx.push(i);
    const step = Math.max(1, Math.floor(idx.length / (W * 1.5)));
    return series.map((s) => {
      let d = "";
      let pen = false;
      for (let k = 0; k < idx.length; k += step) {
        const i = idx[k];
        const v = s.values[i];
        if (v == null) {
          pen = false;
          continue;
        }
        d += `${pen ? "L" : "M"}${sx(t[i]).toFixed(1)},${sy(v).toFixed(1)}`;
        pen = true;
      }
      return d;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, t, x0, x1, y0, y1, W, H]);

  const bandRects = useMemo(() => {
    if (!band) return [];
    const rects: [number, number][] = [];
    let start: number | null = null;
    for (let i = 0; i < t.length; i++) {
      if (band[i] && start === null) start = t[i];
      if ((!band[i] || i === t.length - 1) && start !== null) {
        rects.push([start, t[i]]);
        start = null;
      }
    }
    return rects.filter(([a, b]) => b >= x0 && a <= x1);
  }, [band, t, x0, x1]);

  const yTicks = niceTicks(y0, y1, height < 110 ? 2 : 3);
  const xTicks = niceTicks(x0, x1, Math.max(3, Math.floor(W / 90)));

  const timeAt = (clientX: number) => {
    const r = wrap.current!.getBoundingClientRect();
    const v = x0 + ((clientX - r.left - PAD.l) / W) * (x1 - x0);
    return Math.min(x1, Math.max(x0, v));
  };
  const indexAt = (time: number) => {
    let lo = 0,
      hi = t.length - 1;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (t[m] < time) lo = m + 1;
      else hi = m;
    }
    return lo;
  };

  const hi = hover != null ? indexAt(hover) : null;

  return (
    <div
      ref={wrap}
      className="relative select-none"
      style={{ height }}
      onPointerMove={(e) => {
        setHover(timeAt(e.clientX));
        if (e.buttons === 1 && onScrub) onScrub(timeAt(e.clientX));
      }}
      onPointerLeave={() => setHover(null)}
      onPointerDown={(e) => onScrub?.(timeAt(e.clientX))}
    >
      <svg width={width} height={height} className={onScrub ? "cursor-pointer" : ""} role="img" aria-label={yLabel}>
        {bandRects.map(([a, b], i) => (
          <rect key={i} x={sx(Math.max(a, x0))} y={PAD.t} width={Math.max(1, sx(Math.min(b, x1)) - sx(Math.max(a, x0)))} height={H} fill="#2a6fdb" opacity={0.09} />
        ))}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={PAD.l + W} y1={sy(v)} y2={sy(v)} stroke="#ebe9e3" />
            <text x={PAD.l - 6} y={sy(v)} dy="0.32em" textAnchor="end" className="fill-ink-3 text-[10px] tabular-nums">
              {v}
            </text>
          </g>
        ))}
        {showXAxis &&
          xTicks.map((v) => (
            <text key={v} x={sx(v)} y={height - 5} textAnchor="middle" className="fill-ink-3 text-[10px] tabular-nums">
              {v}s
            </text>
          ))}
        <text transform={`translate(10 ${PAD.t + H / 2}) rotate(-90)`} textAnchor="middle" className="fill-ink-2 text-[10px]">
          {yLabel}
        </text>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={series[i].color}
            strokeWidth={series[i].width ?? 1.4}
            strokeDasharray={series[i].dashed ? "4 3" : undefined}
            strokeLinejoin="round"
          />
        ))}
        {playhead != null && playhead >= x0 && playhead <= x1 && (
          <line x1={sx(playhead)} x2={sx(playhead)} y1={PAD.t} y2={PAD.t + H} stroke="#16161a" strokeWidth={1.2} />
        )}
        {hi != null && (
          <g>
            <line x1={sx(t[hi])} x2={sx(t[hi])} y1={PAD.t} y2={PAD.t + H} stroke="#8a8a94" strokeDasharray="2 2" />
            {series.map((s, i) =>
              s.values[hi] == null ? null : <circle key={i} cx={sx(t[hi])} cy={sy(s.values[hi]!)} r={3} fill={s.color} stroke="#fff" strokeWidth={1.5} />,
            )}
          </g>
        )}
      </svg>
      {hi != null && (
        <div
          className="pointer-events-none absolute top-1 z-10 rounded-md border border-line bg-white/95 px-2 py-1 text-[11px] shadow-sm"
          style={{ left: Math.min(sx(t[hi]) + 10, width - 150) }}
        >
          <div className="text-ink-3 tabular-nums">t = {t[hi].toFixed(2)} s</div>
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 tabular-nums text-ink">
              <span className="inline-block h-0.5 w-3" style={{ background: s.color }} />
              <span className="text-ink-2">{s.label}</span>
              <span className="ml-auto pl-2 font-medium">
                {s.values[hi] == null ? "–" : `${s.values[hi]!.toFixed(digits)}${s.unit ?? ""}`}
              </span>
            </div>
          ))}
          {band && bandLabel && band[hi] ? <div className="text-truth">{bandLabel}</div> : null}
        </div>
      )}
    </div>
  );
}
