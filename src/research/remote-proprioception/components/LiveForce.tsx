import { useMemo, useState } from "react";
import LineChart, { Series } from "./LineChart";
import { Clip } from "./Media";
import { COLORS, LiveLog, useJson } from "../lib/data";

type Window = { label: string; d: [number, number] | null };
type Run = {
  label: string;
  camera: string;
  plot: string;
  /** Legend label for the load-cell trace; null when the run has no ground-truth force. */
  measuredLabel: string | null;
  windows: Window[];
  note: string;
  videoRange: { start: number; end?: number };
};

// Raspberry first: it is the headline demo.
const RUNS: Record<"test5" | "test3", Run> = {
  test5: {
    label: "Raspberry grasp",
    camera: "/videos/raspberry.mp4",
    plot: "/videos/raspberry_plot.mp4",
    measuredLabel: null,
    windows: [{ label: "Second grasp · 0.6 → 4.8 N step", d: [79, 107.47] }],
    note: "A raspberry has no built-in force sensor, so there is no ground-truth force here: the plot shows the model's estimate against the controller's target.",
    videoRange: { start: 79 },
  },
  test3: {
    label: "Setpoint tracking",
    camera: "/videos/test3_cam.mp4",
    plot: "/videos/test3_plot.mp4",
    measuredLabel: "measured (load cell)",
    windows: [{ label: "Fig. 10 · 1.5 N hold, then 2.75 N", d: [16, 42] }],
    note: "Both fingers squeeze a load-cell apparatus. The controller sees only the model's estimate; the apparatus records the true force. Over the 1.5 N hold (Fig. 10), MAE is 0.24 N.",
    videoRange: { start: 16, end: 42 },
  },
};

type RunKey = keyof typeof RUNS;

export default function LiveForce() {
  const [run, setRun] = useState<RunKey>("test5");
  const [win, setWin] = useState(RUNS.test5.windows.length - 1);
  const [media, setMedia] = useState<"camera" | "plot">("camera");
  const cfg = RUNS[run];
  const log = useJson<LiveLog>(`/data/live/${run}.json`);

  const series = useMemo<Series[] | null>(() => {
    if (!log) return null;
    const out: Series[] = [];
    if (cfg.measuredLabel) out.push({ label: cfg.measuredLabel, values: log.measured, color: COLORS.truth, unit: " N" });
    out.push(
      { label: "estimated (model)", values: log.est, color: COLORS.pred, unit: " N" },
      { label: "target", values: log.target, color: COLORS.target, dashed: true, unit: " N", width: 1.2 },
    );
    return out;
  }, [log, cfg]);

  const domain = cfg.windows[win]?.d ?? undefined;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5">
        {(Object.keys(RUNS) as RunKey[]).map((k) => (
          <button
            key={k}
            onClick={() => {
              setRun(k);
              setWin(RUNS[k].windows.length - 1);
            }}
            className={`rounded-full px-3 py-1 text-[12px] font-medium ${k === run ? "bg-ink text-white" : "text-ink-2 hover:bg-paper"}`}
          >
            {RUNS[k].label}
          </button>
        ))}
        <div className="ml-auto flex rounded-full border border-line p-0.5 text-[11px]">
          {(["camera", "plot"] as const).map((m) => (
            <button key={m} onClick={() => setMedia(m)} className={`rounded-full px-2.5 py-0.5 ${media === m ? "bg-paper font-semibold" : "text-ink-3"}`}>
              {m === "camera" ? "Camera" : "Live plot recording"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="bg-black">
          <Clip key={`${run}-${media}`} {...cfg.videoRange} src={media === "camera" ? cfg.camera : cfg.plot} poster={(media === "camera" ? cfg.camera : cfg.plot).replace(".mp4", ".jpg")} controls className="aspect-video h-full w-full object-contain" />
        </div>
        <div className="flex min-w-0 flex-col p-3">
          {cfg.windows.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 px-1">
              {cfg.windows.map((w, k) => (
                <button
                  key={w.label}
                  onClick={() => setWin(k)}
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] ${k === win ? "border-ink font-semibold" : "border-line text-ink-3"}`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-[11px] text-ink-2">
            {cfg.measuredLabel && (
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-truth" /> {cfg.measuredLabel}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-pred" /> estimated (model)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 border-t border-dashed border-[#6b7280]" /> target
            </span>
          </div>
          {log && series ? (
            <LineChart t={log.t} series={series} yLabel="Contact force (N)" height={250} domain={domain} digits={2} />
          ) : (
            <div className="grid h-[250px] place-items-center text-sm text-ink-3">Loading log…</div>
          )}
          <p className="px-1 text-[12px] leading-relaxed text-ink-3">{cfg.note}</p>
        </div>
      </div>
    </div>
  );
}
