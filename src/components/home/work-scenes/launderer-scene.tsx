"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { LuBanknote, LuCheck, LuCreditCard, LuGift, LuNfc } from "react-icons/lu";
import { Stage, during, useSceneClock } from "./stage";

// Kiosk tokens (Launderer-local/kiosk_app_flutter/lib/theme/app_theme.dart)
const K = {
  top: "#0B1C2C",
  bottom: "#1E3A5F",
  surface: "#1E2F47",
  muted: "#A0AEC0",
  accent: "#46C987",
  cardFill: "rgba(255,255,255,0.05)",
  cardStroke: "rgba(255,255,255,0.10)",
};
const LOOP = 11;

/** Groups thousands with spaces, matching the SaaS `formatNumberWithSpaces` convention. */
const money = (v: number) => {
  const [int, dec] = v.toFixed(2).split(".");
  return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}.${dec}`;
};

type Screen = "welcome" | "tap" | "amount" | "cash" | "done";

/** Launderer: the kiosk tops up an RFID card, then the transaction syncs to the cloud dashboard. */
export default function LaundererScene() {
  const { ref, t, loop } = useSceneClock(LOOP, 7.4);

  const screen: Screen = t < 1.3 ? "welcome" : t < 3.2 ? "tap" : t < 4.8 ? "amount" : t < 6.6 ? "cash" : t < 9.6 ? "done" : "welcome";
  const cardOnReader = during(t, 2.0, 3.2);
  const detected = t >= 2.5;
  const picked = t >= 3.8;
  const billIn = t >= 5.3;
  const syncing = during(t, 6.9, 7.6);
  const synced = t >= 7.5;
  const revenue = 1284.5 + (loop + (synced ? 1 : 0)) * 22;
  const w3Busy = t >= 8.6 || t < 0.6; // customer starts a wash right after topping up

  const machines = [
    { id: "W1", status: "busy" },
    { id: "W2", status: "online" },
    { id: "W3", status: w3Busy ? "busy" : "online" },
    { id: "W4", status: "maintenance" },
    { id: "D1", status: "busy" },
    { id: "D2", status: "offline" },
  ] as const;
  const STATUS = {
    online: { dot: "#10b981", label: "Online" },
    busy: { dot: "#f59e0b", label: "Busy" },
    maintenance: { dot: "#0ea5e9", label: "Maint." },
    offline: { dot: "#f43f5e", label: "Offline" },
  };

  return (
    <div ref={ref}>
      <Stage className="bg-[linear-gradient(135deg,#eef6fb_0%,#f7fafc_60%,#e7f7ef_100%)]">
        {/* Kiosk */}
        <div className="absolute left-3 top-3 h-[274px] w-[262px] rounded-[22px] bg-[#05101a] p-[7px] shadow-[0_24px_50px_rgba(11,28,44,0.35)]">
          <div className="relative h-full overflow-hidden rounded-[16px] text-white" style={{ background: `linear-gradient(180deg, ${K.top}, ${K.bottom})` }}>
            <div className="flex items-center justify-between px-3 pt-2.5">
              <Image src="/work/launderer-logo-dark.png" alt="Launderer" width={64} height={23} />
              <span className="rounded-full px-1.5 py-0.5 text-[7px]" style={{ background: K.cardFill, border: `1px solid ${K.cardStroke}`, color: K.muted }}>EN · ES</span>
            </div>

            <AnimatePresence mode="wait">
              {screen === "welcome" && (
                <motion.div key="welcome" className="absolute inset-x-3 bottom-3 top-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <p className="text-center text-[15px] font-bold">Welcome</p>
                  <p className="text-center text-[7.5px]" style={{ color: K.muted }}>Choose an option to get started</p>
                  <div className="mt-3 space-y-2">
                    {[
                      { icon: <LuNfc className="size-4" />, title: "Tap Card to Add Funds", sub: "Please tap your card on the reader to start", hl: true },
                      { icon: <LuCreditCard className="size-4" />, title: "Get a New Card", sub: "Buy a card from the dispenser", hl: false },
                    ].map((o) => (
                      <div key={o.title} className="flex items-center gap-2.5 rounded-[18px] p-2.5" style={{ background: o.hl ? "rgba(70,201,135,0.12)" : K.cardFill, border: `1px solid ${o.hl ? "rgba(70,201,135,0.45)" : K.cardStroke}` }}>
                        <span className="flex size-8 items-center justify-center rounded-full" style={{ background: o.hl ? K.accent : K.surface, color: o.hl ? K.top : "#fff" }}>{o.icon}</span>
                        <div>
                          <p className="text-[9px] font-bold">{o.title}</p>
                          <p className="text-[6.5px]" style={{ color: K.muted }}>{o.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {screen === "tap" && (
                <motion.div key="tap" className="absolute inset-x-3 bottom-3 top-10 flex flex-col items-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <p className="text-[14px] font-bold">{detected ? "Card Detected!" : "Tap Your Card"}</p>
                  <p className="text-[7.5px]" style={{ color: K.muted }}>{detected ? "Balance: USD 4.50" : "Tap your card on the reader"}</p>
                  <div className="relative mt-3 flex size-[120px] items-center justify-center">
                    {!detected &&
                      [0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="absolute size-16 rounded-full border-2"
                          style={{ borderColor: K.accent }}
                          animate={{ scale: [0.8, 1.9], opacity: [0.7, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5 }}
                        />
                      ))}
                    <span className="flex size-16 items-center justify-center rounded-full" style={{ background: detected ? K.accent : K.surface, border: `1px solid ${K.cardStroke}` }}>
                      {detected ? <LuCheck className="size-7" style={{ color: K.top }} /> : <LuNfc className="size-7" style={{ color: K.accent }} />}
                    </span>
                    {/* The physical RFID card */}
                    <motion.div
                      className="absolute flex h-[42px] w-[66px] flex-col justify-between rounded-md p-1.5 shadow-lg"
                      style={{ background: "linear-gradient(135deg,#1f5f8b,#163f5f)", border: "1px solid rgba(255,255,255,0.25)" }}
                      initial={false}
                      animate={cardOnReader ? { x: 18, y: 22, rotate: -8, opacity: 1 } : { x: 120, y: 90, rotate: 12, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 140, damping: 18 }}
                    >
                      <span className="text-[5.5px] font-bold italic">Launderer</span>
                      <span className="h-2 w-3 rounded-[2px] bg-[#e7c66b]" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {screen === "amount" && (
                <motion.div key="amount" className="absolute inset-x-3 bottom-3 top-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <p className="text-center text-[12px] font-bold">How much would you like to add?</p>
                  <div className="mx-auto mt-2 w-[150px] rounded-xl py-1.5 text-center text-[16px] font-bold" style={{ background: "#1A3A4F", border: `1px solid ${K.cardStroke}` }}>
                    USD {picked ? "20" : "0"}
                  </div>
                  <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                    {["10", "20", "30", "50", "100", "200"].map((a) => (
                      <motion.span
                        key={a}
                        className="rounded-xl py-2 text-center text-[10px] font-bold"
                        animate={a === "20" && picked ? { backgroundColor: K.accent, color: K.top, scale: [0.92, 1] } : { backgroundColor: K.cardFill, color: "#ffffff" }}
                        style={{ border: `1px solid ${K.cardStroke}` }}
                      >
                        {a}
                      </motion.span>
                    ))}
                  </div>
                  <p className="mt-2 text-center text-[7px]" style={{ color: K.muted }}>Pay with cash or card</p>
                </motion.div>
              )}

              {screen === "cash" && (
                <motion.div key="cash" className="absolute inset-x-3 bottom-3 top-10 flex flex-col items-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <p className="text-[13px] font-bold">Insert Cash</p>
                  <p className="text-[7.5px]" style={{ color: K.muted }}>Insert bills into the validator</p>
                  <div className="relative mt-3 h-[96px] w-[150px]">
                    <div className="absolute inset-x-6 top-[58px] h-2 rounded-full bg-black/60" />
                    <motion.div
                      className="absolute left-1/2 flex h-[46px] w-[96px] -translate-x-1/2 items-center justify-center rounded-md text-[9px] font-black text-[#0f3d26]"
                      style={{ background: "linear-gradient(135deg,#a7e3c0,#5fbf8c)", border: "1px solid rgba(255,255,255,0.4)" }}
                      initial={{ top: 4, opacity: 1 }}
                      animate={billIn ? { top: 54, opacity: 0, scaleY: 0.4 } : { top: 4, opacity: 1, scaleY: 1 }}
                      transition={{ duration: 0.7, ease: "easeIn" }}
                    >
                      <LuBanknote className="mr-1 size-3.5" /> 20
                    </motion.div>
                  </div>
                  <div className="w-[160px]">
                    <div className="h-1.5 overflow-hidden rounded-full" style={{ background: K.surface }}>
                      <motion.div className="h-full rounded-full" style={{ background: K.accent }} animate={{ width: billIn ? "100%" : "0%" }} transition={{ duration: 0.6, delay: 0.3 }} />
                    </div>
                    <p className="mt-1 text-center text-[8px] font-semibold">USD {billIn ? "20.00" : "0.00"} / 20.00</p>
                  </div>
                </motion.div>
              )}

              {screen === "done" && (
                <motion.div key="done" className="absolute inset-x-3 bottom-3 top-10 flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {/* Bonus gift reveal (widgets/bonus_gift_reveal_overlay.dart) */}
                  <motion.div className="relative mt-3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                    {/* Lid hinges open from its left edge; positioned without a CSS translate so motion's rotate can't displace it */}
                    <motion.span
                      className="absolute -left-[3px] -top-[9px] h-[11px] w-[58px] rounded-[4px]"
                      style={{ background: K.accent, transformOrigin: "0% 100%" }}
                      initial={{ rotate: 0 }}
                      animate={{ rotate: -30 }}
                      transition={{ delay: 0.35, type: "spring", stiffness: 180, damping: 12 }}
                    />
                    <span className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 bg-white/35" />
                    <span className="flex h-11 w-[52px] items-center justify-center rounded-md" style={{ background: "#2fa56b" }}>
                      <LuGift className="relative size-5" />
                    </span>
                  </motion.div>
                  <motion.p className="mt-2 text-[20px] font-black" style={{ color: K.accent }} initial={{ opacity: 0, scale: 0.6, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 14 }}>
                    +USD 2.00
                  </motion.p>
                  <p className="text-[7.5px]" style={{ color: K.muted }}>Bonus added</p>
                  <div className="mt-2.5 w-full space-y-1 rounded-[14px] p-2 text-[8px]" style={{ background: K.cardFill, border: `1px solid ${K.cardStroke}` }}>
                    <p className="flex justify-between"><span style={{ color: K.muted }}>Loaded to card</span><span className="font-bold">USD 20.00</span></p>
                    <p className="flex justify-between"><span style={{ color: K.muted }}>Balance on card</span><span className="font-bold" style={{ color: K.accent }}>USD 26.50</span></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Kiosk → cloud sync link */}
        <div className="absolute left-[275px] top-[150px] h-px w-[22px] bg-[repeating-linear-gradient(90deg,#94a3b8_0_3px,transparent_3px_6px)]" />
        <AnimatePresence>
          {syncing &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute top-[147px] size-1.5 rounded-full bg-[#46C987] shadow-[0_0_8px_#46C987]"
                initial={{ left: 272, opacity: 0 }}
                animate={{ left: 300, opacity: [0, 1, 0] }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
              />
            ))}
        </AnimatePresence>

        {/* Cloud SaaS store dashboard */}
        <div className="absolute right-3 top-3 h-[274px] w-[178px] rounded-xl border border-slate-200 bg-white p-2.5 text-slate-800 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between">
            <Image src="/work/launderer-logo.png" alt="" width={58} height={21} />
            <span className="flex items-center gap-1 text-[6.5px] font-semibold text-emerald-600">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
          </div>
          <p className="mt-2 text-[6.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">Store dashboard</p>
          <p className="text-[9.5px] font-bold">Downtown · Store 03</p>

          <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
            <p className="text-[6.5px] text-slate-500">Revenue today</p>
            <motion.p key={revenue} className="text-[14px] font-bold tabular-nums" initial={{ color: "#059669" }} animate={{ color: "#1e293b" }} transition={{ duration: 1.2 }}>
              USD {money(revenue)}
            </motion.p>
            <div className="mt-1 flex h-5 items-end gap-[2px]">
              {[30, 45, 35, 60, 50, 70, 55, 80, 65, synced ? 95 : 72].map((h, i) => (
                <motion.span key={i} className="flex-1 rounded-sm bg-sky-500/80" animate={{ height: `${h}%` }} transition={{ duration: 0.5 }} />
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 px-2 py-1 text-[6.5px]">
            <span className="text-slate-500">Kiosk 1 sync</span>
            <AnimatePresence mode="wait">
              <motion.span key={synced ? "ok" : "wait"} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} className={synced ? "font-semibold text-emerald-600" : "text-slate-400"}>
                {synced ? "✓ +USD 22.00 batch" : "Up to date"}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="mt-2 text-[6.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">Machines</p>
          <div className="mt-1 grid grid-cols-2 gap-1">
            {machines.map((m) => {
              const s = STATUS[m.status];
              return (
                <div key={m.id} className="flex items-center justify-between rounded-md border border-slate-200 px-1.5 py-1 text-[7px]">
                  <span className="font-semibold">{m.id}</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="relative flex size-1.5">
                      {m.status === "online" && <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: s.dot }} />}
                      <motion.span className="relative inline-flex size-1.5 rounded-full" animate={{ backgroundColor: s.dot }} />
                    </span>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Stage>
    </div>
  );
}
