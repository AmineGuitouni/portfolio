"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import type { IconType } from "react-icons";
import { LuWaves, LuCpu, LuMonitorPlay, LuRadioTower, LuServer } from "react-icons/lu";
import { EASE, Eyebrow, Reveal, serif, usePrefersReducedMotion } from "@/components/home/shared";
import { hash, useActiveTime } from "../canvas";
import { ACCENT } from "./tokens";

const STAGES: { title: string; tech: string; text: string; Icon: IconType }[] = [
  { title: "Capture", tech: "Rust · native", text: "Screen, microphone and system audio, straight from Windows.", Icon: LuCpu },
  { title: "Encode", tech: "H.264 · Opus 48 kHz", text: "Mic and speaker audio mixed into one track on the worker's PC.", Icon: LuWaves },
  { title: "Publish", tech: "WebRTC · WHIP", text: "Allowed only during a timed shift, on projects whose policy permits it.", Icon: LuRadioTower },
  { title: "Relay & record", tech: "Go · Pion", text: "Fans out to viewers and writes the session to storage.", Icon: LuServer },
  { title: "Watch", tech: "WHEP live · HLS replay", text: "Live in the admin, or replayed later through a protected proxy.", Icon: LuMonitorPlay },
];

function Stage({ stage, index, progress }: { stage: (typeof STAGES)[number]; index: number; progress: MotionValue<number> }) {
  const at = index / (STAGES.length - 1);
  const on = useTransform(progress, [0, Math.max(0, at - 0.06), at, 1], [0, 0, 1, 1]);
  const border = useTransform(on, [0, 1], ["rgba(255,255,255,0.12)", "rgba(255,106,61,0.9)"]);
  const color = useTransform(on, [0, 1], ["rgba(255,255,255,0.45)", "rgba(255,106,61,1)"]);
  const glow = useTransform(on, [0, 1], ["0 0 0 0px rgba(255,106,61,0)", "0 0 0 6px rgba(255,106,61,0.14)"]);
  const text = useTransform(on, [0, 1], [0.45, 1]);
  return (
    <li className="relative flex gap-4 md:flex-col md:gap-0">
      <motion.span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border bg-[#111]" style={{ borderColor: border, color, boxShadow: glow }}>
        <stage.Icon className="size-[18px]" />
      </motion.span>
      <motion.div className="md:mt-5 md:pr-4" style={{ opacity: text }}>
        <p className="font-medium text-white">{stage.title}</p>
        <p className="mt-0.5 font-mono text-[11px] text-[#FF6A3D]">{stage.tech}</p>
        <p className="mt-2 text-sm leading-snug text-white/55">{stage.text}</p>
      </motion.div>
    </li>
  );
}

const WORKERS = [
  { name: "Sara K.", status: "Interview · 04:12", focus: true },
  { name: "Jonas K.", status: "On call · 01:37" },
  { name: "Lea M.", status: "Wissen open" },
  { name: "Tim S.", status: "Interview · 08:55" },
  { name: "Nora B.", status: "Break" },
  { name: "Elif A.", status: "On call · 00:21" },
];

/** A stylised worker screen: the app's layout in blocks, with a moving cursor on the focused one. */
function MiniScreen({ seed, focus, t }: { seed: number; focus?: boolean; t: number }) {
  const cx = Math.round((30 + Math.sin(t * 0.9 + seed) * 22 + 20) * 100) / 100;
  const cy = Math.round((40 + Math.cos(t * 0.7 + seed) * 14) * 100) / 100;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-[#f8f7f5]">
      <div className="absolute inset-y-0 left-0 w-[9%] bg-[#fcfaf8] shadow-[1px_0_0_#eadfd5]" />
      <div className="absolute left-[14%] right-[5%] top-[10%] h-[9%] rounded-sm bg-white shadow-[0_0_0_1px_#f4ede7]" />
      <div className="absolute left-[14%] top-[26%] h-[62%] w-[48%] rounded-sm bg-white shadow-[0_0_0_1px_#f4ede7]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mx-[8%] mt-[9%] h-[11%] rounded-[2px]" style={{ background: i === Math.floor(seed + t / 2) % 3 ? "#d3570d" : "#eadfd5" }} />
        ))}
      </div>
      <div className="absolute right-[5%] top-[26%] h-[62%] w-[26%] rounded-sm bg-white shadow-[0_0_0_1px_#f4ede7]">
        <div className="mx-[12%] mt-[14%] h-[30%] rounded-[2px] bg-[#ecfdf3]" />
        <div className="mx-[12%] mt-[10%] h-[30%] rounded-[2px] bg-[#fffbeb]" />
      </div>
      {focus && <span className="absolute size-2 rounded-full border border-white bg-[#111] transition-all duration-100" style={{ left: `${cx}%`, top: `${cy}%` }} />}
    </div>
  );
}

