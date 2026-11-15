"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import type { IconType } from "react-icons";
import { LuBanknote, LuDatabase, LuServer } from "react-icons/lu";
import { SiNextdotjs, SiRust } from "react-icons/si";
import { TbDoor, TbWashMachine, TbWashTumbleDry } from "react-icons/tb";
import { EASE, Eyebrow, serif, usePrefersReducedMotion } from "@/components/home/shared";
import { Canvas } from "../canvas";
import { ACCENT } from "./tokens";

const W = 1040;
const H = 520;

type Band = { id: string; label: string; y: number; h: number; appear: [number, number] };

const BANDS: Band[] = [
  { id: "cloud", label: "Cloud · one for the network", y: 8, h: 150, appear: [0.56, 0.68] },
  { id: "store", label: "Store · on site", y: 194, h: 150, appear: [0.3, 0.42] },
  { id: "machines", label: "Machines · one reader each", y: 388, h: 128, appear: [0.04, 0.16] },
];

type Box = { id: string; band: string; name: string; tech: string; line?: string; Icon: IconType; x: number; y: number; w: number; h: number; dark?: boolean };

const BOXES: Box[] = [
  { id: "data", band: "cloud", name: "Data", tech: "PostgreSQL · Redis · RustFS", line: "Every store's synced copy", Icon: LuDatabase, x: 40, y: 44, w: 260, h: 96 },
  { id: "saas", band: "cloud", name: "Launderer cloud", tech: "Next.js 16 · TypeScript", line: "Dashboards, sync API, AI", Icon: SiNextdotjs, x: 370, y: 44, w: 300, h: 96, dark: true },
  { id: "worker", band: "cloud", name: "Job worker", tech: "Rust · Tokio · SQLx", line: "Exports and resets", Icon: SiRust, x: 740, y: 44, w: 260, h: 96 },
  { id: "k1", band: "store", name: "Kiosk 1 · main", tech: "Flutter · Express · Postgres", line: "Touchscreen + payment backend", Icon: LuServer, x: 140, y: 226, w: 260, h: 96, dark: true },
  { id: "k2", band: "store", name: "Kiosk 2 · standby", tech: "Same stack, replica database", line: "Takes over on its own", Icon: LuServer, x: 500, y: 226, w: 260, h: 96 },
  { id: "bb", band: "store", name: "Cash changer", tech: "Flutter · Python", line: "Bills in, coins out", Icon: LuBanknote, x: 810, y: 226, w: 200, h: 96 },
];

const MACHINES = [
  { id: "w1", name: "Washer 1", tech: "RS232", Icon: TbWashMachine },
  { id: "w2", name: "Washer 2", tech: "RS232", Icon: TbWashMachine },
  { id: "d1", name: "Dryer 1", tech: "Pulse", Icon: TbWashTumbleDry },
  { id: "d2", name: "Dryer 2", tech: "Pulse", Icon: TbWashTumbleDry },
  { id: "door", name: "Door", tech: "Relay", Icon: TbDoor },
].map((m, i) => ({ ...m, cx: 115 + i * 202.5 }));

const BUS_Y = 368;

const EDGES: { id: string; d: string; draw: [number, number]; dashed?: boolean; label?: string; lx?: number; ly?: number; up?: boolean; down?: boolean }[] = [
  ...MACHINES.map((m, i) => ({ id: `m-${m.id}`, d: `M${m.cx} 410 V${BUS_Y}`, draw: [0.4 + i * 0.015, 0.47 + i * 0.015] as [number, number], up: true })),
  { id: "bus", d: `M${MACHINES[0].cx} ${BUS_Y} H${MACHINES[4].cx}`, draw: [0.4, 0.5], label: "store network · HTTP", lx: 418, ly: BUS_Y },
  { id: "k1-bus", d: `M270 322 V${BUS_Y}`, draw: [0.46, 0.5] },
  { id: "k2-bus", d: `M630 322 V${BUS_Y}`, draw: [0.47, 0.51] },
  { id: "bb-bus", d: `M910 322 V${BUS_Y}`, draw: [0.48, 0.52] },
  { id: "repl", d: "M400 274 H500", draw: [0.46, 0.54], dashed: true, label: "replica", lx: 450, ly: 274 },
  { id: "sync", d: "M270 226 C270 184 470 186 470 140", draw: [0.68, 0.76], label: "sync · sales ↑ commands ↓", lx: 336, ly: 176, up: true, down: true },
  { id: "beat", d: "M630 226 C630 184 570 186 570 140", draw: [0.7, 0.78], dashed: true, label: "heartbeat", lx: 662, ly: 176 },
  { id: "saas-data", d: "M300 92 H370", draw: [0.68, 0.74] },
  { id: "saas-worker", d: "M670 92 H740", draw: [0.69, 0.75] },
];

