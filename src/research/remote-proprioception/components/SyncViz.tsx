// Interactive illustration of the ground-tap synchronisation (Sec. IV-B/C): a tap of the force
// probe on the ground creates a load-cell spike in the ROS stream and the probe marker reaching
// Z = 0 in the mocap stream. Shifting one stream until the two events line up gives the offset.
// Signals are illustrative.
import { useState } from "react";

const TRUE_OFFSET = 0.42; // s, illustrative
const W = 520,
  H = 200;

function trace(fn: (t: number) => number, shift: number, y0: number, amp: number) {
  let d = "";
  for (let i = 0; i <= 260; i++) {
    const t = i / 260 * 4;
    const v = fn(t - shift);
    d += `${i ? "L" : "M"}${(40 + (t / 4) * (W - 60)).toFixed(1)},${(y0 - v * amp).toFixed(1)}`;
  }
  return d;
}

const spike = (t: number) => Math.exp(-((t - 1.6) ** 2) / 0.002) + 0.02 * Math.sin(t * 40);
const markerZ = (t: number) => {
  const d = t - 1.6;
  return Math.min(1, Math.abs(d) * 1.6) * (d < 0 ? 1 : 0.8);
};

export default function SyncViz() {
  const [shift, setShift] = useState(0);
  const err = Math.abs(shift + TRUE_OFFSET);
  const aligned = err < 0.03;
  const xAt = (t: number) => 40 + (t / 4) * (W - 60);

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Ground-tap synchronisation">
        <text x="40" y="18" className="fill-ink-2 text-[11px]">
          ROS · load-cell (probe)
        </text>
        <path d={trace(spike, 0, 80, 55)} stroke="#e8650a" strokeWidth="1.6" fill="none" />
        <text x="40" y="112" className="fill-ink-2 text-[11px]">
          Vicon · probe-tip marker height Z
        </text>
        <path d={trace(markerZ, TRUE_OFFSET + shift, 180, 55)} stroke="#2a6fdb" strokeWidth="1.6" fill="none" />
        <line x1="40" x2={W - 20} y1="180" y2="180" stroke="#e4e2dc" />
        <text x={W - 22} y="176" textAnchor="end" className="fill-ink-3 text-[9.5px]">
          Z = 0
        </text>
        <line x1={xAt(1.6)} x2={xAt(1.6)} y1="20" y2="185" stroke={aligned ? "#16a34a" : "#8a8a94"} strokeDasharray="3 3" />
        <line x1={xAt(1.6 + TRUE_OFFSET + shift)} x2={xAt(1.6 + TRUE_OFFSET + shift)} y1="120" y2="185" stroke="#2a6fdb" strokeDasharray="2 2" opacity={aligned ? 0 : 0.6} />
      </svg>
      <label className="mt-2 block text-[12px]">
        <span className="flex justify-between text-ink-2">
          Shift mocap stream
          <span className={`font-mono tabular-nums ${aligned ? "text-green-700" : ""}`}>
            {shift >= 0 ? "+" : ""}
            {shift.toFixed(2)} s {aligned ? "· aligned ✓" : ""}
          </span>
        </span>
        <input type="range" min={-1} max={1} step={0.01} value={shift} onChange={(e) => setShift(+e.target.value)} className="w-full accent-[#2a6fdb]" />
      </label>
      <p className="mt-1 text-[11.5px] leading-relaxed text-ink-3">
        Illustrative signals. After alignment both streams are interpolated to a common 120 Hz clock and merged per trial.
      </p>
    </div>
  );
}
