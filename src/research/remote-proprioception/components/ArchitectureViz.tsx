// Generated diagram of the network in Sec. IV-D / Fig. 4: an 11-channel, 300-step (2.5 s @ 120 Hz)
// window feeds a shared 2-layer GRU (hidden 64), whose state drives three task heads.
import { useEffect, useState } from "react";

const CHANNELS = [
  "M1 position",
  "M1 velocity",
  "M1 current",
  "M1 command",
  "M2 position",
  "M2 velocity",
  "M2 current",
  "M2 command",
  "Load cell 1",
  "Load cell 2",
  "time",
];
const COLS = 30;

// smooth illustrative signals, one per channel (not recorded data)
function cell(ch: number, k: number) {
  const f = 0.18 + (ch % 4) * 0.05;
  const v = 0.5 + 0.45 * Math.sin(k * f + ch * 1.3) * Math.cos(k * 0.05 + ch);
  return ch === 10 ? 0.3 : v;
}

const HEADS = [
  { name: "Joint angles", sub: "MLP · masked L1", w: "1.0", out: "θ₁, θ₂" },
  { name: "Contact force", sub: "MLP · masked Huber", w: "1.0", out: "|F| (N)" },
  { name: "Contact onset", sub: "MLP classifier · BCE", w: "0.5", out: "P(contact)" },
];

export default function ArchitectureViz() {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setK((v) => v + 1), 110);
    return () => clearInterval(id);
  }, []);

  const cw = 7,
    ch = 13,
    gx = 92,
    gy = 40;

  return (
    <svg viewBox="0 0 760 330" className="w-full" role="img" aria-label="Model architecture: input window, shared GRU and three heads">
      {/* input window */}
      <text x={gx} y={24} className="fill-ink text-[11px] font-semibold">
        Input window
      </text>
      <text x={gx + 84} y={24} className="fill-ink-3 text-[10px]">
        T = 300 steps · 2.5 s @ 120 Hz
      </text>
      {CHANNELS.map((name, c) => (
        <g key={name}>
          <text x={gx - 6} y={gy + c * ch + 9.5} textAnchor="end" className={`text-[9.5px] ${c >= 8 && c <= 9 ? "fill-pred font-medium" : "fill-ink-2"}`}>
            {name}
          </text>
          {Array.from({ length: COLS }, (_, j) => (
            <rect
              key={j}
              x={gx + j * cw}
              y={gy + c * ch}
              width={cw - 1}
              height={ch - 2}
              rx={1}
              fill={c >= 8 && c <= 9 ? "#e8650a" : c === 10 ? "#8a8a94" : "#2a6fdb"}
              opacity={0.12 + 0.75 * cell(c, j + k)}
            />
          ))}
        </g>
      ))}
      <rect x={gx - 2} y={gy - 3} width={COLS * cw + 3} height={CHANNELS.length * ch + 3} fill="none" stroke="#16161a" strokeWidth="1" rx="3" />
      <text x={gx + COLS * cw} y={gy + CHANNELS.length * ch + 16} textAnchor="end" className="fill-ink-3 text-[9.5px]">
        newest →
      </text>

      {/* arrow to GRU */}
      <path d={`M${gx + COLS * cw + 6},${gy + 70} L345,${gy + 70}`} stroke="#16161a" strokeWidth="1.3" className="flow" fill="none" />

      {/* GRU trunk */}
      <rect x="350" y="40" width="150" height="140" rx="12" fill="#eef3fc" stroke="#2a6fdb" />
      <text x="425" y="62" textAnchor="middle" className="fill-ink text-[12px] font-semibold">
        Shared GRU trunk
      </text>
      <text x="425" y="77" textAnchor="middle" className="fill-ink-3 text-[10px]">
        2 layers · hidden 64 · dropout
      </text>
      {[0, 1].map((l) => (
        <g key={l}>
          {Array.from({ length: 4 }, (_, j) => (
            <g key={j}>
              <rect x={364 + j * 32} y={95 + l * 38} width="24" height="24" rx="5" fill="#fff" stroke="#2a6fdb" />
              <circle cx={376 + j * 32} cy={107 + l * 38} r="4" fill="#2a6fdb" opacity={(k + j + l * 2) % 4 === 0 ? 1 : 0.25} />
              {j < 3 && <path d={`M${388 + j * 32},${107 + l * 38} h8`} stroke="#2a6fdb" />}
            </g>
          ))}
        </g>
      ))}
      <text x="425" y="198" textAnchor="middle" className="fill-ink-3 text-[9.5px]">
        52,484 params · ~1 ms / inference
      </text>

      {/* heads */}
      {HEADS.map((h, i) => {
        const y = 30 + i * 100;
        return (
          <g key={h.name}>
            <path d={`M500,110 C535,110 535,${y + 30} 562,${y + 30}`} stroke="#16161a" strokeWidth="1.2" fill="none" className="flow" />
            <rect x="565" y={y + 5} width="185" height="54" rx="10" fill="#fff" stroke="#e8650a" />
            <text x="577" y={y + 25} className="fill-ink text-[11.5px] font-semibold">
              {h.name} <tspan className="fill-pred font-medium">→ {h.out}</tspan>
            </text>
            <text x="577" y={y + 40} className="fill-ink-3 text-[9.5px]">
              LayerNorm → GELU → Dropout
            </text>
            <text x="577" y={y + 52} className="fill-ink-3 text-[9.5px]">
              {h.sub} · weight {h.w}
            </text>
          </g>
        );
      })}
      <text x="16" y="318" className="fill-ink-3 text-[10px]">
        Adam · lr 4×10⁻⁴ · batch 1024 · ≤ 80 epochs, early stop (15) · EMA weights (0.999) · trained on NVIDIA Jetson Thor
      </text>
    </svg>
  );
}
