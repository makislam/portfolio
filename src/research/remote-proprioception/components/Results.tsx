import { useState } from "react";
import { COLORS } from "../lib/data";

// Table II / Table III of the paper.
type Row = { set: string; mlc: (number | null)[]; motor: (number | null)[] };
const METRICS = [
  { key: "joint", label: "Joint MAE", unit: "°", better: "lower", baseline: null },
  { key: "norm", label: "Norm. joint error", unit: "%", better: "lower", baseline: null },
  { key: "force", label: "Force MAE", unit: " N", better: "lower", baseline: 0.92 },
  { key: "rho", label: "Force Spearman ρ", unit: "", better: "higher", baseline: null },
  { key: "f1", label: "Contact F1", unit: "", better: "higher", baseline: 0.76 },
] as const;

const ROWS: Row[] = [
  { set: "Free space", mlc: [2.24, 4.21, null, null, null], motor: [2.14, 4.08, null, null, null] },
  { set: "Standard contact", mlc: [4.11, 6.71, 0.34, 0.73, 0.79], motor: [4.85, 7.8, 0.41, 0.72, 0.78] },
  { set: "Extreme contact", mlc: [15.24, 15.71, 0.91, 0.22, 0.53], motor: [15.17, 15.67, 0.88, 0.08, 0.45] },
  { set: "Pooled (6 takes)", mlc: [9.67, 12.28, 0.62, 0.48, 0.66], motor: [10.01, 12.67, 0.64, 0.4, 0.61] },
];

export function HeadlineTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-card">
      <table className="w-full min-w-[620px] text-left text-[13px]">
        <thead className="text-[11px] text-ink-3">
          <tr className="border-b border-line">
            <th className="px-4 py-2.5 font-medium">Model</th>
            <th className="px-4 py-2.5 font-medium">Evaluation set</th>
            <th className="px-4 py-2.5 text-right font-medium">Joint MAE (°)</th>
            <th className="px-4 py-2.5 text-right font-medium">Norm. joint err. (%)</th>
            <th className="px-4 py-2.5 text-right font-medium">Force MAE (N)</th>
            <th className="px-4 py-2.5 text-right font-medium">Force ρ</th>
            <th className="px-4 py-2.5 text-right font-medium">Contact F1</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {[
            ["T · no contact", "3 free-space takes", "2.24", "4.21", "–", "–", "–", true],
            ["Q · contact", "3 standard takes", "4.11", "6.71", "0.34", "0.73", "0.79", true],
            ["Q · contact", "3 extreme takes", "15.24", "15.71", "0.91", "0.22", "0.53", false],
            ["Q · contact", "pooled", "9.67", "12.28", "0.62", "0.48", "0.66", false],
            ["Baseline", "constant / always-on", "–", "–", "0.92", "–", "0.76", false],
          ].map((r, i) => (
            <tr key={i} className={`border-b border-line last:border-0 ${r[7] ? "bg-[#fff8f2]" : ""} ${r[0] === "Baseline" ? "italic text-ink-3" : ""}`}>
              {r.slice(0, 7).map((c, j) => (
                <td key={j} className={`px-4 py-2.5 ${j >= 2 ? "text-right" : ""} ${j === 0 ? "font-medium" : ""}`}>
                  {c as string}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ModalityCompare() {
  const [m, setM] = useState(2);
  const metric = METRICS[m];
  const rows = ROWS.filter((r) => r.mlc[m] != null);
  const max = Math.max(...rows.flatMap((r) => [r.mlc[m]!, r.motor[m]!]), metric.baseline ?? 0) * 1.15;
  const [hover, setHover] = useState<string | null>(null);

  const W = 560,
    H = 230,
    L = 36,
    B = 34,
    T = 14;
  const gw = (W - L - 10) / rows.length;
  const bw = Math.min(46, gw / 3.2);
  const sy = (v: number) => T + (1 - v / max) * (H - T - B);

  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {METRICS.map((mm, k) => (
          <button
            key={mm.key}
            onClick={() => setM(k)}
            className={`rounded-full border px-3 py-1 text-[12px] font-medium ${k === m ? "border-ink bg-ink text-white" : "border-line text-ink-2 hover:bg-paper"}`}
          >
            {mm.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11.5px] text-ink-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.pred }} /> Motor + load cell (T / Q, 11 ch)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS.motor }} /> Motor only (U / V, 9 ch)
        </span>
        <span className="ml-auto text-ink-3">{metric.better} is better</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label={`${metric.label}: motor + load cell vs motor only`}>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={L} x2={W - 10} y1={sy(max * f)} y2={sy(max * f)} stroke="#efede7" />
            <text x={L - 6} y={sy(max * f)} dy="0.32em" textAnchor="end" className="fill-ink-3 text-[10px] tabular-nums">
              {(max * f).toFixed(max > 5 ? 0 : 1)}
            </text>
          </g>
        ))}
        {metric.baseline != null && (
          <g>
            <line x1={L} x2={W - 10} y1={sy(metric.baseline)} y2={sy(metric.baseline)} stroke="#16161a" strokeDasharray="4 3" />
            <text x={L + 4} y={sy(metric.baseline) - 5} textAnchor="start" className="fill-ink-2 text-[10px]">
              {m === 2 ? "constant-mean baseline" : "always-on baseline"} {metric.baseline}
            </text>
          </g>
        )}
        {rows.map((r, i) => {
          const cx = L + gw * i + gw / 2;
          return (
            <g key={r.set}>
              {[
                { v: r.mlc[m]!, c: COLORS.pred, x: cx - bw - 2, id: `${r.set}-mlc`, n: "Motor + load cell" },
                { v: r.motor[m]!, c: COLORS.motor, x: cx + 2, id: `${r.set}-mot`, n: "Motor only" },
              ].map((b) => (
                <g key={b.id} onPointerEnter={() => setHover(b.id)} onPointerLeave={() => setHover(null)}>
                  <rect x={b.x - 3} y={T} width={bw + 6} height={H - T - B} fill="transparent" />
                  <rect x={b.x} y={sy(b.v)} width={bw} height={sy(0) - sy(b.v)} rx={3} fill={b.c} opacity={hover && hover !== b.id ? 0.55 : 1} />
                  <text x={b.x + bw / 2} y={sy(b.v) - 5} textAnchor="middle" className="fill-ink text-[10.5px] font-medium tabular-nums">
                    {b.v}
                    {metric.unit}
                  </text>
                </g>
              ))}
              <text x={cx} y={H - 14} textAnchor="middle" className="fill-ink-2 text-[11px]">
                {r.set}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
