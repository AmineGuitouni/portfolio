"use client";

import { AnimatePresence, motion } from "motion/react";
import { LuCheck, LuWifiOff } from "react-icons/lu";
import { EASE } from "@/components/home/shared";
import { useActiveTime } from "../canvas";
import { ACCENT, usd } from "./tokens";

const OUTBOX = [
  { id: "e1", table: "ledger_entries", what: "cash_load", amount: "$10.00", at: 0.3 },
  { id: "e2", table: "ledger_entries", what: "bonus_grant", amount: "$1.00", at: 0.6 },
  { id: "e3", table: "ledger_entries", what: "charge · W03", amount: "$3.50", at: 0.9 },
  { id: "e4", table: "washer_cycles", what: "W03 · program 3", amount: "", at: 1.2 },
];

const FEED = [
  { what: "Washer 3 · card ••4821", kind: "Machine sale", amount: "$3.50" },
  { what: "Bonus · card ••4821", kind: "Promotion", amount: "$1.00" },
  { what: "Cash load · Kiosk 1", kind: "Load", amount: "$10.00" },
];

const OLDER = [
  { what: "Dryer 2 · card ••1170", kind: "Machine sale", amount: "$1.25" },
  { what: "Card load · Kiosk 2", kind: "Load", amount: "$20.00" },
];

/** Packets flying along the batch arrow. */
function Flight({ show, color }: { show: boolean; color: string }) {
  return (
    <AnimatePresence>
      {show &&
        [0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute top-[3px] size-2 rounded-full"
            style={{ background: color }}
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: "easeInOut" }}
          />
        ))}
    </AnimatePresence>
  );
}

export function SyncScreen({ active }: { active: boolean }) {
  const t = useActiveTime(active, 4.4, 11);
  const status = t < 2.2 ? "queued" : t < 3.3 ? "sending" : t < 5.2 ? "no reply" : t < 6.6 ? "resending" : "acked";
  const landed = t >= 3;
  const sales = 128450 + (landed ? 350 : 0);
  const loads = 84200 + (landed ? 1000 : 0);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[22px] border border-black/[0.08] bg-white shadow-[0_40px_80px_-44px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#F6F6F3] px-4 py-2.5">
        <div className="flex gap-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <p className="mx-auto rounded-md bg-white px-3 py-1 font-mono text-[10.5px] text-[#8A8A85]">dashboard / stores / riverside / money</p>
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-10 p-5">
        {/* Kiosk side */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8A85]">Kiosk 1 · sync outbox</p>
          <div className="mt-2 min-h-[226px] rounded-2xl border border-dashed border-black/[0.12] bg-[#FAFAF7] p-2.5">
            <AnimatePresence>
              {OUTBOX.filter((r) => t >= r.at && status !== "acked").map((r) => (
                <motion.div
                  key={r.id}
                  className="mb-1.5 rounded-xl border border-black/[0.06] bg-white px-2.5 py-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10.5px] font-medium">{r.what}</span>
                    <span className="font-mono text-[10.5px] text-[#55554F]">{r.amount}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="font-mono text-[9.5px] text-[#8A8A85]">{r.table}</span>
                    <span className={`font-mono text-[9.5px] ${status === "no reply" ? "text-amber-600" : ""}`} style={status === "sending" || status === "resending" ? { color: ACCENT } : undefined}>
                      {status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {status === "acked" && (
              <motion.p className="flex h-[200px] items-center justify-center gap-1.5 text-[12px] text-emerald-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <LuCheck className="size-4" strokeWidth={3} /> Outbox empty
              </motion.p>
            )}
          </div>
          <p className="mt-2 text-[10.5px] leading-snug text-[#8A8A85]">Database triggers write every change here. Rows leave only when the cloud confirms them.</p>
        </div>

        {/* Cloud side */}
        <div className="relative">
          {/* The batch, crossing from the kiosk to the cloud. */}
          <div className="absolute -left-10 top-[60px] w-10">
            <div className="relative h-2 w-full">
              <span className="absolute inset-x-0 top-[6px] border-t border-dashed border-black/20" />
              <Flight show={status === "sending" && t < 3} color={ACCENT} />
              <Flight show={status === "resending" && t < 5.9} color="#111" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8A85]">POST /api/v1/sync/ingest</p>
            <AnimatePresence mode="wait">
              {t >= 3 && t < 5.2 && (
                <motion.span key="new" className="rounded-full bg-[#EEF3FF] px-2 py-0.5 font-mono text-[10px]" style={{ color: ACCENT }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  4 events · 4 new
                </motion.span>
              )}
              {t >= 6 && t < 9.5 && (
                <motion.span key="dupe" className="rounded-full bg-black/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#55554F]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  4 events · 0 new · already recorded
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {status === "no reply" && t > 3.4 && (
              <motion.div className="mt-2 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-800" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <LuWifiOff className="size-3.5 shrink-0" />
                The reply was lost on the way back. The kiosk will send the batch again.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {[
              { k: "Machine sales today", v: sales },
              { k: "Loaded today", v: loads },
            ].map((kpi) => (
              <div key={kpi.k} className="rounded-2xl border border-black/[0.07] p-3">
                <p className="text-[10.5px] text-[#8A8A85]">{kpi.k}</p>
                <motion.p key={kpi.v} className="mt-0.5 font-mono text-[20px] font-semibold tabular-nums tracking-tight" initial={{ color: ACCENT }} animate={{ color: "#111" }} transition={{ duration: 1.2 }}>
                  {usd(kpi.v)}
                </motion.p>
              </div>
            ))}
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8A85]">Money activity</p>
          <div className="mt-1.5">
            {[...(landed ? FEED : []), ...OLDER].map((row, i) => (
              <motion.div
                key={row.what}
                className="flex items-center justify-between border-b border-black/[0.05] py-2 text-[12px] last:border-0"
                initial={i < 3 && landed ? { opacity: 0, backgroundColor: "rgba(46,107,255,0.10)" } : false}
                animate={{ opacity: 1, backgroundColor: "rgba(46,107,255,0)" }}
                transition={{ duration: 1.4, delay: i * 0.08 }}
              >
                <span>
                  {row.what} <span className="text-[#8A8A85]">· {row.kind}</span>
                </span>
                <span className="font-mono">{row.amount}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
