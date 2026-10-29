// Schematic, interactive illustration of actuation-side sensing (cf. paper Fig. 2): two tendons
// routed through a sensorless finger to two motors with in-line load cells at the wrist. The
// numbers are illustrative only, chosen to show *why* the load cell matters: drive current
// saturates as the motor approaches stall, while tendon tension keeps tracking contact force.
import { useMemo, useState } from "react";

const L1 = 105;
const L2 = 85;
const BASE = { x: 170, y: 250 };

function Bar({ label, value, max, color, note }: { label: string; value: number; max: number; color: string; note?: string }) {
  const pct = Math.min(1, value / max);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-ink-2">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-ink">{note ?? value.toFixed(2)}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper">
        <div className="h-full rounded-full transition-[width] duration-150" style={{ width: `${pct * 100}%`, background: color }} />
      </div>
    </div>
  );
}

export default function SensingDiagram() {
  const [flex, setFlex] = useState(35); // % command, tendon 1 (proximal joint)
  const [hinge, setHinge] = useState(45); // % command, tendon 2 (distal joint)
  const [force, setForce] = useState(0); // external contact force at the fingertip, N

  const s = useMemo(() => {
    // contact pushes the finger back: deflection grows with force (compliant TPU)
    const back = force * 6;
    const th1 = ((flex / 100) * 70 - back * 0.35) * (Math.PI / 180);
    const th2 = ((hinge / 100) * 85 - back * 0.65) * (Math.PI / 180);
    const p0 = BASE;
    const p1 = { x: p0.x + L1 * Math.sin(th1), y: p0.y - L1 * Math.cos(th1) };
    const p2 = { x: p1.x + L2 * Math.sin(th1 + th2), y: p1.y - L2 * Math.cos(th1 + th2) };
    const off = (a: { x: number; y: number }, ang: number, d: number) => ({ x: a.x + d * Math.cos(ang), y: a.y + d * Math.sin(ang) });
    // tendons run along the flexor side of each link
    const t1 = [off(p0, th1, 7), off({ x: (p0.x + p1.x) / 2 + 0, y: (p0.y + p1.y) / 2 }, th1, 7), off(p1, th1, 7)];
    const t2 = [off(p0, th1, -2), off(p1, (th1 + th1 + th2) / 2, 2), off(p2, th1 + th2, 5)];

    const tension1 = 0.6 + (flex / 100) * 1.4 + force * 0.55;
    const tension2 = 0.5 + (hinge / 100) * 1.2 + force * 0.85;
    const stall = 2.6;
    const current = (t: number) => Math.min(stall, t * 0.9) + (t * 0.9 > stall ? 0.05 * Math.sin(t * 9) : 0);
    return { p0, p1, p2, t1, t2, tension1, tension2, cur1: current(tension1), cur2: current(tension2), stall, th1, th2 };
  }, [flex, hinge, force]);

  const pts = (a: { x: number; y: number }[]) => a.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const tip = s.p2;
  const probeX = tip.x + 16 * Math.cos(s.th1 + s.th2);
  const probeY = tip.y + 16 * Math.sin(s.th1 + s.th2);

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 520 420" className="w-full rounded-xl border border-line bg-[#fbfaf7]" role="img" aria-label="Tendon routing schematic">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#eeebe4" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="520" height="420" fill="url(#grid)" />

        {/* wrist */}
        <rect x="95" y="250" width="150" height="70" rx="10" fill="#2b2b30" />
        <text x="105" y="312" className="fill-white/70 text-[11px]">wrist</text>

        {/* finger */}
        <polyline points={pts([s.p0, s.p1, s.p2])} fill="none" stroke="#e7e3da" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts([s.p0, s.p1, s.p2])} fill="none" stroke="#fff" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
        {[s.p1, s.p0].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#d9d4c8" />
        ))}

        {/* tendons through the finger and down to the motors */}
        <polyline points={pts(s.t1)} fill="none" stroke="#d63a3a" strokeWidth="2" />
        <polyline points={pts(s.t2)} fill="none" stroke="#d63a3a" strokeWidth="2" strokeDasharray="5 3" />
        <path d={`M${s.t1[0].x},${s.t1[0].y} L${s.t1[0].x},335 L400,335 L400,350`} fill="none" stroke="#d63a3a" strokeWidth="2" />
        <path d={`M${s.t2[0].x},${s.t2[0].y} L${s.t2[0].x},320 L400,320 L400,${300}`} fill="none" stroke="#d63a3a" strokeWidth="2" strokeDasharray="5 3" />

        {/* contact probe */}
        {force > 0.05 && (
          <g>
            <line x1={probeX} y1={probeY} x2={probeX + 60 * Math.cos(s.th1 + s.th2)} y2={probeY + 60 * Math.sin(s.th1 + s.th2)} stroke="#6b7280" strokeWidth="6" strokeLinecap="round" />
            <circle cx={probeX} cy={probeY} r="7" fill="#6b7280" />
            <text x={probeX + 14} y={probeY - 10} className="fill-ink-2 text-[11px]">
              probe · {force.toFixed(1)} N
            </text>
          </g>
        )}

        {/* motors + load cells */}
        {[
          { y: 262, label: "Motor 2 + load cell 2", sub: "distal tendon", t: s.tension2 },
          { y: 350, label: "Motor 1 + load cell 1", sub: "proximal tendon", t: s.tension1 },
        ].map((m) => (
          <g key={m.label}>
            <rect x="372" y={m.y} width="128" height="40" rx="8" fill="#fff" stroke="#16161a" strokeWidth="1.2" />
            <text x="436" y={m.y + 17} textAnchor="middle" className="fill-ink text-[10.5px] font-medium">
              {m.label}
            </text>
            <text x="436" y={m.y + 31} textAnchor="middle" className="fill-ink-3 text-[10px]">
              {m.sub}
            </text>
          </g>
        ))}
        <path d="M436,262 C436,120 300,60 250,60" fill="none" stroke="#e8650a" strokeWidth="1.5" className="flow" />
        <rect x="150" y="40" width="100" height="40" rx="8" fill="#fff5ee" stroke="#e8650a" />
        <text x="200" y="57" textAnchor="middle" className="fill-ink text-[10.5px] font-medium">
          11-ch telemetry
        </text>
        <text x="200" y="71" textAnchor="middle" className="fill-ink-3 text-[10px]">
          → GRU @ 120 Hz
        </text>

        <text x="16" y="404" className="fill-ink-3 text-[10px]">
          Schematic, not to scale. Finger body contains no sensors or electronics.
        </text>
      </svg>

      <div className="flex flex-col gap-4">
        <div className="space-y-3 rounded-xl border border-line bg-white p-4">
          <div className="text-[11px] font-medium uppercase tracking-wide text-ink-3">Drive the finger</div>
          <label className="block text-[12px]">
            <span className="flex justify-between text-ink-2">
              Tendon 1 · proximal flexion <span className="font-mono tabular-nums">{flex}%</span>
            </span>
            <input type="range" min={0} max={100} value={flex} onChange={(e) => setFlex(+e.target.value)} className="w-full accent-[#16161a]" />
          </label>
          <label className="block text-[12px]">
            <span className="flex justify-between text-ink-2">
              Tendon 2 · distal hinge <span className="font-mono tabular-nums">{hinge}%</span>
            </span>
            <input type="range" min={0} max={100} value={hinge} onChange={(e) => setHinge(+e.target.value)} className="w-full accent-[#16161a]" />
          </label>
          <label className="block text-[12px]">
            <span className="flex justify-between text-ink-2">
              External contact force <span className="font-mono tabular-nums">{force.toFixed(1)} N</span>
            </span>
            <input type="range" min={0} max={5} step={0.1} value={force} onChange={(e) => setForce(+e.target.value)} className="w-full accent-[#e8650a]" />
          </label>
        </div>
        <div className="space-y-2.5 rounded-xl border border-line bg-white p-4">
          <div className="text-[11px] font-medium uppercase tracking-wide text-ink-3">What the wrist “feels” (illustrative units)</div>
          <Bar label="Motor 1 drive current" value={s.cur1} max={3} color="#9ca3af" note={s.cur1 >= s.stall - 0.06 ? "saturating" : s.cur1.toFixed(2)} />
          <Bar label="Motor 2 drive current" value={s.cur2} max={3} color="#9ca3af" note={s.cur2 >= s.stall - 0.06 ? "saturating" : s.cur2.toFixed(2)} />
          <Bar label="Load cell 1 tension" value={s.tension1} max={6} color="#e8650a" />
          <Bar label="Load cell 2 tension" value={s.tension2} max={6} color="#e8650a" />
          <p className="pt-1 text-[11.5px] leading-relaxed text-ink-3">
            Push the contact force up: drive current flattens as the motor nears stall, while tendon tension keeps rising. That is the
            gap the dedicated load cells fill (Sec. VII).
          </p>
        </div>
      </div>
    </div>
  );
}
