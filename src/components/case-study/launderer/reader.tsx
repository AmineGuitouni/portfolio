"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuNfc, LuRotateCcw } from "react-icons/lu";
import { EASE } from "@/components/home/shared";
import { useActiveTime } from "../canvas";
import { ACCENT } from "./tokens";

/** A 16×2 character LCD, the kind on the readers. */
function Lcd({ lines }: { lines: [string, string] }) {
  return (
    <div className="rounded-md bg-[#1d3fd1] p-2.5 shadow-[inset_0_0_14px_rgba(0,0,30,0.55)]">
      {lines.map((line, i) => (
        <p key={i} className="whitespace-pre font-mono text-[15px] font-semibold uppercase leading-[1.35] tracking-[0.04em] text-white [text-shadow:0_0_6px_rgba(255,255,255,0.45)]">
          {line.padEnd(16, " ").slice(0, 16)}
        </p>
      ))}
    </div>
  );
}

const LOG: { at: number; dir: string; text: string }[] = [
  { at: 0.55, dir: "NFC", text: "card 0305419896 read" },
  { at: 0.8, dir: "HTTP", text: "→ kiosk-1  charge 350 · W03 · req 9c1e" },
  { at: 1.25, dir: "HTTP", text: "← 200  balance 750" },
  { at: 1.5, dir: "RS232", text: "→ washer  add credit 350" },
  { at: 1.75, dir: "RS232", text: "← washer  ack" },
  { at: 2.3, dir: "RS232", text: "← washer  cycle started · program 3" },
];