function MonitorWall({ active }: { active: boolean }) {
  const t = useActiveTime(active, 3);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {WORKERS.map((w, i) => (
        <div key={w.name} className={`rounded-xl border p-2 ${w.focus ? "border-[#FF6A3D] bg-[#FF6A3D]/10" : "border-white/10 bg-white/[0.03]"}`}>
          <MiniScreen seed={i * 1.7} focus={w.focus} t={t} />
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[12px] font-medium text-white">{w.name}</p>
              <p className="truncate text-[10.5px] text-white/45">{w.status}</p>
            </div>
            <div className="flex h-4 items-end gap-[2px]">
              {[0, 1, 2, 3].map((b) => (
                <span key={b} className="w-[3px] rounded-full bg-[#FF6A3D] transition-[height] duration-100" style={{ height: w.status === "Break" ? 2 : 3 + hash(Math.floor(t * 8) + b * 13 + i * 7) * 13 }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const STATES = ["idle", "starting", "publishing", "failed"] as const;
// One round of the desktop's streaming state machine: it fails once, then heals itself.
const SCRIPT: { state: (typeof STATES)[number]; until: number; note: string; at: string }[] = [
  { state: "idle", until: 1, note: "Shift not started", at: "08:57:40" },
  { state: "starting", until: 2.2, note: "Token signed, offer sent", at: "08:58:02" },
  { state: "publishing", until: 6, note: "Streaming", at: "08:58:03" },
  { state: "failed", until: 7.2, note: "Network dropped", at: "10:41:17" },
  { state: "starting", until: 8.4, note: "Stale session cleared, retrying", at: "10:41:19" },
  { state: "publishing", until: 12, note: "Back without anyone noticing", at: "10:41:20" },
];

function StateMachine({ active }: { active: boolean }) {
  const t = useActiveTime(active, 3, 12);
  const index = Math.max(0, SCRIPT.findIndex((s) => t < s.until));
  const now = SCRIPT[index];
  const log = SCRIPT.slice(0, index + 1).slice(-4);
  const tone = (s: string) => (s === "failed" ? "#f87171" : s === "publishing" ? "#4ade80" : ACCENT);
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {STATES.map((s) => {
          const on = now.state === s;
          return (
            <div
              key={s}
              className="rounded-lg border px-2 py-2.5 text-center font-mono text-[11px] transition-all duration-300"
              style={on ? { borderColor: tone(s), color: tone(s), background: `${tone(s)}1a` } : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
            >
              {s}
            </div>
          );
        })}
      </div>
      <ol className="mt-4 space-y-1.5 font-mono text-[11.5px]">
        {log.map((entry, i) => (
          <motion.li
            key={entry.at}
            layout
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: i === log.length - 1 ? 1 : 0.45, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white/40">{entry.at}</span>
            <span className="size-1.5 rounded-full" style={{ background: tone(entry.state) }} />
            <span className="text-white/80">{entry.note}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function Supervision() {
  const reduced = usePrefersReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const live = useInView(panel, { margin: "-10% 0px" });
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 0.85", "start 0.35"] });
  const progress = useTransform(scrollYProgress, (v) => (reduced ? 1 : v));
  const flowing = useTransform(progress, [0, 0.9, 1], [0, 0, 1]);

  return (
    <section id="supervision" className="px-4 pt-24 md:px-8 md:pt-36">
      <motion.div
        ref={panel}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#111] px-6 py-16 text-white md:px-14 md:py-20"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="pointer-events-none absolute -left-40 -top-40 size-[30rem] rounded-full bg-[#FF6A3D] opacity-20 blur-[120px]" />
        <div className="relative">
          <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
            <div>
              <Eyebrow index="03" dark>Supervision</Eyebrow>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
                <Reveal>Every screen, live.</Reveal>
                <Reveal delay={0.08} className={`${serif} text-[#FF6A3D]`}>And on replay.</Reveal>
              </h2>
            </div>
            <p className="max-w-sm text-white/60">
              Supervisors check quality by watching an interviewer&apos;s screen and hearing both sides of the call, live or afterwards. The whole media path is built in-house.
            </p>
          </div>

          <div ref={track} className="relative mt-14 md:mt-20">
            <div className="absolute bottom-0 left-[21px] top-0 w-px bg-white/10 md:bottom-auto md:left-[22px] md:right-[calc(20%-22px)] md:top-[22px] md:h-px md:w-auto" />
            <motion.div
              className="absolute left-[20px] top-0 h-full w-[3px] origin-top rounded-full bg-[#FF6A3D] md:hidden"
              style={{ scaleY: progress }}
            />
            <motion.div
              className="absolute left-[22px] right-[calc(20%-22px)] top-[21px] hidden h-[3px] origin-left rounded-full bg-[#FF6A3D] md:block"
              style={{ scaleX: progress }}
            />
            {!reduced && (
              <motion.div className="absolute left-[22px] right-[calc(20%-22px)] top-[22px] hidden md:block" style={{ opacity: flowing }}>
                {[0, 1, 2, 3].map((k) => (
                  <span
                    key={k}
                    className="absolute top-0 size-2 -translate-y-1/2 rounded-[2px] shadow-[0_0_14px_rgba(255,106,61,0.9)]"
                    style={{ background: k % 2 ? "#fff" : ACCENT, animation: `mt-flow 3.2s linear ${k * 0.8}s infinite` }}
                  />
                ))}
              </motion.div>
            )}
            <ol className="relative grid gap-8 md:grid-cols-5 md:gap-0">
              {STAGES.map((stage, i) => (
                <Stage key={stage.title} stage={stage} index={i} progress={progress} />
              ))}
            </ol>
          </div>

          <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-[1.45fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">Floor view</p>
                <p className="flex items-center gap-2 font-mono text-[11px] text-white/50">
                  <span className="size-1.5 animate-pulse rounded-full bg-red-500" /> 6 live
                </p>
              </div>
              <MonitorWall active={live} />
            </div>
            <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-medium">It heals itself</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                The desktop app remembers whether it <em>should</em> be streaming. If the network drops, it renegotiates on its own. A conflict on reconnect clears the stale session and retries once, so supervisors never see a frozen tile.
              </p>
              <div className="mt-auto pt-6">
                <StateMachine active={live} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
