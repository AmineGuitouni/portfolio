"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView } from "motion/react";

/* ───────────────────────── megashop: realtime pipeline ───────────────────────── */

const CHAT = [
  { me: false, text: "Hi! Has order #4821 shipped?" },
  { me: true, text: "Yes — it left the warehouse this morning 📦" },
  { me: false, text: "Can I add a logo print?" },
  { me: true, text: "Sure, upload the artwork and I’ll attach it." },
];

export function RealtimeTile() {
  const [count, setCount] = useState(1);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setCount((c) => (c >= CHAT.length ? 1 : c + 1));
      }, 900);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const nodes = ["Shop", "Postgres", "Rust · Axum", "Browser"];
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#CFCBC2_0_6px,transparent_6px_12px)]" />
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-[#00B37E] shadow-[0_0_10px_#00B37E]"
            animate={{ left: ["6%", "94%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          />
        ))}
        {nodes.map((n) => (
          <span key={n} className="relative rounded-full border border-[#E7E5DF] bg-white px-2.5 py-1 text-[11px] font-medium shadow-sm">
            {n}
          </span>
        ))}
      </div>
      <div className="flex justify-between px-1 font-mono text-[10px] text-[#8A8A85]">
        <span>INSERT</span>
        <span>pg_notify()</span>
        <span>WebSocket fan-out</span>
      </div>
      {/* Fixed-height window: messages stack from the bottom and older ones scroll out of view,
          so new messages never change the tile's height. */}
      <div className="relative min-h-44 flex-1 overflow-hidden rounded-xl bg-[#F3F2EE] [mask-image:linear-gradient(to_bottom,transparent,black_22%)]">
        <div className="absolute inset-x-3 bottom-3 flex flex-col gap-1.5">
          <AnimatePresence initial={false} mode="popLayout">
            {CHAT.slice(0, count).slice(-3).map((m) => (
              <motion.div
                key={m.text}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-[12px] ${m.me ? "self-end bg-[#00B37E] text-white" : "self-start bg-white"}`}
              >
                {m.text}
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="h-5">
            {typing && (
              <div className="flex w-fit gap-1 rounded-full bg-white px-2.5 py-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="size-1.5 rounded-full bg-[#8A8A85]" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── megatel: live supervision ───────────────────────── */

export function StreamTile() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative flex-1 overflow-hidden rounded-xl bg-[#14141A] p-3">
        <div className="flex items-center justify-between text-[11px] text-white/70">
          <span className="flex items-center gap-1.5 rounded bg-[#FF3B30] px-1.5 py-0.5 font-semibold text-white">
            <motion.span className="size-1.5 rounded-full bg-white" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} /> LIVE
          </span>
          <span className="font-mono">{mm}:{ss} · 1080p · 84 ms</span>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_2fr] gap-2">
          <div className="space-y-1.5">
            {[70, 50, 85, 40].map((w, i) => (
              <div key={i} className="h-2 rounded bg-white/10" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="space-y-1.5 rounded bg-white/5 p-2">
            <div className="h-2 w-1/2 rounded bg-[#FF5B1F]/70" />
            <div className="h-2 w-5/6 rounded bg-white/10" />
            <div className="h-2 w-2/3 rounded bg-white/10" />
            <div className="h-6 w-full rounded bg-white/5" />
          </div>
        </div>
        <motion.div
          className="absolute size-3"
          animate={{ left: ["55%", "72%", "62%", "80%", "55%"], top: ["55%", "40%", "70%", "50%", "55%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 12 12" className="size-3 drop-shadow"><path d="M1 1 L11 6 L6 7 L4 11 Z" fill="white" stroke="#111" strokeWidth="0.8" /></svg>
        </motion.div>
      </div>
      <div className="flex h-9 items-center gap-[3px]">
        {Array.from({ length: 48 }).map((_, i) => (
          <motion.span
            key={i}
            className="w-full rounded-full bg-[#FF5B1F]"
            animate={{ height: ["15%", `${30 + ((i * 37) % 70)}%`, "20%", `${20 + ((i * 53) % 80)}%`, "15%"] }}
            transition={{ duration: 1.4 + (i % 5) * 0.15, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <p className="font-mono text-[10px] text-[#8A8A85]">Tauri capture → H.264 + Opus → WebRTC (Pion) → HLS recording</p>
    </div>
  );
}

/* ───────────────────────── launderer: AI assistant with tool calls ───────────────────────── */

export function AssistantTile() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const durations = [900, 1300, 1400, 3200];
    const id = setTimeout(() => setStep((s) => (s + 1) % 4), durations[step]);
    return () => clearTimeout(id);
  }, [step]);

  // Every step is always rendered and only faded in, so the tile reserves its final height
  // up front instead of growing as the conversation plays out.
  const reveal = (shown: boolean) => ({ opacity: shown ? 1 : 0, y: shown ? 0 : 8 });

  return (
    <div className="flex h-full flex-col justify-end gap-2 text-[12px]">
      <div className="self-end rounded-2xl rounded-br-sm bg-[#111] px-3 py-2 text-white">Which stores dropped revenue this week?</div>
      <motion.div
        initial={false}
        animate={reveal(step >= 1)}
        transition={{ duration: 0.35 }}
        className="flex w-fit items-center gap-2 rounded-lg border border-[#E7E5DF] bg-white px-2.5 py-1.5 font-mono text-[11px]"
      >
        {step <= 1 ? (
          <motion.span className="size-3 rounded-full border-2 border-[#2E6BFF] border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
        ) : (
          <span className="text-[#00B37E]">✓</span>
        )}
        <span className="text-[#2E6BFF]">get_store_revenue</span>
        <span className="text-[#8A8A85]">({`{ range: "7d", compare: "prev" }`})</span>
      </motion.div>
      <motion.div initial={false} animate={reveal(step >= 2)} transition={{ duration: 0.35 }} className="rounded-2xl rounded-bl-sm bg-[#F3F2EE] px-3 py-2">
        <p>Two stores are down week-over-week:</p>
        <div className="mt-2 space-y-1">
          {[["Store 03 · Centre", "-18%", 82], ["Store 07 · Marina", "-9%", 91]].map(([n, d, w]) => (
            <div key={n as string} className="flex items-center gap-2">
              <span className="w-28 truncate">{n}</span>
              <span className="h-1.5 flex-1 rounded-full bg-white">
                <motion.span className="block h-full rounded-full bg-[#2E6BFF]" initial={false} animate={{ width: step >= 2 ? `${w}%` : "0%" }} transition={{ duration: 0.8 }} />
              </span>
              <span className="w-10 text-right font-mono text-[#FF3B30]">{d}</span>
            </div>
          ))}
        </div>
        <motion.p initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.35 }} className="mt-2 text-[#55554F]">
          Store 03 had 2 machines offline since Tuesday.
        </motion.p>
      </motion.div>
      {/* Composer, so the conversation reads as a chat window and sits on the tile's floor. */}
      <div aria-hidden className="mt-2 flex items-center gap-2 rounded-xl border border-[#E7E5DF] bg-[#FAFAF7] py-1.5 pl-3 pr-1.5 text-[#A5A5A0]">
        <span className="flex-1">Ask about your stores…</span>
        <span className="flex size-6 items-center justify-center rounded-lg bg-[#2E6BFF] text-white">↑</span>
      </div>
    </div>
  );
}

/* ───────────────────────── launderer: machine wall ───────────────────────── */

type MachineState = "free" | "wash" | "dry" | "done";
const STATE_STYLE: Record<MachineState, string> = { free: "#D9D6CC", wash: "#2E6BFF", dry: "#FF9F1C", done: "#00B37E" };

export function MachinesTile() {
  const [states, setStates] = useState<MachineState[]>(["wash", "free", "dry", "done", "wash", "wash", "free", "dry", "wash"]);
  useEffect(() => {
    const order: MachineState[] = ["free", "wash", "dry", "done"];
    const id = setInterval(() => {
      setStates((s) => {
        const next = [...s];
        const i = Math.floor(Math.random() * next.length);
        next[i] = order[(order.indexOf(next[i]) + 1) % order.length];
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="grid grid-cols-3 gap-2">
        {states.map((s, i) => (
          <div key={i} className="flex aspect-square flex-col items-center justify-center rounded-lg border border-[#E7E5DF] bg-white">
            <div className="relative size-8 rounded-full border-2 transition-colors duration-500" style={{ borderColor: STATE_STYLE[s] }}>
              {(s === "wash" || s === "dry") && (
                <motion.span
                  className="absolute inset-1 rounded-full border-2 border-dashed"
                  style={{ borderColor: STATE_STYLE[s] }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: s === "wash" ? 1 : 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              {s === "done" && <span className="absolute inset-0 flex items-center justify-center text-xs text-[#00B37E]">✓</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#8A8A85]">
        {(Object.keys(STATE_STYLE) as MachineState[]).map((k) => (
          <span key={k} className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: STATE_STYLE[k] }} />{k}</span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── count-up ───────────────────────── */

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("en-US") + suffix;
      },
    });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}