const CAPTIONS = [
  {
    title: (
      <>
        A reader in <span className={serif}>every machine.</span>
      </>
    ),
    body: "Each washer, dryer and door has an ESP32 card reader. It takes card taps, talks to the washer's controller over RS232, pulses the dryers, and updates itself over the air.",
  },
  {
    title: (
      <>
        A small <span className={serif}>cluster</span> in every store.
      </>
    ),
    body: "Two or three Raspberry Pi kiosks run the touchscreen, the payment backend and a PostgreSQL database replicated between them. A store needs nothing else to keep selling.",
  },
  {
    title: (
      <>
        One cloud for the <span className={serif}>whole network.</span>
      </>
    ),
    body: "Every sale syncs up to a multi-tenant platform where owners run their stores. Commands come back down the same way: refunds, prices, firmware, updates.",
  },
];

function useAppear(progress: MotionValue<number>, [a, b]: [number, number]) {
  const opacity = useTransform(progress, [0, a, b, 1], [0, 0, 1, 1]);
  const y = useTransform(progress, [0, a, b, 1], [24, 24, 0, 0]);
  return { opacity, y };
}

function BandLayer({ band, progress, children }: { band: Band; progress: MotionValue<number>; children: React.ReactNode }) {
  const style = useAppear(progress, band.appear);
  return (
    <motion.div className="absolute inset-0" style={style}>
      <div className="absolute inset-x-0 rounded-[22px] border border-black/[0.06] bg-white/60" style={{ top: band.y, height: band.h }}>
        <span className="absolute left-4 top-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A8A85]">{band.label}</span>
      </div>
      {children}
    </motion.div>
  );
}

function BoxCard({ box }: { box: Box }) {
  return (
    <div
      className={`absolute z-[1] flex flex-col justify-center rounded-2xl border p-4 shadow-[0_24px_50px_-34px_rgba(0,0,0,0.45)] ${box.dark ? "border-transparent bg-[#111] text-white" : "border-black/[0.07] bg-white"}`}
      style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
    >
      <div className="flex items-center gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${box.dark ? "bg-white/10" : "bg-[#111] text-white"}`}>
          <box.Icon className="size-4" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-[14.5px] font-semibold tracking-tight">{box.name}</p>
          <p className={`truncate font-mono text-[10.5px] ${box.dark ? "text-white/55" : "text-[#8A8A85]"}`}>{box.tech}</p>
        </div>
      </div>
      {box.line && <p className={`mt-2.5 text-[12px] ${box.dark ? "text-white/75" : "text-[#55554F]"}`}>{box.line}</p>}
    </div>
  );
}

function MachineChip({ m }: { m: (typeof MACHINES)[number] }) {
  return (
    <div className="absolute z-[1] flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-white px-3.5 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.45)]" style={{ left: m.cx - 82, top: 410, width: 164, height: 76 }}>
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FF]" style={{ color: ACCENT }}>
        <m.Icon className="size-5" />
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-white bg-emerald-500" />
      </span>
      <div className="leading-tight">
        <p className="text-[13.5px] font-semibold tracking-tight">{m.name}</p>
        <p className="font-mono text-[10px] text-[#8A8A85]">ESP32 · {m.tech}</p>
      </div>
    </div>
  );
}

