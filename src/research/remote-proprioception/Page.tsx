import LiveForce from "./components/LiveForce";
import { Clip } from "./components/Media";
import MethodSteps from "./components/MethodSteps";
import { HeadlineTable, ModalityCompare } from "./components/Results";
import TakeExplorer from "./components/TakeExplorer";
import TakeLink from "./components/TakeLink";
import CopyBlock from "./components/CopyBlock";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { asset } from "./lib/data";
import "./styles.css";

const TITLE = "Learned Remote Proprioception & Contact Force Estimation";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

const BIBTEX = `@inproceedings{anonymous2027remoteproprioception,
  title     = {Learned Remote Proprioception and Contact Force Estimation
               from Motor and Load Cell Signals},
  author    = {Anonymous Author(s)},
  booktitle = {Under review, IEEE International Conference on Robotics and Automation (ICRA)},
  year      = {2027}
}`;

const NAV = [
  ["Method", "#method"],
  ["Results", "#results"],
  ["MuJoCo", "#mujoco"],
  ["Live control", "#live"],
  ["Discussion", "#discussion"],
  ["BibTeX", "#bibtex"],
];

function SectionHead({ n, tag, title, lead }: { n: string; tag: string; title: string; lead?: string }) {
  return (
    <div className="mb-6 max-w-3xl">
      <div className="section-tag">
        {n} — {tag}
      </div>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-[34px]">{title}</h2>
      {lead && <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{lead}</p>}
    </div>
  );
}

function KeyNumber({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-xl border border-line bg-card px-4 py-3">
      <div className="text-2xl font-semibold tracking-tight tabular-nums">{v}</div>
      <div className="mt-0.5 text-[12px] leading-snug text-ink-3">{l}</div>
    </div>
  );
}

