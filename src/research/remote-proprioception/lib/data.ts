import { useEffect, useState } from "react";

// Assets live in portfolio/public/research/remote-proprioception/.
export const BASE = "/research/remote-proprioception";
export const asset = (p: string) => `${BASE}${p.startsWith("/") ? p : `/${p}`}`;

export type TakeMeta = {
  id: string;
  model: "T" | "Q";
  regime: "no-contact" | "standard contact" | "extreme contact";
  movement: string;
  hz: number;
  duration: number;
  mae: { j1: number; j2: number; force: number | null };
};

export type Take = {
  meta: TakeMeta;
  t: number[];
  j1p: number[];
  j1t: (number | null)[];
  j2p: number[];
  j2t: (number | null)[];
  fp: number[];
  ft: (number | null)[];
  pc: number[];
  ct: number[];
};

export type LiveLog = {
  id: string;
  title: string;
  hz: number;
  t: number[];
  est: (number | null)[];
  target: (number | null)[];
  measured: (number | null)[];
  cmd: (number | null)[];
};

const cache = new Map<string, Promise<unknown>>();
function load<T>(url: string): Promise<T> {
  if (!cache.has(url)) cache.set(url, fetch(asset(url)).then((r) => r.json()));
  return cache.get(url) as Promise<T>;
}

export function useJson<T>(url: string | null): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    if (!url) return;
    let alive = true;
    setData(null);
    load<T>(url).then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, [url]);
  return data;
}

export const MOVEMENT_LABEL: Record<string, string> = {
  hinge_hold_100: "Hinge hold",
  flex_hold_100: "Flex hold",
  flex_hinge_async_100: "Flex + hinge async",
  random_poses: "Random poses",
};

export const COLORS = {
  truth: "#2a6fdb",
  pred: "#e8650a",
  target: "#6b7280",
  motor: "#9ca3af",
};
