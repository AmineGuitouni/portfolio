"use client";

import { AnimatePresence, motion } from "motion/react";
import { LuCheck, LuCpu, LuFileDown, LuLoader, LuPause, LuPlay, LuSparkles, LuWrench } from "react-icons/lu";
import { SiRust } from "react-icons/si";
import { EASE, SectionHeading, serif } from "@/components/home/shared";
import { hash, useActiveTime, Watch } from "../canvas";
import { ACCENT, usd } from "./tokens";

function Tile({ title, text, className = "", children }: { title: string; text: string; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={`flex flex-col overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white p-6 md:p-7 ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[#55554F]">{text}</p>
      <div className="mt-6 flex-1">{children}</div>
    </motion.div>
  );
}

/* ── Remote updates ─────────────────────────────────────────────────────── */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Customer activity per weekday and hour: quiet nights, busy evenings, busier weekends.
const ACTIVITY = DAYS.map((_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    const day = Math.exp(-((h - 11) ** 2) / 10) * 0.6 + Math.exp(-((h - 19) ** 2) / 8);
    const weekend = d >= 5 ? 1.35 : 1;
    // Rounded so the server-rendered colours match the browser's (Math.exp/sin differ in the last digits).
    return Math.round(Math.min(1, (h < 6 ? 0.04 : day * weekend * 0.8 + 0.08) + hash(d * 24 + h) * 0.12) * 100) / 100;
  }),
);
const QUIET = (() => {
  let best = { d: 0, h: 0, v: Infinity };
  ACTIVITY.forEach((row, d) => row.forEach((v, h) => h < 23 && v + row[h + 1] < best.v && (best = { d, h, v: v + row[h + 1] })));
  return best;
})();

const CHECKS = ["Kiosk confirmed the pause", "Every money row reached the cloud", "No payment in progress", "No request or command waiting", "Heartbeat in the last 2 minutes"];

function UpdateDemo({ active }: { active: boolean }) {
  const t = useActiveTime(active, 9, 15);
  const paused = t > 1.2 && t < 12.6;
  const checks = CHECKS.filter((_, i) => t > 1.9 + i * 0.5).length;
  const k1 = Math.min(1, Math.max(0, (t - 5) / 3));
  const k2 = Math.min(1, Math.max(0, (t - 8.4) / 2.6));
  const kiosks = [
    { name: "Kiosk 1 · main", p: k1, note: "backup → migrate → restart" },
    { name: "Kiosk 2", p: k2, note: "after kiosk 1 succeeds" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.05fr]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8A85]">Activity · last 8 weeks</p>
        <div className="mt-2 space-y-[3px]">
          {ACTIVITY.map((row, d) => (
            <div key={d} className="flex items-center gap-[3px]">
              <span className="w-7 font-mono text-[9.5px] text-[#8A8A85]">{DAYS[d]}</span>
              {row.map((v, h) => {
                const quiet = d === QUIET.d && (h === QUIET.h || h === QUIET.h + 1);
                return (
                  <span
                    key={h}
                    className="aspect-square flex-1 rounded-[2px]"
                    style={{ background: `rgba(46,107,255,${(0.08 + v * 0.85).toFixed(3)})`, outline: quiet ? "2px solid #111" : undefined, outlineOffset: quiet ? 1 : undefined }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-[#55554F]">
          Quietest window:{" "}
          <b className="font-semibold text-[#111]">
            {DAYS[QUIET.d]} {String(QUIET.h).padStart(2, "0")}:00–{String(QUIET.h + 2).padStart(2, "0")}:00
          </b>
          , in the store&apos;s time zone.
        </p>
      </div>

      <div className="rounded-2xl bg-[#FAFAF7] p-4">
        <div className="flex items-center justify-between">
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${paused ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
            {paused ? <LuPause className="size-3" /> : <LuPlay className="size-3" />}
            {paused ? "Store paused" : "Store open"}
          </span>
          <span className="font-mono text-[10.5px] text-[#8A8A85]">{t < 1.2 ? "Pause store →" : t > 12.6 ? "Resumed" : checks === 5 ? "Safe to update" : "Checking…"}</span>
        </div>
        <ul className="mt-3 space-y-1.5">
          {CHECKS.map((c, i) => (
            <li key={c} className="flex items-center gap-2 text-[12px]">
              <motion.span className="flex size-4 items-center justify-center rounded-full" animate={{ background: i < checks ? "#16a34a" : "rgba(0,0,0,0.08)" }}>
                {i < checks && <LuCheck className="size-2.5 text-white" strokeWidth={4} />}
              </motion.span>
              <span className={i < checks ? "text-[#111]" : "text-[#8A8A85]"}>{c}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2.5 border-t border-black/[0.06] pt-3">
          {kiosks.map((k) => (
            <div key={k.name}>
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium">{k.name}</span>
                <span className="font-mono text-[10.5px] text-[#8A8A85]">{k.p >= 1 ? "a1c9e2 → 7f04b1 ✓" : k.p > 0 ? k.note : "waiting"}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${k.p * 100}%`, background: k.p >= 1 ? "#16a34a" : ACCENT }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── AI analyst ─────────────────────────────────────────────────────────── */

const BRIEF = "Revenue is up 8% on last week, led by Riverside's evening dryers. Washer 6 at Northgate declined 9 taps since Friday, more than any other machine.";

function AnalystDemo({ active }: { active: boolean }) {
  const t = useActiveTime(active, 8, 13);
  const chars = Math.floor(Math.max(0, t - 0.6) * 55);
  const done = chars >= BRIEF.length;
  return (
    <div className="rounded-2xl bg-[#FAFAF7] p-4">
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
        <LuSparkles className="size-3" /> Weekly brief
      </p>
      <p className="mt-2 min-h-[88px] text-[13px] leading-relaxed">
        {BRIEF.slice(0, chars)}
        {!done && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse" style={{ background: ACCENT }} />}
      </p>
      <div className="mt-2 space-y-1.5">
        {[
          { Icon: LuWrench, text: "Open an issue for Washer 6" },
          { Icon: LuSparkles, text: "Draft an offer for 42 idle cards" },
        ].map((a, i) => (
          <motion.div
            key={a.text}
            className="flex items-center justify-between rounded-xl border border-black/[0.07] bg-white px-3 py-2 text-[12px]"
            initial={false}
            animate={{ opacity: done && t > 4 + i * 0.3 ? 1 : 0, y: done && t > 4 + i * 0.3 ? 0 : 8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <span className="flex items-center gap-2">
              <a.Icon className="size-3.5 text-[#55554F]" /> {a.text}
            </span>
            <span style={{ color: ACCENT }}>→</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Firmware ───────────────────────────────────────────────────────────── */

const FLEET = ["W1", "W2", "W3", "W4", "D1", "D2"];

function FirmwareDemo({ active }: { active: boolean }) {
  const t = useActiveTime(active, 9, 12);
  return (
    <div>
      <div className="flex items-center justify-between rounded-xl border border-black/[0.07] px-3 py-2">
        <span className="flex items-center gap-2 text-[12px] font-medium">
          <LuCpu className="size-3.5" /> washer_dryer 0.9.78
        </span>
        <motion.span className="rounded-full px-2 py-0.5 font-mono text-[10px]" animate={{ background: t > 1.4 ? ACCENT : "rgba(0,0,0,0.06)", color: t > 1.4 ? "#fff" : "#55554F" }}>
          {t > 1.4 ? "assigned · Riverside" : "md5 3f9c…e1"}
        </motion.span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {FLEET.map((m, i) => {
          const start = 2.2 + i * 0.9;
          const p = Math.min(1, Math.max(0, (t - start) / 1.6));
          return (
            <div key={m} className="rounded-lg bg-[#FAFAF7] px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-semibold">{m}</span>
                {p >= 1 ? <LuCheck className="size-3 text-emerald-600" strokeWidth={3} /> : p > 0 ? <LuLoader className="size-3 animate-spin text-[#8A8A85]" /> : null}
              </div>
              <p className="font-mono text-[9.5px] text-[#8A8A85]">{p >= 1 ? "0.9.78" : "0.9.77"}</p>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/[0.06]">
                <div className="h-full rounded-full" style={{ width: `${p * 100}%`, background: p >= 1 ? "#16a34a" : ACCENT }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Cash collection ────────────────────────────────────────────────────── */

function CashDemo({ active }: { active: boolean }) {
  const t = useActiveTime(active, 6, 10);
  const expected = 124000;
  const counted = t < 1.5 ? 0 : Math.min(123600, Math.round(((t - 1.5) / 1.8) * 123600 / 100) * 100);
  const posted = t > 3.8;
  return (
    <div className="space-y-2 font-mono text-[12px]">
      <div className="flex justify-between rounded-xl bg-[#FAFAF7] px-3 py-2">
        <span className="text-[#8A8A85]">Expected in box</span>
        <span>{usd(expected)}</span>
      </div>
      <div className="flex justify-between rounded-xl border border-black/[0.07] px-3 py-2">
        <span className="text-[#8A8A85]">Counted</span>
        <span className="tabular-nums">{usd(counted)}</span>
      </div>
      <motion.div className="flex justify-between rounded-xl px-3 py-2" initial={false} animate={{ opacity: posted ? 1 : 0.25, background: posted ? "rgba(225,29,72,0.07)" : "rgba(0,0,0,0)" }}>
        <span className="text-rose-600">cash_over_short</span>
        <span className="text-rose-600">−$4.00</span>
      </motion.div>
    </div>
  );
}

/* ── Rust worker ────────────────────────────────────────────────────────── */

// One worker, so each job starts when it is queued or when the one before it finishes.
const JOBS = [
  { name: "Store export · xlsx", size: "2.4 MB", at: 0.6, run: 2.2 },
  { name: "Store export · csv", size: "1.1 MB", at: 1.2, run: 1.6 },
  { name: "Platform export · sql.gz", size: "38 MB", at: 1.8, run: 3.4 },
].reduce<{ name: string; size: string; at: number; start: number; end: number }[]>((jobs, j) => {
  const start = Math.max(j.at, jobs.length ? jobs[jobs.length - 1].end : 1);
  return [...jobs, { name: j.name, size: j.size, at: j.at, start, end: start + j.run }];
}, []);

function WorkerDemo({ active }: { active: boolean }) {
  const t = useActiveTime(active, 9, 12);
  return (
    <div className="space-y-1.5">
      {JOBS.map((j) => {
        const state = t < j.at ? "hidden" : t < j.start ? "queued" : t < j.end ? "running" : "completed";
        return (
          <AnimatePresence key={j.name}>
            {state !== "hidden" && (
              <motion.div className="flex items-center justify-between rounded-xl border border-black/[0.07] px-3 py-2 text-[12px]" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <span className="flex items-center gap-2">
                  {state === "completed" ? <LuFileDown className="size-3.5 text-emerald-600" /> : state === "running" ? <LuLoader className="size-3.5 animate-spin" style={{ color: ACCENT }} /> : <span className="size-3.5 rounded-full border border-dashed border-black/25" />}
                  {j.name}
                </span>
                <span className={`font-mono text-[10.5px] ${state === "completed" ? "text-emerald-600" : "text-[#8A8A85]"}`}>{state === "completed" ? j.size : state}</span>
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
      <p className="pt-1 font-mono text-[10px] text-[#8A8A85]">claims jobs with FOR UPDATE SKIP LOCKED</p>
    </div>
  );
}

export default function Operations() {
  return (
    <section id="operations" className="px-4 pt-24 md:px-8 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          label="The cloud side"
          accent={ACCENT}
          aside="Owners see every store, staff run the network, and both do it from a browser. One Next.js platform for every company, with its data kept apart. Five pieces of it, working."
        >
          A whole chain, <span className={serif}>from one dashboard.</span>
        </SectionHeading>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <Tile
            className="lg:col-span-2"
            title="Remote updates, no drive to the store"
            text="Pick the quietest hours, pause the store, wait until no money is in flight, then update the kiosks one at a time, the main one first. Before this, someone had to SSH into every Pi."
          >
            <Watch>{({ seen, visible }) => <UpdateDemo active={seen && visible} />}</Watch>
          </Tile>
          <Tile title="An analyst in the dashboard" text="An AI brief on the owner's own numbers. The suggested actions come from the analytics, not from the model's wording.">
            <Watch>{({ seen, visible }) => <AnalystDemo active={seen && visible} />}</Watch>
          </Tile>
          <Tile title="Firmware over the air" text="Upload a build, assign it to a store, and every reader there updates itself and reports its version.">
            <Watch>{({ seen, visible }) => <FirmwareDemo active={seen && visible} />}</Watch>
          </Tile>
          <Tile title="Counting the cash box" text="Staff count the box at the kiosk. Any difference is posted to the ledger, never smoothed over.">
            <Watch>{({ seen, visible }) => <CashDemo active={seen && visible} />}</Watch>
          </Tile>
          <Tile title="Heavy jobs in Rust" text="Exports and resets run in a separate Rust worker, streaming rows to storage instead of holding them in memory.">
            <div className="mb-3 flex items-center gap-2 text-[#8A8A85]">
              <SiRust className="size-4" />
              <span className="font-mono text-[10.5px]">Tokio · SQLx · S3</span>
            </div>
            <Watch>{({ seen, visible }) => <WorkerDemo active={seen && visible} />}</Watch>
          </Tile>
        </div>
      </div>
    </section>
  );
}
