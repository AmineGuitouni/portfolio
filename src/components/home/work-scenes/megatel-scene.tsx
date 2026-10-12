"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { FaBookmark, FaCheckCircle, FaClock, FaPauseCircle, FaPhone, FaPlay, FaTimesCircle } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { LuCalendarDays, LuFiles, LuLayoutDashboard, LuMessageCircle, LuPhoneForwarded, LuSettings, LuStickyNote } from "react-icons/lu";
import { Stage, during, useSceneClock } from "./stage";

// Tokens from the MegaTel desktop app (client/tauri/src/index.css → --app-*)
const C = {
  canvas: "#f8f7f5",
  chrome: "#fcfaf8",
  inset: "#f8f3ee",
  text: "#1c140d",
  muted: "#6b625b",
  border: "#f4ede7",
  borderStrong: "#eadfd5",
  brand: "#d3570d",
  action: "#b94708",
  highlight: "#f48c25",
  accentSoft: "#fff1e6",
  shadow: "0 10px 30px rgba(67, 42, 23, 0.06)",
};

const LOOP = 10;

const hms = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${h}h ${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`;
};

/** The MegaTel worker desktop app: timer, call logging, overlay bubble and a live admin alert. */
export default function MegaTelScene() {
  const { ref, t, loop, total } = useSceneClock(LOOP, 3.2);

  const inCall = during(t, 1.9, 5.0);
  const pressStart = during(t, 1.5, 1.9);
  const pressSuccess = during(t, 4.6, 5.0);
  const alert = during(t, 6.0, 9.2);
  const successful = 7 + loop + (t >= 5.0 ? 1 : 0);
  const calls = 9 + loop + (t >= 1.9 ? 1 : 0);
  const worked = 2 * 3600 + 14 * 60 + total;
  const callSecs = Math.max(0, Math.floor(t - 1.9));
  const progress = Math.min(0.99, worked / (3.5 * 3600));

  const R = 30;
  const CIRC = 2 * Math.PI * R;

  return (
    <div ref={ref}>
      <Stage className="bg-[linear-gradient(135deg,#fff1e6_0%,#f8f7f5_55%,#f4ede7_100%)]">
        {/* App window, cropped by the card edge like a screenshot */}
        <div
          className="absolute left-4 top-4 flex h-[300px] w-[480px] overflow-hidden rounded-tl-xl border"
          style={{ background: C.canvas, borderColor: C.borderStrong, boxShadow: "0 20px 50px rgba(67,42,23,0.16)" }}
        >
          {/* Sidebar rail */}
          <div className="flex w-11 shrink-0 flex-col items-center gap-2.5 border-r pt-2.5" style={{ background: C.chrome, borderColor: C.border }}>
            <Image src="/work/megatel-mark.png" alt="" width={26} height={19} className="mb-1" />
            {[LuLayoutDashboard, LuCalendarDays, LuPhoneForwarded, LuMessageCircle, LuFiles, LuStickyNote, LuSettings].map((Icon, i) => (
              <span
                key={i}
                className="flex size-7 items-center justify-center rounded-lg"
                style={i === 0 ? { background: C.accentSoft, color: C.brand } : { color: C.muted }}
              >
                <Icon className="size-3.5" />
              </span>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 space-y-2 p-2.5 pr-6">
            {/* Title strip with live stream indicator */}
            <div className="flex items-center justify-between text-[8px]" style={{ color: C.muted }}>
              <span className="font-semibold uppercase tracking-[0.14em]">Overview</span>
              <span className="flex items-center gap-1 rounded-full border bg-white px-1.5 py-0.5 font-semibold" style={{ borderColor: C.border }}>
                <motion.span className="size-1.5 rounded-full bg-red-500" animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                <span style={{ color: C.text }}>LIVE</span> · screen & audio streamed
              </span>
            </div>

            {/* Assigned task header */}
            <div className="flex items-center justify-between rounded-xl border bg-white px-2.5 py-2" style={{ borderColor: C.border, boxShadow: C.shadow }}>
              <div className="flex items-center gap-2">
                <span className="rounded-lg border p-1.5" style={{ background: C.accentSoft, borderColor: C.border }}>
                  <FaBookmark className="size-2.5" style={{ color: "#D95806" }} />
                </span>
                <div>
                  <p className="text-[6.5px] font-bold uppercase tracking-[0.12em]" style={{ color: C.muted }}>Assigned task</p>
                  <p className="text-[11px] font-black tracking-tight" style={{ color: C.text }}>Customer Survey · Wave 12</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[8px] font-medium text-green-700">
                <span className="size-1.5 animate-pulse rounded-full bg-green-500" /> Working
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Timer ring */}
              <div className="flex flex-col items-center rounded-xl border bg-white px-2 py-2.5" style={{ borderColor: C.border, boxShadow: C.shadow }}>
                <div className="relative size-[78px]">
                  <svg viewBox="0 0 80 80" className="size-full -rotate-90">
                    <circle cx="40" cy="40" r={R} fill="none" stroke={C.inset} strokeWidth="7" />
                    <circle cx="40" cy="40" r={R} fill="none" stroke={C.action} strokeWidth="7" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)} style={{ transition: "stroke-dashoffset 0.5s" }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center leading-none tabular-nums" style={{ color: C.text }}>
                    <span className="text-[9px] font-black">{hms(worked).split(" ").slice(0, 2).join(" ")}</span>
                    <span className="mt-0.5 text-[7px] font-semibold" style={{ color: C.muted }}>{hms(worked).split(" ")[2]}</span>
                  </div>
                </div>
                <p className="mt-1 text-[7px]" style={{ color: C.muted }}>Worked time</p>
                <p className="text-[12px] font-black" style={{ color: C.text }}>{Math.round(progress * 100)}%</p>
                <span className="mt-1.5 w-full rounded-lg bg-red-600 py-1 text-center text-[7.5px] font-bold text-white">■ End Working</span>
              </div>

              {/* Time details */}
              <div className="space-y-1.5 rounded-xl border bg-white p-2" style={{ borderColor: C.border, boxShadow: C.shadow }}>
                <p className="text-[8.5px] font-black" style={{ color: C.text }}>Time Details</p>
                {[
                  { icon: <FaClock className="text-orange-600" />, label: "Total work", value: "6h 00m", bg: C.accentSoft },
                  { icon: <FaPauseCircle className="text-amber-600" />, label: "Pause", value: "30m", bg: C.inset },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between rounded-lg border px-1.5 py-1 text-[7px]" style={{ background: r.bg, borderColor: C.border }}>
                    <span className="flex items-center gap-1" style={{ color: C.text }}>
                      <span className="rounded bg-white p-0.5 text-[7px] shadow-sm">{r.icon}</span>
                      {r.label}
                    </span>
                    <span className="font-bold" style={{ color: C.text }}>{r.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 px-1.5 py-1 text-[7px] text-gray-700">
                  <span>Target</span>
                  <span className="font-bold text-gray-800">4 / hour</span>
                </div>
                <div className="flex justify-between border-t pt-1 text-[6.5px] text-gray-500" style={{ borderColor: C.border }}>
                  <span>Schedule</span>
                  <span className="font-semibold text-gray-700">09:00 – 15:30</span>
                </div>
              </div>

              {/* Call actions + interview counter */}
              <div className="flex flex-col gap-1.5 rounded-xl border bg-white p-2" style={{ borderColor: C.border, boxShadow: C.shadow }}>
                <div className="flex items-center justify-between">
                  <p className="text-[8.5px] font-black" style={{ color: C.text }}>Actions</p>
                  <AnimatePresence>
                    {inCall && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className="flex items-center gap-1 rounded-full bg-green-100 px-1.5 py-0.5 text-[6.5px] font-semibold text-green-700"
                      >
                        <FaPhone className="size-1.5" /> In Call {`0:${String(callSecs).padStart(2, "0")}`}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative h-[34px]">
                  <AnimatePresence mode="wait" initial={false}>
                    {inCall ? (
                      <motion.div key="call" className="absolute inset-0 grid grid-cols-2 gap-1" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                        <motion.span animate={{ scale: pressSuccess ? 0.9 : 1 }} className="flex flex-col items-center justify-center gap-0.5 rounded-lg bg-green-600 text-[6.5px] font-semibold text-white">
                          <FaCheckCircle className="size-2" /> Successful
                        </motion.span>
                        <span className="flex flex-col items-center justify-center gap-0.5 rounded-lg bg-red-600 text-[6.5px] font-semibold text-white">
                          <FaTimesCircle className="size-2" /> Failed
                        </span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="start"
                        className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg text-[8px] font-bold text-white"
                        style={{ background: C.action }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0, scale: pressStart ? 0.92 : 1 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                      >
                        <FaPhone className="size-2" /> Start Call
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="mt-auto rounded-lg border p-1.5" style={{ background: C.inset, borderColor: C.border }}>
                  <p className="text-[6.5px] uppercase tracking-[0.1em]" style={{ color: C.muted }}>Interviews today</p>
                  <div className="flex items-baseline gap-1">
                    <motion.span key={successful} initial={{ scale: 1.5, color: "#16a34a" }} animate={{ scale: 1, color: C.text }} transition={{ duration: 0.6 }} className="origin-left text-[18px] font-black leading-none">
                      {successful}
                    </motion.span>
                    <span className="text-[6.5px]" style={{ color: C.muted }}>/ {calls} calls</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Week strip from the calendar */}
            <div className="flex gap-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
                <div key={d} className="flex-1 rounded-lg border bg-white px-1.5 py-1 text-[6.5px]" style={{ borderColor: C.border }}>
                  <p style={{ color: C.muted }}>{d}</p>
                  <div className="mt-0.5 h-1 rounded-full" style={{ background: i === 2 ? C.highlight : C.borderStrong, width: `${[70, 90, 60, 40, 80][i]}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating overlay timer bubble (features/overlay/components/Bubble.tsx) */}
        <motion.div
          className="absolute bottom-2.5 right-3 flex size-[46px] items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-600 text-white shadow-[0_8px_22px_rgba(67,42,23,0.25)]"
          animate={{ y: [0, -3, 0], boxShadow: inCall ? "0 0 0 4px rgba(165,180,252,0.8), 0 8px 22px rgba(67,42,23,0.25)" : "0 0 0 0px rgba(165,180,252,0), 0 8px 22px rgba(67,42,23,0.25)" }}
          transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, boxShadow: { duration: 0.3 } }}
        >
          <span className="text-[9px] font-black tabular-nums">{`${Math.floor(worked / 3600)}:${String(Math.floor((worked % 3600) / 60)).padStart(2, "0")}`}</span>
          <AnimatePresence>
            {inCall && (
              <motion.span
                className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-indigo-500 ring-2 ring-white/60"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.15, 1] }}
                exit={{ scale: 0 }}
                transition={{ scale: { duration: 1, repeat: Infinity } }}
              >
                <FiPhoneCall className="size-2 text-white" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Admin alert pushed to the worker while the admin watches the live stream */}
        <AnimatePresence>
          {alert && (
            <motion.div
              className="absolute right-[86px] top-[54px] w-[170px] rounded-xl border bg-white p-2 text-[8px]"
              style={{ borderColor: C.borderStrong, boxShadow: "0 16px 40px rgba(67,42,23,0.18)" }}
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <p className="flex items-center gap-1 font-bold" style={{ color: C.brand }}>
                <span className="size-1.5 rounded-full" style={{ background: C.brand }} /> Admin alert
              </p>
              <p className="mt-0.5" style={{ color: C.text }}>Great pace today — keep it up!</p>
              <div className="mt-1 flex h-3 items-center gap-[2px]">
                <FaPlay className="mr-1 size-1.5" style={{ color: C.action }} />
                {Array.from({ length: 22 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-[2px] rounded-full"
                    style={{ background: C.highlight }}
                    animate={{ height: [2, 3 + ((i * 7) % 9), 2] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.04 }}
                  />
                ))}
                <span className="ml-1 text-[6.5px]" style={{ color: C.muted }}>voice note</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Stage>
    </div>
  );
}
