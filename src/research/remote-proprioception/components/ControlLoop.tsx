// Generated diagram of the deployed closed loop (Sec. VI): the model's filtered force estimate
// is the only feedback signal the PID controller sees; the external load cell only verifies.
const BOX = "fill-white stroke-[#16161a]";

export default function ControlLoop() {
  const nodes = [
    { x: 30, y: 40, w: 110, t: "Target F*", s: "setpoint (N)" },
    { x: 200, y: 40, w: 110, t: "PID", s: "Δ hinge command" },
    { x: 370, y: 40, w: 130, t: "Motors", s: "Dynamixel XC330 ×2" },
    { x: 560, y: 40, w: 140, t: "Soft hand", s: "2 fingers · object" },
    { x: 560, y: 170, w: 140, t: "Telemetry", s: "motor + tendon load cell" },
    { x: 370, y: 170, w: 130, t: "Model Q (GRU)", s: "300-sample buffer · ~1 ms" },
    { x: 200, y: 170, w: 110, t: "EMA filter", s: "τ = 0.75 s" },
  ];
  return (
    <svg viewBox="0 0 730 260" className="w-full" role="img" aria-label="Closed-loop force control diagram">
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#16161a" />
        </marker>
      </defs>
      {/* forward path */}
      {[
        "M140,65 L198,65",
        "M310,65 L368,65",
        "M500,65 L558,65",
        "M630,90 L630,168",
        "M560,195 L502,195",
        "M370,195 L312,195",
        "M200,195 L170,195 L170,65",
      ].map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#e4e2dc" strokeWidth="4" />
          <path d={d} fill="none" stroke={i >= 4 ? "#e8650a" : "#16161a"} strokeWidth="1.6" className="flow" markerEnd="url(#arr)" />
        </g>
      ))}
      <circle cx="170" cy="65" r="9" fill="#fff" stroke="#16161a" />
      <text x="170" y="69" textAnchor="middle" className="fill-ink text-[11px]">
        Σ
      </text>
      <text x="178" y="135" className="fill-pred text-[10px] font-medium">
        F̂ (estimate)
      </text>
      {nodes.map((n) => (
        <g key={n.t}>
          <rect x={n.x} y={n.y} width={n.w} height="50" rx="10" className={BOX} strokeWidth="1.1" />
          <text x={n.x + n.w / 2} y={n.y + 22} textAnchor="middle" className="fill-ink text-[12px] font-semibold">
            {n.t}
          </text>
          <text x={n.x + n.w / 2} y={n.y + 37} textAnchor="middle" className="fill-ink-3 text-[9.5px]">
            {n.s}
          </text>
        </g>
      ))}
      <text x="30" y="250" className="fill-ink-3 text-[10px]">
        Loop runs at 90 Hz (11 ms period), limited by the telemetry buffering path. Inference uses ≈1 ms (p95 2.36 ms) on a laptop GPU.
      </text>
    </svg>
  );
}
