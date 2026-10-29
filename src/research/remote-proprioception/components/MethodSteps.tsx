import { ReactNode, useState } from "react";
import ArchitectureViz from "./ArchitectureViz";
import ControlLoop from "./ControlLoop";
import { Clip, Img } from "./Media";
import SensingDiagram from "./SensingDiagram";
import SyncViz from "./SyncViz";

type Step = { key: string; short: string; title: string; caption: string; body: ReactNode };

const MOVEMENTS = [
  ["Flex hold 100 / 80", "Proximal flexion driven to 100 % or 80 % and held", "3 + 3"],
  ["Hinge hold 100 / 80", "Distal hinge driven to 100 % or 80 % and held", "3 + 3"],
  ["Flex–hinge async", "Sequential flexion then hinge actuation", "3"],
  ["Flex–hinge sync", "Simultaneous flexion and hinge actuation", "3"],
  ["Random poses", "Randomly generated joint-command combinations", "9"],
];

const STEPS: Step[] = [
  {
    key: "finger",
    short: "Sensorless finger",
    title: "A finger with nothing inside",
    caption:
      "Each finger is FDM-printed in one piece from foaming TPU (Filaflex Foamy, Bambu Lab H2D). Two material creases form a proximal and a distal joint; two tendons run through printed channels. There are no encoders, skins or wires in the finger, so it keeps its full compliance and you can cut straight through it.",
    body: (
      <div className="grid gap-3 sm:grid-cols-2">
        <figure>
          <Clip src="/videos/hammer.mp4" poster="/videos/hammer.jpg" className="aspect-video w-full rounded-xl bg-black object-cover" />
          <figcaption className="mt-1.5 text-[11.5px] text-ink-3">A hammer strike on the fingers: no electronics to break.</figcaption>
        </figure>
        <figure>
          <Clip src="/videos/finger_cut.mp4" poster="/videos/finger_cut.jpg" className="aspect-video w-full rounded-xl bg-black object-cover" />
          <figcaption className="mt-1.5 text-[11.5px] text-ink-3">Cutting through a finger: only TPU and tendon inside.</figcaption>
        </figure>
      </div>
    ),
  },
  {
    key: "sensing",
    short: "Remote sensing",
    title: "Sense everything from the wrist",
    caption:
      "One Dynamixel XC330 motor per tendon reports position, velocity, commanded position and drive current. A DYLY-109 S-type load cell in each tendon line (24-bit ADS1220 ADC, ESP32, ROS 2) measures tension directly. All of it sits at the wrist, away from the finger.",
    body: <SensingDiagram />,
  },
  {
    key: "truth",
    short: "Ground truth",
    title: "Ground truth from motion capture and a force probe",
    caption:
      "A 120 Hz Vicon system tracks 3 non-planar markers per link plus 8 on the wrist. The Kabsch algorithm (SVD) fits each link to its URDF reference on its own, so off-axis deformation doesn't accumulate along the chain the way it would with full-chain IK. A handheld probe with a DYLY-108 load cell and a tip marker records contact force and location. Only the left finger is instrumented; the right finger is never seen in training.",
    body: (
      <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
        <figure>
          <Img src="/images/mocap.jpg" alt="Vicon markers on the instrumented finger" className="aspect-[3/4] w-full rounded-xl object-cover" />
          <figcaption className="mt-1.5 text-[11.5px] text-ink-3">Markers on the left (training) finger; the right finger stays bare.</figcaption>
        </figure>
        <figure>
          <Img src="/images/probe.jpg" alt="Handheld force probe" className="aspect-[3/4] w-full rounded-xl object-cover" />
          <figcaption className="mt-1.5 text-[11.5px] text-ink-3">Force probe: S-type load cell + tip marker.</figcaption>
        </figure>
      </div>
    ),
  },
  {
    key: "data",
    short: "Sync & dataset",
    title: "Synchronise, then record three regimes",
    caption:
      "Before each trial, tendon pretension is reset by hyperextending the finger and the load cells are tared. A ground tap with the probe aligns the ROS and mocap clocks. Three sessions cover the same movement primitives: free-space (no contact), standard contact against a fixed probe on the distal link, and extreme contact that forces hyperextension.",
    body: (
      <div className="grid gap-3 lg:grid-cols-2">
        <SyncViz />
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-paper/70 text-[11px] text-ink-3">
              <tr>
                <th className="px-3 py-2 font-medium">Movement</th>
                <th className="px-3 py-2 font-medium">Description</th>
                <th className="px-3 py-2 text-right font-medium">Trials</th>
              </tr>
            </thead>
            <tbody>
              {MOVEMENTS.map(([m, d, n]) => (
                <tr key={m} className="border-t border-line">
                  <td className="px-3 py-2 font-medium">{m}</td>
                  <td className="px-3 py-2 text-ink-2">{d}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-line px-3 py-2 text-[11.5px] text-ink-3">Per dataset, for each of: no contact · standard contact · extreme contact.</p>
        </div>
      </div>
    ),
  },
  {
    key: "model",
    short: "Shared GRU",
    title: "One recurrent trunk, three heads",
    caption:
      "Posture and contact force are physically coupled: tendon tension depends on both. A single 2-layer GRU (hidden 64) therefore reads the last 2.5 s of 11-channel telemetry, and its shared state feeds three MLP heads for joint angles, contact force and contact onset. Sharing the trunk regularises across tasks and keeps the model small enough for real-time control.",
    body: (
      <div className="rounded-xl border border-line bg-white p-3 sm:p-4">
        <ArchitectureViz />
      </div>
    ),
  },
  {
    key: "deploy",
    short: "Closed loop",
    title: "Close the loop on the estimate",
    caption:
      "Model Q is trained only on the instrumented finger and deployed to both fingers without retraining. Its force estimate, smoothed by an EMA (τ = 0.75 s), drives a PID controller that modulates the hinge command toward a force setpoint. The external load cell only records ground truth for verification.",
    body: (
      <div className="rounded-xl border border-line bg-white p-3 sm:p-4">
        <ControlLoop />
      </div>
    ),
  },
];

export default function MethodSteps() {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  return (
    <div>
      <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {STEPS.map((s, k) => (
          <button
            key={s.key}
            onClick={() => setI(k)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
              k === i ? "border-ink bg-white shadow-sm" : "border-line text-ink-2 hover:bg-white/70"
            }`}
          >
            <span className={`grid h-4.5 w-4.5 place-items-center rounded-full text-[10px] ${k === i ? "bg-ink text-white" : "bg-line text-ink-2"}`}>{k + 1}</span>
            {s.short}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-line bg-card p-3 sm:p-5">
        {step.body}
        <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
        <p className="mt-1.5 max-w-3xl text-[14px] leading-relaxed text-ink-2">{step.caption}</p>
        <div className="mt-4 flex items-center gap-3 text-[12px]">
          <button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} className="rounded-full border border-line px-3 py-1.5 disabled:opacity-40">
            ← Back
          </button>
          <span className="tabular-nums text-ink-3">
            {i + 1} / {STEPS.length}
          </span>
          <button
            onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}
            disabled={i === STEPS.length - 1}
            className="rounded-full bg-ink px-3 py-1.5 font-medium text-white disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
