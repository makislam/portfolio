import { Component, ReactNode, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import LineChart, { Series } from "./LineChart";
import type { FingerState } from "./FingerScene";
import { COLORS, MOVEMENT_LABEL, Take, useJson } from "../lib/data";

const FingerScene = lazy(() => import("./FingerScene"));

// Keeps a failed 3D load (no WebGL, chunk fetch error) from blanking the whole page.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return <div className="grid h-full place-items-center px-6 text-center text-sm text-ink-3">3D view unavailable. Reload to try again.</div>;
    return this.props.children;
  }
}

const GROUPS = [
  { key: "T", label: "No contact", tag: "Model T", sub: "no contact", takes: ["Take_04", "Take_07", "Take_28"] },
  { key: "Q", label: "Contact", tag: "Model Q", sub: "standard contact", takes: ["take_202", "take_209", "take_220"] },
  { key: "X", label: "Hyperextension", tag: "Model Q", sub: "extreme / hyperextension", takes: ["Take_102", "Take_108", "Take_119"] },
] as const;

const MOVEMENT: Record<string, string> = {
  Take_04: "hinge_hold_100",
  Take_07: "flex_hinge_async_100",
  Take_28: "random_poses",
  take_202: "flex_hold_100",
  take_209: "flex_hinge_async_100",
  take_220: "random_poses",
  Take_102: "flex_hold_100",
  Take_108: "flex_hinge_async_100",
  Take_119: "random_poses",
};

const takeNum = (id: string) => id.replace(/^[Tt]ake_0?/, "");

function indexAt(t: number[], time: number) {
  let lo = 0,
    hi = t.length - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (t[m] < time) lo = m + 1;
    else hi = m;
  }
  return lo;
}