export default function RemoteProprioception() {
  // Title and fonts for client-side navigation; the static HTML for this route is
  // generated at build time by scripts/prerender-research.mjs.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = TITLE;
    if (!window.location.hash) window.scrollTo(0, 0);
    let link = document.querySelector<HTMLLinkElement>(`link[href="${FONTS_HREF}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONTS_HREF;
      document.head.appendChild(link);
    }
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="rp-root min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur">
        <nav className="mx-auto flex h-12 max-w-6xl items-center gap-6 px-4">
          <Link to="/" aria-label="Back to portfolio" title="Back to portfolio" className="block h-8 w-8 overflow-hidden rounded-full ring-1 ring-line transition hover:ring-pred">
            <img src="/favicon.png" alt="" className="h-full w-full object-cover" />
          </Link>
          <div className="ml-auto hidden gap-5 text-[12.5px] text-ink-2 md:flex">
            {NAV.map(([l, h]) => (
              <a key={h} href={h} className="hover:text-ink">
                {l}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4">
        {/* ---------------------------------------------------------------- hero */}
        <section className="pt-12 pb-10 text-center sm:pt-16">
          <h1 className="mx-auto max-w-4xl text-[30px] font-semibold leading-[1.12] tracking-tight sm:text-[44px]">
            Learned Remote Proprioception and Contact Force Estimation from Motor and Load Cell Signals
          </h1>
          <p className="mt-4 text-[14px] text-ink-2">Anonymous Author(s)</p>
          <p className="mt-1 text-[12.5px] text-ink-3">Under review at ICRA 2027</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-[13px]">
            <a href="#video" className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-medium text-white">
              <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z" fill="currentColor" /></svg> Video
            </a>
            <a href={asset("/paper.pdf")} className="rounded-full border border-line bg-card px-4 py-2 font-medium hover:border-ink" target="_blank" rel="noreferrer">
              Paper <span className="text-ink-3">· PDF</span>
            </a>
            <span className="rounded-full border border-line bg-card px-4 py-2 font-medium text-ink-3">
              Code <span className="text-[11px]">· coming soon</span>
            </span>
          </div>
        </section>

        <TakeExplorer initial="take_220" />
        <p className="mx-auto mt-4 max-w-3xl text-center text-[13px] leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">Live, in your browser:</span> held-out test takes replayed on our MuJoCo model of the
          hand. The <span className="font-medium text-truth">solid finger</span> is the motion-capture ground truth and the{" "}
          <span className="font-medium text-pred">orange ghost</span> is what the network reads from motor and load-cell signals alone.
          No sensor ever touches the finger. Pick any take; drag the plots to scrub.
        </p>

        {/* ---------------------------------------------------------------- overview */}
        <section id="video" className="grid scroll-mt-16 items-center gap-8 py-20 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <p className="text-[17px] leading-relaxed text-ink">
              Soft, printed fingers are cheap, tough and safe, but they are hard to sense. Embedding encoders or tactile skins adds
              cost and failure points and stiffens the very material that makes them compliant.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
              We leave the finger completely sensorless. Everything is measured at the wrist: motor position, velocity, current and
              command, plus the tension in each tendon from an in-line load cell. A shared-trunk GRU turns those 11 channels into{" "}
              <b className="text-ink">joint angles</b>, <b className="text-ink">contact force</b> and <b className="text-ink">contact onset</b>{" "}
              for a multi-tendon, two-joint finger, accurately enough to close a force-control loop at 90 Hz.
            </p>
          </div>
          <figure>
            <Clip src="/videos/overview.mp4" poster="/videos/overview.jpg" controls className="aspect-video w-full rounded-2xl bg-black shadow-lg" />
            <figcaption className="mt-2 text-[12px] text-ink-3">
              <b className="text-ink-2">Overview video</b> (2 min, with sound): hardware, mocap data collection, model evaluation and live
              force control.
            </figcaption>
          </figure>
        </section>

        <div className="grid grid-cols-2 gap-3 pb-6 md:grid-cols-5">
          <KeyNumber v="4.11°" l="joint MAE under standard contact" />
          <KeyNumber v="0.34 N" l="contact-force MAE (baseline 0.92 N)" />
          <KeyNumber v="0.79" l="contact-onset F1" />
          <KeyNumber v="0.32 N" l="closed-loop force-tracking MAE" />
          <KeyNumber v="90 Hz" l="real-time loop, ≈1 ms inference" />
        </div>

        {/* ---------------------------------------------------------------- method */}
        <section id="method" className="scroll-mt-16 py-20">
          <SectionHead
            n="01"
            tag="Method"
            title="How it works"
            lead="From a sensorless printed finger to closed-loop force control in six steps. The diagrams in steps 2, 4, 5 and 6 are interactive or animated."
          />
          <MethodSteps />
        </section>

        {/* ---------------------------------------------------------------- results */}
        <section id="results" className="scroll-mt-16 py-20">
          <SectionHead
            n="02"
            tag="Results"
            title="Accurate in normal use, honest about where it breaks"
            lead="Two models share one architecture. Model T is trained on free-space motion for kinematics. Model Q is trained on 75 takes (no-contact, standard and extreme contact) for kinematics, force and contact. Each is evaluated on held-out takes it never saw."
          />
          <HeadlineTable />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                h: "Free-space kinematics",
                b: "Model T tracks unscripted random poses with 2.24° mean joint error (1.3° / 2.0° on Take 28), with little phase lag.",
                takes: [["Take_28", "Take 28 · random"], ["Take_07", "Take 7 · async"]],
              },
              {
                h: "Contact: all three outputs",
                b: "Under standard contact, Model Q gets 4.11° joint error, 0.34 N force MAE (ρ = 0.73) and F1 0.79, and rarely fires in free space.",
                takes: [["take_202", "Take 202 · flex hold"], ["take_220", "Take 220 · random"]],
              },
              {
                h: "Failure mode: buckling",
                b: "Forced hyperextension makes the soft body buckle non-linearly. Joint error rises to 15.2° (peaking at 45.8° on joint 1, Take 102) and force ρ drops to 0.22.",
                takes: [["Take_102", "Take 102 · extreme"], ["Take_119", "Take 119 · extreme"]],
              },
            ].map((c) => (
              <div key={c.h} className="rounded-2xl border border-line bg-card p-4">
                <h3 className="font-semibold tracking-tight">{c.h}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{c.b}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.takes.map(([id, l]) => (
                    <TakeLink key={id} id={id} label={l} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- mujoco */}
        <section id="mujoco" className="scroll-mt-16 py-20">
          <SectionHead
            n="03"
            tag="MuJoCo"
            title="Seeing the estimate in simulation"
            lead="Offline MuJoCo renders of held-out takes at 7.5× real time, driven by the same prediction files as the paper figures. The wrist follows its mocap pose; the solid finger is ground truth and the translucent orange finger is the model. Any gap between them is pure joint-angle error."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["/videos/ModelT_Eval_Take28_Mujoco.mp4", "Model T · Take 28", "Random poses, free space"],
              ["/videos/ModelQ_Eval_Take220_Mujoco.mp4", "Model Q · Take 220", "Random poses with contact"],
            ].map(([src, h, s]) => (
              <figure key={src} className="overflow-hidden rounded-2xl border border-line bg-white">
                <Clip src={src} poster={src.replace(".mp4", ".jpg")} className="aspect-[4/3] w-full object-cover" />
                <figcaption className="border-t border-line px-4 py-2.5 text-[12.5px]">
                  <b>{h}</b> <span className="text-ink-3">· {s}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- live */}
        <section id="live" className="scroll-mt-16 py-20">
          <SectionHead
            n="04"
            tag="Application"
            title="Closed-loop force control with no force sensor in the loop"
            lead="Model Q runs live on a laptop GPU, and its filtered estimate is the only force feedback the PID controller receives. The model was trained on one instrumented finger and runs on both without retraining."
          />
          <LiveForce />
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <KeyNumber v="0.32 N" l="overall MAE; steady-state error < 0.4 N up to 4 N" />
            <KeyNumber v="0.99 ms" l="mean inference (p95 2.36 ms) per 300-sample window" />
            <KeyNumber v="52,484" l="trainable parameters (0.21 MB, fp32)" />
            <KeyNumber v="5–10 %" l="load-proportional under-estimate at higher forces" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-card p-5 text-[14px] leading-relaxed text-ink-2">
              <h3 className="mb-1.5 font-semibold text-ink">Setpoint holds are rock-steady</h3>
              Holding a fixed force is very stable. The small bias grows with load, from −0.06 N at a 2.8 N target to −0.38 N at 4.1 N. That fits
              the active hinge deflecting more under higher load.
            </div>
            <div className="rounded-2xl border border-line bg-card p-5 text-[14px] leading-relaxed text-ink-2">
              <h3 className="mb-1.5 font-semibold text-ink">Steps reveal the filter&apos;s lag</h3>
              After a setpoint step, the real force overshoots by 15–35 % for 2–3 s while the smoothed estimate ramps cleanly. The largest
              errors (down to −2.4 N) sit only at step edges and resolve within 2 s. This is phase lag from the τ = 0.75 s EMA, not estimator
              bias.
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- discussion */}
        <section id="discussion" className="scroll-mt-16 py-20">
          <SectionHead
            n="05"
            tag="Discussion"
            title="Are tendon load cells worth it?"
            lead="Load cells add cost, wiring and an amplifier board. To isolate what they buy, we retrain both models without them (Models U and V, 9 channels) on identical splits."
          />
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <ModalityCompare />
            <div className="space-y-4 text-[14px] leading-relaxed text-ink-2">
              <p>
                <b className="text-ink">In free space they don&apos;t help:</b> 2.24° vs 2.14°, within training noise. With no external load,
                drive current is a good enough proxy for tension.
              </p>
              <p>
                <b className="text-ink">In contact, they do:</b> about 0.7° better joint accuracy under standard loading. The bigger gain is in
                how well the force <i>shape</i> is tracked: Spearman ρ 0.48 vs 0.40 pooled and 0.22 vs 0.08 in the extreme regime.
              </p>
              <p>
                <b className="text-ink">Why:</b> as a loaded motor nears stall, its current is distorted by drivetrain friction and unmodelled
                compliance, and it saturates past the overload threshold. A tendon load cell keeps measuring.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Limitation · structural buckling", "Extreme hyperextension pushes the finger out of distribution. Both modalities degrade to about 15° joint error, so the limit there is the deformation, not the sensing."],
              ["Limitation · bandwidth", "Inference is ~1 ms of the 11 ms period. Almost all estimator lag comes from the EMA filter and telemetry path, which limits high-frequency force dynamics."],
              ["Next", "Adaptive filtering and phase compensation for higher closed-loop bandwidth, plus estimates of contact location and coarse object state."],
            ].map(([h, b]) => (
              <div key={h} className="rounded-2xl border border-line bg-card p-4">
                <h3 className="text-[13px] font-semibold">{h}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- bibtex */}
        <section id="bibtex" className="scroll-mt-16 py-16">
          <SectionHead n="06" tag="Cite" title="BibTeX" />
          <CopyBlock text={BIBTEX} />
        </section>
      </main>

      <section aria-label="Funding and collaboration" className="border-t border-line bg-white/60 py-16 text-center">
        <div className="section-tag">Funded by · In collaboration with</div>
        <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-x-16 gap-y-10 px-4">
          <img src={asset("/logos/nsf.svg")} alt="National Science Foundation" className="h-28 w-auto sm:h-32" loading="lazy" />
          <img src={asset("/logos/cmu.svg")} alt="Carnegie Mellon University" className="h-14 w-auto sm:h-16" loading="lazy" />
          <span className="flex items-center gap-4">
            <img src={asset("/logos/futurhand.png")} alt="" className="h-16 w-16 sm:h-20 sm:w-20" loading="lazy" />
            <span className="text-[22px] font-semibold tracking-tight sm:text-[26px]">FuturHand Robotics</span>
          </span>
        </div>
      </section>

      <footer className="border-t border-line py-8 text-center text-[12px] text-ink-3">
        Anonymous submission · ICRA 2027 · Page layout inspired by{" "}
        <a className="underline" href="https://real2sem2real.github.io/" target="_blank" rel="noreferrer">
          Real2Sem2Real
        </a>
      </footer>
    </div>
  );
}
