"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import type { IconType } from "react-icons";
import { SiGo, SiNextdotjs, SiSupabase, SiTauri } from "react-icons/si";
import { EASE, Eyebrow, serif, usePrefersReducedMotion } from "@/components/home/shared";
import { Canvas } from "../canvas";
import { ACCENT } from "./tokens";

const W = 1040;
const H = 490;

type Node = {
  id: string;
  name: string;
  tech: string;
  who: string;
  lines: string[];
  Icon: IconType;
  cx: number;
  cy: number;
  w: number;
  h: number;
  appear: [number, number];
};

const NODES: Node[] = [
  {
    id: "web",
    name: "Web platform",
    tech: "Next.js 16 · TypeScript",
    who: "For operations staff",
    lines: ["17 admin modules", "Worker portal", "Public site in 4 languages"],
    Icon: SiNextdotjs,
    cx: 150,
    cy: 130,
    w: 260,
    h: 168,
    appear: [0.04, 0.16],
  },
  {
    id: "desktop",
    name: "Desktop app",
    tech: "Tauri 2 · Rust · React",
    who: "For interviewers",
    lines: ["Timer & overlay", "Interviews + softphone", "Screen & audio streaming"],
    Icon: SiTauri,
    cx: 890,
    cy: 130,
    w: 260,
    h: 168,
    appear: [0.1, 0.22],
  },
  {
    id: "go",
    name: "API & media server",
    tech: "Go · Gin · Pion WebRTC",
    who: "Between desktop and data",
    lines: ["Sessions, leases, mail", "Knowledge search + AI", "WebRTC relay → HLS"],
    Icon: SiGo,
    cx: 520,
    cy: 382,
    w: 300,
    h: 168,
    appear: [0.16, 0.28],
  },
];

const EDGES = [
  { id: "web-core", d: "M280 130 H420", label: "server actions", lx: 350, ly: 108, draw: [0.34, 0.44] },
  { id: "desktop-core", d: "M760 130 H620", label: "realtime", lx: 690, ly: 108, draw: [0.38, 0.48], dashed: true },
  { id: "web-go", d: "M150 214 C150 330 250 382 370 382", label: "admin API", lx: 196, ly: 338, draw: [0.42, 0.52] },
  { id: "desktop-go", d: "M890 214 C890 330 790 382 670 382", label: "HTTP · JWT · WebRTC", lx: 834, ly: 338, draw: [0.46, 0.56] },
  { id: "go-core", d: "M520 298 V205", label: "service role", lx: 574, ly: 252, draw: [0.5, 0.6] },
] as const;

const CAPTIONS = [
  {
    title: (
      <>
        Three apps for <span className={serif}>three kinds</span> of people.
      </>
    ),
    body: "Operations staff work in the browser and interviewers in a Windows desktop app. A Go server sits between the desktop and the data.",
  },
  {
    title: (
      <>
        One <span className={serif}>source of truth</span> underneath.
      </>
    ),
    body: "All three read and write one Supabase Postgres database: tables, row-level security, storage buckets and about 26,000 lines of SQL.",
  },
  {
    title: (
      <>
        And all of it is <span className={serif}>live.</span>
      </>
    ),
    body: "Presence, chat, call status and settings push over Realtime. When an admin changes a worker's phone line, their desktop app reloads it within seconds.",
  },
];