export default function TakeExplorer({ initial = "take_220", compact = false }: { initial?: string; compact?: boolean }) {
  const [takeId, setTakeId] = useState(initial);
  const take = useJson<Take>(`/data/takes/${takeId}.json`);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [time, setTime] = useState(0);
  const [showTruth, setShowTruth] = useState(true);
  const [showPred, setShowPred] = useState(true);

  const timeRef = useRef(0);
  const stateRef = useRef<FingerState>({ j1: 0, j2: 0, j1p: 0, j2p: 0, force: 0, contact: 0, showTruth: true, showPred: true });

  const apply = useCallback(
    (tt: number) => {
      if (!take) return;
      const i = indexAt(take.t, tt);
      const s = stateRef.current;
      // gated mocap frames (occlusion) hold the last valid ground-truth pose
      s.j1 = take.j1t[i] ?? s.j1;
      s.j2 = take.j2t[i] ?? s.j2;
      s.j1p = take.j1p[i];
      s.j2p = take.j2p[i];
      s.force = take.fp[i];
      s.contact = take.pc[i];
    },
    [take],
  );

  useEffect(() => {
    const onSelect = (e: Event) => {
      setTakeId((e as CustomEvent<string>).detail);
      setPlaying(true);
    };
    window.addEventListener("select-take", onSelect);
    return () => window.removeEventListener("select-take", onSelect);
  }, []);

  useEffect(() => {
    stateRef.current.showTruth = showTruth;
    stateRef.current.showPred = showPred;
  }, [showTruth, showPred]);

  useEffect(() => {
    timeRef.current = 0;
    setTime(0);
    apply(0);
  }, [take, apply]);

  useEffect(() => {
    if (!take || !playing) return;
    let raf = 0;
    let last = performance.now();
    let lastUi = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      let tt = timeRef.current + dt * speed;
      if (tt > take.meta.duration) tt = 0;
      timeRef.current = tt;
      apply(tt);
      if (now - lastUi > 66) {
        setTime(tt);
        lastUi = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [take, playing, speed, apply]);

  const scrub = useCallback(
    (tt: number) => {
      timeRef.current = tt;
      setTime(tt);
      apply(tt);
    },
    [apply],
  );

  const isContact = take?.meta.model === "Q";
  const series = useMemo(() => {
    if (!take) return null;
    const pair = (truth: (number | null)[], pred: number[], unit: string): Series[] => [
      { label: "ground truth", values: truth, color: COLORS.truth, unit },
      { label: "predicted", values: pred, color: COLORS.pred, unit },
    ];
    return {
      j1: pair(take.j1t, take.j1p, "°"),
      j2: pair(take.j2t, take.j2p, "°"),
      f: pair(take.ft, take.fp, " N"),
      c: [{ label: "P(contact)", values: take.pc, color: COLORS.pred, unit: "" }] as Series[],
    };
  }, [take]);

  const i = take ? indexAt(take.t, time) : 0;
  const group = GROUPS.find((g) => (g.takes as readonly string[]).includes(takeId))!;
  const chartH = compact ? 92 : 104;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_40px_-20px_rgba(0,0,0,0.18)]">
      {/* take selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2.5 sm:px-4">
        {GROUPS.map((g) => (
          <div key={g.key} className="flex items-center gap-1 rounded-full border border-line bg-paper/60 p-0.5 pl-2.5">
            <span className="mr-1 text-[11px] font-medium text-ink-2">
              {g.label} <span className="text-ink-3">· {g.tag}</span>
            </span>
            {g.takes.map((id, n) => (
              <button
                key={id}
                onClick={() => setTakeId(id)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium tabular-nums transition ${
                  id === takeId ? "bg-ink text-white" : "text-ink-2 hover:bg-white"
                }`}
                title={`Take ${takeNum(id)} · ${MOVEMENT_LABEL[MOVEMENT[id]]}`}
              >
                {n + 1}
              </button>
            ))}
          </div>
        ))}
        <p className="px-1 text-[11px] text-ink-3 lg:ml-auto">Examples 1–3: random held-out test takes, unseen in training</p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* 3D */}
        <div className="relative h-[340px] border-b border-line sm:h-[420px] lg:h-auto lg:min-h-[460px] lg:border-r lg:border-b-0">
          <SceneBoundary>
            <Suspense fallback={<div className="grid h-full place-items-center text-sm text-ink-3">Loading MuJoCo model…</div>}>
              <FingerScene stateRef={stateRef} className="absolute inset-0" />
            </Suspense>
          </SceneBoundary>
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5 text-[11px]">
            <span className="rounded-full border border-line bg-white/90 px-2.5 py-1 font-medium">
              Take {takeNum(takeId)} · {MOVEMENT_LABEL[MOVEMENT[takeId]]}
            </span>
            <span className="w-fit rounded-full border border-line bg-white/90 px-2.5 py-1 text-ink-2">
              held-out test take · {group.sub}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-1.5 text-[11px]">
            <button
              onClick={() => setShowTruth((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium transition ${showTruth ? "border-truth/40 bg-white" : "border-line bg-white/60 text-ink-3 line-through"}`}
            >
              <span className="h-2.5 w-2.5 rounded-sm bg-[#c9d8f3] ring-1 ring-truth/50" /> Ground truth (mocap)
            </button>
            <button
              onClick={() => setShowPred((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium transition ${showPred ? "border-pred/40 bg-white" : "border-line bg-white/60 text-ink-3 line-through"}`}
            >
              <span className="h-2.5 w-2.5 rounded-sm bg-pred/50 ring-1 ring-pred/60" /> Prediction
            </button>
          </div>
          <span className="pointer-events-none absolute bottom-3 right-3 hidden text-[11px] text-ink-3 sm:block">drag to orbit</span>
        </div>

        {/* charts */}
        <div className="flex min-w-0 flex-col gap-1 px-2 py-3 sm:px-3">
          <div className="flex items-center gap-4 px-2 pb-1 text-[11px] text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-truth" /> ground truth
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-pred" /> predicted
            </span>
            {isContact && (
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-3 bg-truth/15" /> in contact (truth)
              </span>
            )}
          </div>
          {series && take ? (
            <>
              <LineChart t={take.t} series={series.j1} yLabel="Joint 1 (°)" height={chartH} playhead={time} onScrub={scrub} showXAxis={false} />
              <LineChart t={take.t} series={series.j2} yLabel="Joint 2 (°)" height={chartH} playhead={time} onScrub={scrub} showXAxis={!isContact} />
              {isContact && (
                <>
                  <LineChart t={take.t} series={series.f} yLabel="Force (N)" height={chartH} playhead={time} onScrub={scrub} showXAxis={false} digits={2} />
                  <LineChart
                    t={take.t}
                    series={series.c}
                    yLabel="P(contact)"
                    height={chartH - 14}
                    playhead={time}
                    onScrub={scrub}
                    band={take.ct}
                    bandLabel="in contact (truth)"
                    yDomain={[0, 1]}
                    digits={2}
                  />
                </>
              )}
              {!isContact && (
                <p className="px-2 pt-2 text-[12px] leading-relaxed text-ink-3">
                  Model T is trained on free-space motion only, so its force and contact heads are not evaluated. Switch to a Model Q
                  take to see contact force and onset.
                </p>
              )}
            </>
          ) : (
            <div className="grid h-60 place-items-center text-sm text-ink-3">Loading take…</div>
          )}
        </div>
      </div>

      {/* transport + stats */}
      <div className="flex flex-wrap items-center gap-3 border-t border-line px-3 py-2.5 sm:px-4">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="1" width="3" height="10" fill="currentColor" /><rect x="7" y="1" width="3" height="10" fill="currentColor" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z" fill="currentColor" /></svg>
          )}
        </button>
        <div className="flex rounded-full border border-line p-0.5 text-[11px]">
          {[1, 2, 5].map((s) => (
            <button key={s} onClick={() => setSpeed(s)} className={`rounded-full px-2 py-0.5 tabular-nums ${speed === s ? "bg-paper font-semibold" : "text-ink-3"}`}>
              {s}×
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={take?.meta.duration ?? 1}
          step={0.01}
          value={time}
          onChange={(e) => scrub(+e.target.value)}
          className="h-1 min-w-[120px] flex-1 accent-[#e8650a]"
          aria-label="Timeline"
        />
        <span className="w-24 text-right font-mono text-[11px] tabular-nums text-ink-3">
          {time.toFixed(1)} / {take?.meta.duration.toFixed(0) ?? "–"} s
        </span>
      </div>
      {take && (
        <div className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
          <Stat label="Joint 1 MAE (this take)" value={`${take.meta.mae.j1.toFixed(2)}°`} />
          <Stat label="Joint 2 MAE (this take)" value={`${take.meta.mae.j2.toFixed(2)}°`} />
          <Stat label="Force MAE (this take)" value={take.meta.mae.force != null ? `${take.meta.mae.force.toFixed(2)} N` : "—"} />
          <Stat
            label="Now: J1 / J2 error"
            value={
              take.j1t[i] != null && take.j2t[i] != null
                ? `${Math.abs(take.j1p[i] - take.j1t[i]!).toFixed(1)}° / ${Math.abs(take.j2p[i] - take.j2t[i]!).toFixed(1)}°`
                : "occluded"
            }
            live
          />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div className="border-line px-4 py-3 [&:not(:last-child)]:border-r">
      <div className="flex items-center gap-1.5 text-[11px] text-ink-3">
        {live && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-pred" />}
        {label}
      </div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight">{value}</div>
    </div>
  );
}
