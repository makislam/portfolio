import { useEffect, useRef, useState } from "react";
import { asset } from "../lib/data";

type ClipProps = {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  /** Only show this part of the video (seconds). Controls then cover just this range. */
  start?: number;
  end?: number;
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// Player whose timeline covers only [start, end] of the file, so viewers can't scrub to the rest.
function RangedPlayer({ src, className, start, end }: { src: string; className: string; start: number; end?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(start);
  const [duration, setDuration] = useState(0);
  const stop = end ?? duration;
  const stopRef = useRef(stop);
  stopRef.current = stop;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onMeta = () => {
      setDuration(v.duration);
      v.currentTime = start;
    };
    if (v.readyState >= 1) onMeta();
    v.addEventListener("loadedmetadata", onMeta);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, [start]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !playing) return;
    let raf = 0;
    const tick = () => {
      if (stopRef.current && v.currentTime >= stopRef.current - 0.02) {
        v.pause();
        v.currentTime = start;
        setTime(start);
        setPlaying(false);
        return;
      }
      setTime(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, start]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };
  const seek = (t: number) => {
    if (ref.current) ref.current.currentTime = t;
    setTime(t);
  };

  const btn = "flex h-7 w-7 items-center justify-center rounded-full text-white hover:bg-white/20";
  return (
    <div ref={wrap} className="group relative h-full w-full">
      <video ref={ref} src={asset(src)} className={className} muted={muted} playsInline preload="metadata" onClick={toggle} />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-white">
        <button onClick={toggle} className={btn} aria-label={playing ? "Pause" : "Play"}>
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="1" width="3" height="10" fill="currentColor" /><rect x="7" y="1" width="3" height="10" fill="currentColor" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z" fill="currentColor" /></svg>
          )}
        </button>
        <span className="w-20 text-[11px] tabular-nums">
          {fmt(Math.max(0, time - start))} / {fmt(Math.max(0, stop - start))}
        </span>
        <input
          type="range"
          min={start}
          max={stop || start + 1}
          step={0.01}
          value={Math.min(Math.max(time, start), stop || start + 1)}
          onChange={(e) => seek(+e.target.value)}
          className="h-1 min-w-0 flex-1 accent-white"
          aria-label="Timeline"
        />
        <button onClick={() => setMuted((m) => !m)} className={`${btn} text-[10px]`} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? "🔇" : "🔊"}
        </button>
        <button onClick={() => wrap.current?.requestFullscreen?.()} className={btn} aria-label="Fullscreen">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8" /></svg>
        </button>
      </div>
    </div>
  );
}

// Muted looping clip that only plays while on screen.
export function Clip({ src, poster, className = "", controls = false, start = 0, end }: ClipProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const ranged = start > 0 || end !== undefined;

  useEffect(() => {
    const v = ref.current;
    if (!v || controls) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [controls]);

  if (controls && ranged) return <RangedPlayer src={src} className={className} start={start} end={end} />;

  return (
    <video
      ref={ref}
      src={asset(src)}
      poster={poster ? asset(poster) : undefined}
      className={className}
      muted={!controls}
      loop={!controls}
      playsInline
      controls={controls}
      preload="metadata"
    />
  );
}

export function Img({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(src)} alt={alt} className={className} loading="lazy" />;
}
