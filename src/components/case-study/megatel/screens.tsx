"use client";

import { AnimatePresence, motion } from "motion/react";
import { LuCheck, LuCoffee, LuGrid, LuLock, LuMic, LuMicOff, LuPause, LuPhone, LuPhoneOff, LuPlay, LuSquare, LuUpload, LuUser } from "react-icons/lu";
import { EASE } from "@/components/home/shared";
import { hash, unit, useActiveTime } from "../canvas";
import { Kbd, Label, Panel } from "./app-window";
import { C } from "./tokens";

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
const clock = (s: number) => `${pad(s / 3600)}:${pad((s % 3600) / 60)}:${pad(s % 60)}`;
const mmss = (s: number) => `${pad(s / 60)}:${pad(s % 60)}`;

/* ─────────────────────────────── 1 · Clock in ─────────────────────────────── */

export function ClockScreen({ active }: { active: boolean }) {
  const t = useActiveTime(active, 7);
  const START = 1.4;
  const started = t >= START;
  const pressing = t >= START - 0.3 && t < START;
  const worked = started ? t - START : 0;
  const R = 64;
  const CIRC = 2 * Math.PI * R;
  const sweep = (worked % 60) / 60;

  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10.5px]" style={{ color: C.muted }}>Monday, 14 November · Week 46</p>
          <p className="mt-0.5 text-[18px] font-black tracking-tight">Good morning, Sara</p>
        </div>
        <span
          className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors duration-500"
          style={started ? { background: C.greenSoft, borderColor: "#bbf7d0", color: C.green } : { background: C.inset, borderColor: C.border, color: C.muted }}
        >
          <span className={`size-1.5 rounded-full ${started ? "animate-pulse" : ""}`} style={{ background: started ? "#22c55e" : C.faint }} />
          {started ? "Working" : "Not clocked in"}
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1.12fr_1fr] gap-3">
        <Panel className="flex flex-col items-center p-4">
          <div className="flex w-full items-start justify-between">
            <div>
              <Label>Assigned project</Label>
              <p className="mt-0.5 text-[13px] font-black tracking-tight">Customer Survey · Wave 12</p>
            </div>
            <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background: C.accentSoft, color: C.brand }}>Internal CATI</span>
          </div>

          <div className="relative my-auto size-[156px]">
            <svg viewBox="0 0 160 160" className="size-full -rotate-90">
              <circle cx="80" cy="80" r={R} fill="none" stroke={C.inset} strokeWidth="10" />
              <circle
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke={C.action}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - sweep)}
                style={{ transition: sweep < 0.02 ? "none" : "stroke-dashoffset 0.12s linear", opacity: started ? 1 : 0 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-[22px] font-bold tabular-nums tracking-tight">{clock(worked)}</span>
              <span className="mt-0.5 text-[9.5px]" style={{ color: C.muted }}>{started ? "since 08:58" : "shift 09:00 – 15:30"}</span>
            </div>
          </div>

          <div className="relative h-9 w-full">
            <AnimatePresence initial={false} mode="popLayout">
              {started ? (
                <motion.div key="on" className="absolute inset-0 grid grid-cols-[1fr_auto] gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                  <span className="flex items-center justify-center gap-1.5 rounded-xl border text-[11px] font-bold" style={{ borderColor: "#fecaca", color: C.red, background: "#fef2f2" }}>
                    <LuSquare className="size-3" /> End working
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl border px-3 text-[11px] font-semibold" style={{ borderColor: C.border, color: C.muted }}>
                    <LuCoffee className="size-3" /> Break
                  </span>
                </motion.div>
              ) : (
                <motion.span
                  key="off"
                  className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-xl text-[11.5px] font-bold text-white"
                  style={{ background: C.action }}
                  animate={{ scale: pressing ? 0.95 : 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <LuPlay className="size-3" /> Start working
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Panel>

        <div className="flex min-h-0 flex-col gap-3">
          <Panel className="p-3.5">
            <Label>Today</Label>
            <div className="mt-2 space-y-1.5">
              {[
                { time: "09:00 – 12:00", what: "Customer Survey", now: true },
                { time: "12:00 – 12:30", what: "Break" },
                { time: "12:30 – 15:30", what: "Customer Survey" },
              ].map((row) => (
                <div
                  key={row.time}
                  className="flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[10.5px]"
                  style={row.now ? { background: C.accentSoft, borderColor: "#fbd5b5" } : { background: C.chrome, borderColor: C.border }}
                >
                  <span className="font-mono tabular-nums" style={{ color: C.muted }}>{row.time}</span>
                  <span className="font-semibold">{row.what}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-3.5">
            <Label>Shortcuts, anywhere in Windows</Label>
            <div className="mt-2 space-y-1.5 text-[10.5px]">
              {[
                ["Start / stop", ["Ctrl", "Alt", "S"]],
                ["Break", ["Ctrl", "Alt", "P"]],
              ].map(([label, keys]) => (
                <div key={label as string} className="flex items-center justify-between">
                  <span style={{ color: C.muted }}>{label}</span>
                  <span className="flex gap-1">
                    {(keys as string[]).map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <div className="mt-auto grid grid-cols-3 gap-2">
            {[
              ["Calls", "0"],
              ["Interviews", "0"],
              ["Target", "4 / h"],
            ].map(([k, v]) => (
              <Panel key={k} className="px-2.5 py-2">
                <p className="text-[9px]" style={{ color: C.muted }}>{k}</p>
                <p className="text-[15px] font-black tabular-nums">{v}</p>
              </Panel>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── 2 · Next contact ─────────────────────────────── */

const LEADS = [
  { id: "a", name: "Bäckerei Sonnenschein", place: "Berlin · 10115", note: "Attempt 2 of 5" },
  { id: "b", name: "Gebäudeservice Nord", place: "Hamburg · 20095", note: "New", takenBy: "JK", at: -1 },
  { id: "c", name: "Praxis Dr. Albers", place: "Köln · 50667", note: "New" },
  { id: "d", name: "Autohaus Brenner", place: "München · 80331", note: "Attempt 3 of 5", takenBy: "LM", at: 2.8 },
  { id: "e", name: "Kanzlei Winter & Co.", place: "Leipzig · 04109", note: "Callback 11:30" },
  { id: "f", name: "Hotel am Stadtpark", place: "Hannover · 30159", note: "New", takenBy: "TS", at: 4.6 },
  { id: "g", name: "Café Lindenblatt", place: "Dresden · 01067", note: "New" },
];
const OTHER = { JK: "#6366f1", LM: "#0891b2", TS: "#7c3aed" } as Record<string, string>;
const LEASE = 15 * 60;

export function QueueScreen({ active }: { active: boolean }) {
  const t = useActiveTime(active, 6);
  const CLAIM = 1.5;
  const claimed = t >= CLAIM;
  const pressing = t >= CLAIM - 0.3 && t < CLAIM;
  const left = LEASE - Math.max(0, t - CLAIM);
  const leased = 37 + LEADS.filter((l) => l.takenBy && t >= (l.at ?? 0)).length + (claimed ? 1 : 0);
  const R = 17;
  const CIRC = 2 * Math.PI * R;

  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-end justify-between">
        <div>
          <Label>Contact queue</Label>
          <p className="mt-0.5 text-[16px] font-black tracking-tight">Customer Survey · Wave 12</p>
        </div>
        <div className="flex gap-1.5 text-[10px]">
          {[
            ["In pool", "1,284"],
            ["Leased", String(leased)],
            ["Callbacks", "12"],
          ].map(([k, v]) => (
            <span key={k} className="rounded-lg border bg-white px-2 py-1" style={{ borderColor: C.border }}>
              <span style={{ color: C.muted }}>{k} </span>
              <motion.span key={v} className="inline-block font-bold tabular-nums" initial={{ y: -4, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }}>{v}</motion.span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 grid min-h-0 flex-1 grid-cols-[1fr_258px] gap-3">
        <Panel className="overflow-hidden">
          {LEADS.map((lead, i) => {
            const mine = lead.id === "a" && claimed;
            const taken = lead.takenBy && t >= (lead.at ?? 0);
            return (
              <div
                key={lead.id}
                className="flex items-center justify-between border-b px-3 py-[9px] transition-colors duration-500"
                style={{ borderColor: C.border, background: mine ? C.accentSoft : "white", opacity: taken ? 0.55 : 1 }}
              >
                <div className="min-w-0">
                  <p className="truncate text-[11.5px] font-bold">{lead.name}</p>
                  <p className="text-[9.5px]" style={{ color: C.muted }}>{lead.place}</p>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  {mine ? (
                    <motion.span key="me" className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-bold text-white" style={{ background: C.brand }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <LuLock className="size-2.5" /> You
                    </motion.span>
                  ) : taken ? (
                    <motion.span key="taken" className="flex items-center gap-1.5 text-[9.5px]" style={{ color: C.muted }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 22, delay: i * 0.02 }}>
                      <LuLock className="size-2.5" />
                      <span className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: OTHER[lead.takenBy!] }}>{lead.takenBy}</span>
                    </motion.span>
                  ) : (
                    <motion.span key="note" className="rounded-full border px-2 py-0.5 text-[9px]" style={{ borderColor: C.border, color: lead.note?.startsWith("Callback") ? C.amber : C.muted }}>
                      {lead.note}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Panel>

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {!claimed ? (
              <motion.div
                key="empty"
                className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center"
                style={{ borderColor: C.borderStrong }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <span className="flex size-11 items-center justify-center rounded-full" style={{ background: C.accentSoft, color: C.brand }}>
                  <LuUser className="size-5" />
                </span>
                <p className="mt-3 text-[12px] font-bold">Ready for the next contact</p>
                <p className="mt-1 text-[10px]" style={{ color: C.muted }}>It is reserved for you alone until you finish or the lease runs out.</p>
                <motion.span className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-bold text-white" style={{ background: C.action }} animate={{ scale: pressing ? 0.94 : 1 }}>
                  Next contact <Kbd dark>N</Kbd>
                </motion.span>
              </motion.div>
            ) : (
              <motion.div key="card" className="flex h-full flex-col" initial={{ opacity: 0, x: -26, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.55, ease: EASE }}>
                <Panel className="flex flex-1 flex-col p-4" style={{ borderColor: "#fbd5b5", boxShadow: "0 18px 40px -18px rgba(211,87,13,0.35)" }}>
                  <div className="flex items-start justify-between">
                    <Label>Current contact</Label>
                    <div className="relative size-10">
                      <svg viewBox="0 0 40 40" className="size-full -rotate-90">
                        <circle cx="20" cy="20" r={R} fill="none" stroke={C.inset} strokeWidth="3" />
                        <circle cx="20" cy="20" r={R} fill="none" stroke={C.brand} strokeWidth="3" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - left / LEASE)} />
                      </svg>
                      <LuLock className="absolute inset-0 m-auto size-3" style={{ color: C.brand }} />
                    </div>
                  </div>
                  <p className="-mt-2 text-[15px] font-black leading-tight tracking-tight">Bäckerei Sonnenschein</p>
                  <p className="text-[10px]" style={{ color: C.muted }}>Frau M. Keller · Owner</p>
                  <div className="mt-3 space-y-1.5 text-[10.5px]">
                    {[
                      ["Phone", "+49 30 •••• 2741"],
                      ["Postal code", "10115 Berlin"],
                      ["History", "Attempt 2 of 5 · no answer"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2 border-b pb-1.5" style={{ borderColor: C.border }}>
                        <span style={{ color: C.muted }}>{k}</span>
                        <span className="font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 flex items-center justify-between rounded-lg px-2 py-1.5 font-mono text-[9.5px]" style={{ background: C.accentSoft, color: C.brand }}>
                    <span>reserved for you</span>
                    <span className="font-bold tabular-nums">{mmss(left)}</span>
                  </p>
                  <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-3">
                    <span className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-bold text-white" style={{ background: C.green }}>
                      <LuPhone className="size-3" /> Call
                    </span>
                    <span className="rounded-xl border px-3 py-2 text-[11px] font-semibold" style={{ borderColor: C.border, color: C.muted }}>Skip</span>
                  </div>
                </Panel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── 3 · The call ─────────────────────────────── */

const BARS = 66;
const ANSWER = 2.2;

/** Who is talking at a given bar index: turns of 18–40 bars, alternating. */
function speaking(g: number, lane: 0 | 1) {
  let edge = 0;
  let turn = 0;
  while (edge <= g) {
    edge += 18 + Math.floor(hash(turn) * 22);
    if (edge > g) break;
    turn++;
  }
  return turn % 2 === lane;
}

function Lane({ lane, offset, live, color, label }: { lane: 0 | 1; offset: number; live: boolean; color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[74px] shrink-0 text-[9.5px] font-semibold" style={{ color: C.muted }}>{label}</span>
      <div className="flex h-12 flex-1 items-center gap-[3px]">
        {Array.from({ length: BARS }, (_, i) => {
          const g = i + offset;
          const on = live && speaking(g, lane);
          const h = !live ? 2 : on ? 6 + hash(g * 3 + lane) * 40 : 2 + hash(g + lane * 7) * 4;
          return <span key={i} className="flex-1 rounded-full transition-[height] duration-100" style={{ height: h, background: on ? color : C.borderStrong }} />;
        })}
      </div>
    </div>
  );
}

const TIMELINE = [
  { at: 0.1, time: "00:00", text: "INVITE sent", detail: "G.711 A-law" },
  { at: 0.7, time: "00:00", text: "180 Ringing" },
  { at: ANSWER, time: "00:02", text: "200 OK · answered" },
  { at: ANSWER + 0.3, time: "00:02", text: "Recording started", detail: "stereo Ogg/Opus" },
  { at: ANSWER + 2.4, time: "00:04", text: "Linked to interview", detail: "case 4821" },
];

export function CallScreen({ active }: { active: boolean }) {
  const t = useActiveTime(active, 6.5);
  const live = t >= ANSWER;
  const secs = live ? t - ANSWER : 0;
  const offset = Math.floor(t * 10);
  const upload = unit((t - 1) / 5);

  return (
    <div className="flex h-full flex-col">
      <motion.div
        className="flex items-center justify-between px-5 py-3 text-white"
        animate={{ background: live ? "#15803d" : "#b45309" }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex size-8 items-center justify-center rounded-full bg-white/15">
            {!live && <span className="absolute inset-0 animate-ping rounded-full bg-white/25" />}
            <LuPhone className="size-3.5" />
          </span>
          <div>
            <p className="text-[12px] font-bold">Bäckerei Sonnenschein</p>
            <p className="text-[10px] text-white/75">{live ? `+49 30 •••• 2741 · ${mmss(secs)}` : "Calling…"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <AnimatePresence>
            {live && (
              <motion.span className="mr-1.5 flex items-center gap-1.5 rounded-full bg-black/20 px-2 py-1 text-[9px] font-bold tracking-wide" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}>
                <span className="size-1.5 animate-pulse rounded-full bg-red-400" /> REC
              </motion.span>
            )}
          </AnimatePresence>
          {[LuMic, LuPause, LuGrid].map((Icon, i) => (
            <span key={i} className="flex size-8 items-center justify-center rounded-full bg-white/15">
              <Icon className="size-3.5" />
            </span>
          ))}
          <span className="ml-1 flex h-8 items-center gap-1.5 rounded-full bg-red-600 px-3 text-[10.5px] font-bold">
            <LuPhoneOff className="size-3.5" /> Hang up
          </span>
        </div>
      </motion.div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-5">
        <Panel className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Label>Recording · both sides, one file</Label>
            <span className="font-mono text-[9.5px]" style={{ color: C.muted }}>48 kHz · stereo</span>
          </div>
          <Lane lane={0} offset={offset} live={live} color={C.brand} label="L · Worker" />
          <Lane lane={1} offset={offset} live={live} color={C.indigo} label="R · Customer" />
        </Panel>

        <div className="grid min-h-0 flex-1 grid-cols-[1.25fr_1fr] gap-3">
          <Panel className="p-4">
            <Label>Call timeline</Label>
            <ol className="mt-2.5 space-y-2">
              {TIMELINE.map((ev) => (
                <motion.li
                  key={ev.text}
                  className="flex items-center gap-2.5 text-[10.5px]"
                  initial={false}
                  animate={{ opacity: t >= ev.at ? 1 : 0, x: t >= ev.at ? 0 : -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <span className="font-mono text-[9.5px] tabular-nums" style={{ color: C.faint }}>{ev.time}</span>
                  <span className="size-1.5 rounded-full" style={{ background: ev.text.startsWith("Recording") ? C.red : C.brand }} />
                  <span className="font-semibold">{ev.text}</span>
                  {ev.detail && <span style={{ color: C.muted }}>{ev.detail}</span>}
                </motion.li>
              ))}
            </ol>
          </Panel>

          <Panel className="flex flex-col p-4">
            <Label>Upload outbox</Label>
            <p className="mt-1 text-[9.5px] leading-snug" style={{ color: C.muted }}>Saved to disk first, so a crash or lost Wi-Fi never loses a call.</p>
            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold">Call 08:51 · 1.8 MB</span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: C.green }}><LuCheck className="size-3" /> uploaded</span>
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold">Call 08:56 · 2.4 MB</span>
                  <span className="flex items-center gap-1 font-semibold" style={{ color: upload >= 1 ? C.green : C.brand }}>
                    {upload >= 1 ? <LuCheck className="size-3" /> : <LuUpload className="size-3" />}
                    {upload >= 1 ? "uploaded" : `${Math.round(upload * 100)}%`}
                  </span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full" style={{ background: C.inset }}>
                  <div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${upload * 100}%`, background: upload >= 1 ? C.green : C.brand }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold">This call</span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: live ? C.red : C.faint }}>
                  {live ? <LuMic className="size-3" /> : <LuMicOff className="size-3" />} {live ? "recording" : "waiting"}
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
