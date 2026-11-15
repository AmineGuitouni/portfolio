"use client";

import { AnimatePresence, motion } from "motion/react";
import { LuBanknote, LuCheck, LuCreditCard, LuGift, LuReceipt } from "react-icons/lu";
import { EASE } from "@/components/home/shared";
import { useActiveTime } from "../canvas";
import { K, usd } from "./tokens";

export const STAGE_W = 680;
export const STAGE_H = 470;

/** The touchscreen bezel and the kiosk app's header. */
function Kiosk({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 rounded-[30px] bg-[#16181C] p-[14px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
      <div className="relative h-full overflow-hidden rounded-[18px] text-white" style={{ background: `linear-gradient(180deg, ${K.top}, ${K.bottom})` }}>
        <div className="flex items-center justify-between px-6 pt-4">
          <p className="text-[15px] font-semibold tracking-tight">
            Launderer<span style={{ color: K.green }}>.</span>
          </p>
          <div className="flex items-center gap-3 text-[11px]" style={{ color: K.muted }}>
            <span className="rounded-full px-2 py-0.5" style={{ background: K.fill, border: `1px solid ${K.stroke}` }}>
              <b className="text-white">EN</b> · ES
            </span>
            <span className="font-mono">18:02</span>
          </div>
        </div>
        {children}
      </div>
      <span className="absolute bottom-[5px] left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/10" />
    </div>
  );
}

function Card({ active, children, className = "" }: { active?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`rounded-2xl ${className}`}
      animate={{ scale: active ? 0.97 : 1, borderColor: active ? K.green : K.stroke, background: active ? "rgba(70,201,135,0.12)" : K.fill }}
      transition={{ duration: 0.3, ease: EASE }}
      style={{ borderWidth: 1.5, borderStyle: "solid" }}
    >
      {children}
    </motion.div>
  );
}

/** One $5 bill feeding into the validator slot. */
function Bill({ show, delay = 0 }: { show: boolean; delay?: number }) {
  return (
    <motion.div
      className="absolute left-1/2 top-0 flex h-[64px] w-[132px] -translate-x-1/2 items-center justify-center rounded-md border border-emerald-900/30 text-[13px] font-bold text-emerald-950"
      style={{ background: "linear-gradient(135deg,#cfe8c9,#a8d3a0)" }}
      initial={{ y: -10, opacity: 0 }}
      animate={show ? { y: [-10, 0, 66], opacity: [0, 1, 1] } : { y: -10, opacity: 0 }}
      transition={{ duration: 1, times: [0, 0.3, 1], ease: "easeInOut", delay }}
    >
      <span className="rounded-full border border-emerald-900/30 px-2">$5</span>
    </motion.div>
  );
}