export function ReaderScreen({ active }: { active: boolean }) {
  const t = useActiveTime(active, 12);
  // The visitor's own taps, in seconds of `t`. Until they tap, one happens by itself.
  const [manual, setManual] = useState<{ tap: number | null; again: number | null } | null>(null);
  const tap = manual ? manual.tap : 1.6;
  const again = manual?.again ?? null;
  const dt = tap === null ? -1 : t - tap;

  const phase = dt < 0 ? "idle" : dt < 0.5 ? "approach" : dt < 1.25 ? "wait" : dt < 2.3 ? "paid" : "running";
  const busy = again !== null && t - again < 2.2;
  const lcd: [string, string] =
    busy
      ? ["Cycle In", "Progress"]
      : phase === "idle"
        ? Math.floor(t / 1.8) % 2
          ? ["Washer 3", "Price: $3.50"]
          : ["Washer 3", "Tap Card To Pay"]
        : phase === "approach" || phase === "wait"
          ? ["Washer 3", "Please wait..."]
          : phase === "paid"
            ? ["Paid      $3.50", "Bal       $7.50"]
            : ["Cycle In", "Progress  34min"];
  const led = phase === "paid" ? "#22c55e" : busy ? "#f59e0b" : phase === "wait" ? ACCENT : "#3a3d44";
  const running = phase === "running";
  const remaining = running ? Math.max(0, 35 * 60 - Math.floor((dt - 2.3) * 4)) : 35 * 60;

  const onTap = () => {
    if (phase === "idle") setManual({ tap: t, again: null });
    else if (phase === "running") setManual({ tap, again: t });
  };

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[22px] border border-black/[0.08] bg-[#F1F0EC] shadow-[0_40px_80px_-44px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* Reader */}
      <div className="absolute left-[44px] top-[22px] w-[250px]">
        <div className="rounded-[22px] bg-[#25282E] p-4 shadow-[0_30px_50px_-24px_rgba(0,0,0,0.6)]">
          <Lcd lines={lcd} />
          <div className="relative mt-3.5 flex h-[104px] items-center justify-center rounded-2xl border border-white/10 bg-[#1C1E23]">
            <LuNfc className="size-10 text-white/25" />
            <motion.span className="absolute inset-3 rounded-xl border-2" style={{ borderColor: led }} animate={{ opacity: phase === "paid" ? [0, 1, 0] : 0 }} transition={{ duration: 0.8 }} />
            <AnimatePresence>
              {(phase === "approach" || phase === "wait" || phase === "paid") && (
                <motion.div
                  className="absolute flex h-[76px] w-[120px] flex-col justify-between rounded-xl p-2.5 text-white shadow-[0_18px_30px_-12px_rgba(0,0,0,0.6)]"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #0f2f8f)` }}
                  initial={{ x: 140, y: 60, rotate: 18, opacity: 0 }}
                  animate={{ x: 0, y: 0, rotate: -4, opacity: 1 }}
                  exit={{ x: 150, y: 70, rotate: 20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <span className="text-[10px] font-semibold">Launderer</span>
                  <span className="font-mono text-[10px] text-white/70">••4821</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              {["▲", "▼", "✓"].map((b) => (
                <span key={b} className="flex size-7 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
                  {b}
                </span>
              ))}
            </div>
            <motion.span className="size-3 rounded-full" animate={{ background: led, boxShadow: `0 0 12px ${led}` }} transition={{ duration: 0.2 }} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onTap}
            disabled={!(phase === "idle" || phase === "running")}
            className="rounded-full px-4 py-2 text-[12px] font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-40"
            style={{ background: ACCENT }}
          >
            {phase === "running" ? "Tap again" : "Tap card"}
          </button>
          <button
            type="button"
            aria-label="Reset the washer"
            onClick={() => setManual({ tap: null, again: null })}
            className="flex size-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#55554F] transition-transform hover:scale-105"
          >
            <LuRotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Washer */}
      <div className="absolute left-[350px] top-[22px] h-[306px] w-[286px] rounded-[26px] border border-black/[0.06] bg-white shadow-[0_30px_50px_-30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3">
          <p className="text-[12px] font-semibold">
            W03 <span className="font-normal text-[#8A8A85]">· Normal hot</span>
          </p>
          <span className="rounded-md bg-[#111] px-2 py-0.5 font-mono text-[12px] tabular-nums text-[#7CFFB0]">
            {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
          </span>
        </div>
        <div className="relative mx-auto mt-5 size-[196px] rounded-full border-[12px] border-[#E4E3DE] bg-[#F7F7F4]">
          <div className="absolute inset-2 overflow-hidden rounded-full bg-gradient-to-b from-[#eef3ff] to-[#dbe6ff]">
            <motion.div className="absolute inset-x-0 bottom-0 bg-[#2E6BFF]/25" animate={{ height: running ? "42%" : "0%" }} transition={{ duration: 1.6, ease: EASE }} />
            <motion.div className="absolute inset-0" animate={running ? { rotate: 360 } : { rotate: 0 }} transition={running ? { duration: 1.4, repeat: Infinity, ease: "linear" } : { duration: 0.6 }}>
              {[0, 120, 240].map((deg) => (
                <span key={deg} className="absolute top-1 h-7 w-3 rounded-full bg-[#2E6BFF]/30" style={{ left: "calc(50% - 6px)", transform: `rotate(${deg}deg)`, transformOrigin: "50% 74px" }} />
              ))}
              <span className="absolute left-[30%] top-[55%] h-6 w-10 rounded-[40%] bg-[#ff9f7a]/70" />
              <span className="absolute left-[52%] top-[30%] h-5 w-9 rounded-[40%] bg-[#111]/20" />
            </motion.div>
            <span className="absolute left-5 top-5 h-12 w-4 rotate-[30deg] rounded-full bg-white/70" />
          </div>
        </div>
      </div>

      {/* Wire log */}
      <div className="absolute inset-x-[44px] bottom-[16px] h-[92px] overflow-hidden rounded-2xl bg-[#111] px-4 py-3 font-mono text-[11px] leading-[1.6] text-white/75">
        <div className="flex flex-col justify-end">
          {LOG.filter((l) => dt >= l.at).slice(-4).map((l) => (
            <motion.p key={l.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <span className="inline-block w-[52px]" style={{ color: l.dir === "RS232" ? "#7CFFB0" : l.dir === "HTTP" ? "#8fb0ff" : "#f5c46b" }}>
                {l.dir}
              </span>
              {l.text}
            </motion.p>
          ))}
          {dt < 0.55 && <p className="text-white/35">Waiting for a tap…</p>}
        </div>
      </div>
    </div>
  );
}