function Edge({ edge, progress, live }: { edge: (typeof EDGES)[number]; progress: MotionValue<number>; live: MotionValue<number> }) {
  const [a, b] = edge.draw;
  const length = useTransform(progress, [0, a, b, 1], [0, 0, 1, 1]);
  const label = useTransform(progress, [0, b - 0.02, b + 0.03, 1], [0, 0, 1, 1]);
  const seed = edge.id.length;
  return (
    <>
      <svg className="pointer-events-none absolute inset-0 overflow-visible" width={W} height={H}>
        {edge.dashed ? (
          <motion.path d={edge.d} fill="none" stroke="#111" strokeOpacity={0.35} strokeWidth="1.5" strokeDasharray="4 5" style={{ opacity: length }} className="[animation:mt-dash_1.2s_linear_infinite]" />
        ) : (
          <motion.path d={edge.d} fill="none" stroke="#111" strokeOpacity={0.3} strokeWidth="1.5" style={{ pathLength: length }} />
        )}
        <motion.g style={{ opacity: live }}>
          {/* Paths are drawn from the lower box up, so 0→1 is a sale going up and 1→0 a command coming down. */}
          {edge.up && (
            <circle r="3.5" fill={ACCENT}>
              <animateMotion dur={`${1.6 + (seed % 4) * 0.25}s`} begin={`${(seed % 5) * 0.3}s`} repeatCount="indefinite" path={edge.d} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
            </circle>
          )}
          {edge.down && (
            <circle r="3" fill="#111" fillOpacity="0.55">
              <animateMotion dur="2.6s" begin="1.2s" repeatCount="indefinite" path={edge.d} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
            </circle>
          )}
        </motion.g>
      </svg>
      {edge.label && (
        <motion.span
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-black/[0.08] bg-[#FAFAF7] px-2 py-0.5 font-mono text-[10.5px] text-[#55554F]"
          style={{ left: edge.lx, top: edge.ly, opacity: label }}
        >
          {edge.label}
        </motion.span>
      )}
    </>
  );
}

function Diagram({ progress, live }: { progress: MotionValue<number>; live: MotionValue<number> }) {
  return (
    <Canvas width={W} height={H}>
      {BANDS.map((band) => (
        <BandLayer key={band.id} band={band} progress={progress}>
          {band.id === "machines" && MACHINES.map((m) => <MachineChip key={m.id} m={m} />)}
          {BOXES.filter((b) => b.band === band.id).map((b) => (
            <BoxCard key={b.id} box={b} />
          ))}
        </BandLayer>
      ))}
      {EDGES.map((edge) => (
        <Edge key={edge.id} edge={edge} progress={progress} live={live} />
      ))}
    </Canvas>
  );
}

/** Small screens: the same three levels as a plain stack. */
function MobileTiers() {
  const levels = [
    { label: "Machines", items: ["ESP32 reader on every washer, dryer and door", "RS232 to washers, pulses to dryers", "Over-the-air updates"] },
    { label: "Store", items: ["2–3 Raspberry Pi kiosks: Flutter + Express", "PostgreSQL replicated between them", "Cash changer beside them"] },
    { label: "Cloud", items: ["Next.js platform for every company", "Sync API, dashboards, AI", "Rust worker for exports and resets"] },
  ];
  return (
    <div className="mt-10 space-y-3 md:hidden">
      {levels.map((l) => (
        <div key={l.label} className="rounded-2xl border border-black/[0.07] bg-white p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: ACCENT }}>
            {l.label}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[#55554F]">
            {l.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
      {CAPTIONS.map((c, i) => (
        <p key={i} className="pt-3 text-[#55554F]">
          {c.body}
        </p>
      ))}
    </div>
  );
}

export default function Tiers() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, (v) => (reduced ? 1 : v));
  const live = useTransform(progress, [0, 0.78, 0.84, 1], [0, 0, 1, 1]);
  const [caption, setCaption] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setCaption(v < 0.28 ? 0 : v < 0.58 ? 1 : 2));

  return (
    <section id="system" className="px-4 md:px-8">
      <div className="mx-auto max-w-6xl md:hidden">
        <Eyebrow index="01" accent={ACCENT}>
          The system
        </Eyebrow>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em]">Machines, stores and a cloud.</h2>
        <MobileTiers />
      </div>

      <div ref={ref} className="relative hidden h-[340vh] md:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center pt-20">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex items-end justify-between gap-10">
              <div className="min-h-[9.5rem] max-w-2xl">
                <Eyebrow index="01" accent={ACCENT}>
                  The system, from the bottom up
                </Eyebrow>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={caption} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
                    <h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] lg:text-5xl">{CAPTIONS[caption].title}</h2>
                    <p className="mt-3 max-w-xl text-[#55554F]">{CAPTIONS[caption].body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <ol className="hidden shrink-0 gap-2 pb-2 lg:flex">
                {CAPTIONS.map((_, i) => (
                  <li key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === caption ? "w-8" : "w-1.5 bg-black/15"}`} style={i === caption ? { background: ACCENT } : undefined} />
                ))}
              </ol>
            </div>
            <div className="mx-auto mt-8 w-full" style={{ maxWidth: `calc((100vh - 300px) * ${W / H})` }}>
              <Diagram progress={progress} live={live} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