export function KioskScreen({ active }: { active: boolean }) {
  const t = useActiveTime(active, 7, 10.5);
  const phase = t < 1.7 ? "method" : t < 4.8 ? "cash" : t < 6.5 ? "bonus" : "done";
  const inserted = t < 2.6 ? 0 : t < 3.8 ? 500 : 1000;

  return (
    <Kiosk>
      <AnimatePresence mode="wait" initial={false}>
        {phase === "method" && (
          <motion.div key="method" className="px-8 pt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
            <p className="text-[30px] font-semibold tracking-tight">Welcome!</p>
            <p className="mt-1 text-[14px]" style={{ color: K.muted }}>
              Choose a payment method to add funds
            </p>
            <div className="mt-7 grid grid-cols-2 gap-4">
              <Card className="p-5">
                <LuCreditCard className="size-8" style={{ color: K.muted }} />
                <p className="mt-6 text-[17px] font-semibold">Credit / Debit Card</p>
                <p className="mt-1 text-[12px]" style={{ color: K.muted }}>
                  Card, Apple Pay, Google Pay
                </p>
              </Card>
              <Card className="p-5" active={t > 1}>
                <LuBanknote className="size-8" style={{ color: K.green }} />
                <p className="mt-6 text-[17px] font-semibold">Pay with cash</p>
                <p className="mt-1 text-[12px]" style={{ color: K.muted }}>
                  Bills into the validator
                </p>
              </Card>
            </div>
            <p className="mt-6 text-center text-[11px]" style={{ color: K.muted }}>
              Card ••4821 · balance $0.00
            </p>
          </motion.div>
        )}

        {(phase === "cash" || phase === "bonus") && (
          <motion.div key="cash" className="grid grid-cols-[1fr_1.05fr] gap-6 px-8 pt-7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <div>
              <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: K.muted }}>
                Cash Payment
              </p>
              <p className="mt-1 text-[24px] font-semibold tracking-tight">Insert Your Bills</p>
              <div className="relative mt-6 h-[180px]">
                <Bill show={t > 1.9} />
                <Bill show={t > 3.1} />
                <div className="absolute left-1/2 top-[70px] h-[110px] w-[170px] -translate-x-1/2 rounded-xl" style={{ background: K.surface, border: `1px solid ${K.stroke}` }}>
                  <div className="mx-auto mt-3 h-2 w-[146px] rounded-full bg-black/60" />
                  <p className="mt-6 text-center text-[11px]" style={{ color: K.muted }}>
                    Insert bills right
                  </p>
                  <div className="mx-auto mt-2 flex w-fit gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} className="size-1.5 rounded-full" style={{ background: K.green }} animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="rounded-2xl p-5" style={{ background: K.fill, border: `1px solid ${K.stroke}` }}>
                <p className="text-[12px]" style={{ color: K.muted }}>
                  Amount Inserted
                </p>
                <motion.p key={inserted} className="mt-1 font-mono text-[44px] font-semibold tabular-nums tracking-tight" initial={{ scale: 1.08, color: K.green }} animate={{ scale: 1, color: "#fff" }} transition={{ duration: 0.6 }}>
                  {usd(inserted)}
                </motion.p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: K.inactive }}>
                  <motion.div className="h-full rounded-full" style={{ background: K.green }} animate={{ width: `${inserted / 10}%` }} transition={{ duration: 0.5, ease: EASE }} />
                </div>
                <p className="mt-2 text-[11px]" style={{ color: K.muted }}>
                  Loading card ••4821
                </p>
              </div>
              <motion.div
                className="mt-4 rounded-xl py-3 text-center text-[15px] font-semibold"
                animate={{ background: inserted >= 1000 ? K.green : K.inactive, color: inserted >= 1000 ? "#0B1C2C" : K.muted, scale: t > 4.3 && t < 4.6 ? 0.96 : 1 }}
              >
                Done
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div key="done" className="flex flex-col items-center px-8 pt-8 text-center" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
            <motion.span className="flex size-14 items-center justify-center rounded-full" style={{ background: K.green }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}>
              <LuCheck className="size-7 text-[#0B1C2C]" strokeWidth={3} />
            </motion.span>
            <p className="mt-4 text-[26px] font-semibold tracking-tight">Payment Successful!</p>
            <div className="mt-5 w-[360px] space-y-2 rounded-2xl p-4 text-left text-[13px]" style={{ background: K.fill, border: `1px solid ${K.stroke}` }}>
              <div className="flex justify-between">
                <span style={{ color: K.muted }}>Amount Paid</span>
                <span className="font-mono">$10.00</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: K.muted }}>Promotional bonus</span>
                <span className="font-mono" style={{ color: K.green }}>
                  +$1.00
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t pt-2" style={{ borderColor: K.stroke }}>
                <span className="font-semibold">New balance</span>
                <span className="text-right">
                  <span className="font-mono text-[20px] font-semibold">$11.00</span>
                  <span className="block text-[10.5px]" style={{ color: K.muted }}>
                    10.00 + 1.00 bonus
                  </span>
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <span className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold" style={{ background: K.fill, border: `1px solid ${K.stroke}` }}>
                <LuReceipt className="size-4" /> Get Receipt
              </span>
              <span className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#0B1C2C]" style={{ background: K.green }}>
                Back to home
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The bonus reveal sits over the cash screen, as in the app. */}
      <AnimatePresence>
        {phase === "bonus" && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1C2C]/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <motion.div initial={{ scale: 0.4, rotate: -12 }} animate={{ scale: [0.4, 1.15, 1], rotate: [-12, 6, 0] }} transition={{ duration: 0.8, ease: EASE }}>
              <LuGift className="size-16" style={{ color: K.green }} />
            </motion.div>
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className="absolute size-1.5 rounded-full"
                  style={{ background: i % 2 ? K.green : "#fff", left: "50%", top: "42%" }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ x: Math.cos(a) * 110, y: Math.sin(a) * 90, opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut", delay: 0.35 }}
                />
              );
            })}
            <motion.p className="mt-4 font-mono text-[40px] font-semibold" style={{ color: K.green }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              +$1.00
            </motion.p>
            <motion.p className="text-[14px]" style={{ color: K.muted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
              Promotional bonus · 10% on $10 loads
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </Kiosk>
  );
}