function NodeCard({ node, progress }: { node: Node; progress: MotionValue<number> }) {
  const [a, b] = node.appear;
  const opacity = useTransform(progress, [0, a, b, 1], [0, 0, 1, 1]);
  const y = useTransform(progress, [0, a, b, 1], [28, 28, 0, 0]);
  const scale = useTransform(progress, [0, a, b, 1], [0.94, 0.94, 1, 1]);
  return (
    <motion.div
      className="absolute flex flex-col rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_30px_60px_-36px_rgba(0,0,0,0.35)]"
      style={{ left: node.cx - node.w / 2, top: node.cy - node.h / 2, width: node.w, height: node.h, opacity, y, scale }}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#111] text-white">
          <node.Icon className="size-4" />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-tight">{node.name}</p>
          <p className="font-mono text-[10.5px] text-[#8A8A85]">{node.tech}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-1 text-[12.5px] text-[#2a2a27]">
        {node.lines.map((line) => (
          <li key={line} className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-[#FF6A3D]" />
            {line}
          </li>
        ))}
      </ul>
      <p className="mt-auto text-[11px] font-medium text-[#8A8A85]">{node.who}</p>
    </motion.div>
  );
}

function Edge({ edge, progress, live }: { edge: (typeof EDGES)[number]; progress: MotionValue<number>; live: MotionValue<number> }) {
  const [a, b] = edge.draw;
  const length = useTransform(progress, [0, a, b, 1], [0, 0, 1, 1]);
  const label = useTransform(progress, [0, b - 0.03, b + 0.03, 1], [0, 0, 1, 1]);
  const dashed = "dashed" in edge && edge.dashed;
  return (
    <>
      <svg className="pointer-events-none absolute inset-0 overflow-visible" width={W} height={H}>
        {dashed ? (
          <motion.path d={edge.d} fill="none" stroke="#111" strokeOpacity={0.35} strokeWidth="1.5" strokeDasharray="4 5" style={{ opacity: length }} className="[animation:mt-dash_1.2s_linear_infinite]" />
        ) : (
          <motion.path d={edge.d} fill="none" stroke="#111" strokeOpacity={0.35} strokeWidth="1.5" style={{ pathLength: length }} />
        )}
        <motion.g style={{ opacity: live }}>
          {[0, 1].map((k) => (
            <circle key={k} r="3.5" fill={ACCENT}>
              <animateMotion dur={`${2.2 + k * 0.4}s`} begin={`${k * 1.1}s`} repeatCount="indefinite" path={edge.d} keyPoints={k ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
            </circle>
          ))}
        </motion.g>
      </svg>
      <motion.span
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-black/[0.08] bg-[#FAFAF7] px-2 py-0.5 font-mono text-[10.5px] text-[#55554F]"
        style={{ left: edge.lx, top: edge.ly, opacity: label }}
      >
        {edge.label}
      </motion.span>
    </>
  );
}

function Core({ live }: { live: MotionValue<number> }) {
  return (
    <div className="absolute" style={{ left: 420, top: 55, width: 200, height: 150 }}>
      <motion.div className="absolute -inset-5 rounded-[2rem] bg-[#3ECF8E]/25 blur-2xl" style={{ opacity: live }} />
      <motion.span
        className="absolute -inset-2 rounded-[1.6rem] border border-[#3ECF8E]"
        style={{ opacity: live }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
      <div className="relative flex h-full flex-col items-center justify-center rounded-3xl bg-[#111] text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
        <SiSupabase className="size-7 text-[#3ECF8E]" />
        <p className="mt-2 text-[16px] font-semibold tracking-tight">Supabase</p>
        <p className="font-mono text-[10.5px] text-white/55">Postgres · Storage · Realtime</p>
      </div>
    </div>
  );
}

function Diagram({ progress, live }: { progress: MotionValue<number>; live: MotionValue<number> }) {
  return (
    <Canvas width={W} height={H}>
      {EDGES.map((edge) => (
        <Edge key={edge.id} edge={edge} progress={progress} live={live} />
      ))}
      <Core live={live} />
      {NODES.map((node) => (
        <NodeCard key={node.id} node={node} progress={progress} />
      ))}
    </Canvas>
  );
}

/** Small screens: the same system as a plain stack, without the scroll choreography. */
function MobileSystem() {
  return (
    <div className="mt-10 space-y-3 md:hidden">
      {[...NODES.slice(0, 2), NODES[2]].map((node) => (
        <div key={node.id} className="rounded-2xl border border-black/[0.07] bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#111] text-white"><node.Icon className="size-4" /></span>
            <div className="leading-tight">
              <p className="font-semibold">{node.name}</p>
              <p className="font-mono text-[11px] text-[#8A8A85]">{node.tech}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-[#55554F]">{node.lines.join(" · ")}</p>
        </div>
      ))}
      <div className="flex items-center gap-3 rounded-2xl bg-[#111] p-4 text-white">
        <SiSupabase className="size-6 text-[#3ECF8E]" />
        <div className="leading-tight">
          <p className="font-semibold">Supabase, shared by all three</p>
          <p className="font-mono text-[11px] text-white/55">Postgres · Storage · Realtime</p>
        </div>
      </div>
      {CAPTIONS.map((c, i) => (
        <p key={i} className="pt-3 text-[#55554F]">{c.body}</p>
      ))}
    </div>
  );
}

export default function System() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, (v) => (reduced ? 1 : v));
  const live = useTransform(progress, [0, 0.62, 0.7, 1], [0, 0, 1, 1]);
  const [caption, setCaption] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setCaption(v < 0.32 ? 0 : v < 0.64 ? 1 : 2));

  return (
    <section id="system" className="px-4 md:px-8">
      <div className="mx-auto max-w-6xl md:hidden">
        <Eyebrow index="01">The system</Eyebrow>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em]">Three apps, one database, all live.</h2>
        <MobileSystem />
      </div>

      <div ref={ref} className="relative hidden h-[300vh] md:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center pt-20">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex items-end justify-between gap-10">
              <div className="min-h-[9.5rem] max-w-2xl">
                <Eyebrow index="01">The system</Eyebrow>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={caption}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.04em] lg:text-5xl">{CAPTIONS[caption].title}</h2>
                    <p className="mt-3 max-w-xl text-[#55554F]">{CAPTIONS[caption].body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <ol className="hidden shrink-0 gap-2 pb-2 lg:flex">
                {CAPTIONS.map((_, i) => (
                  <li key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === caption ? "w-8 bg-[#FF6A3D]" : "w-1.5 bg-black/15"}`} />
                ))}
              </ol>
            </div>
            <div className="mx-auto mt-10 w-full" style={{ maxWidth: `calc((100vh - 320px) * ${W / H})` }}>
              <Diagram progress={progress} live={live} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
