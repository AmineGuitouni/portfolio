"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuCheck, LuRotateCcw } from "react-icons/lu";
import { EASE } from "@/components/home/shared";
import { useActiveTime } from "../canvas";
import { ACCENT } from "./tokens";

type Line = { account: string; owner?: string; debit?: number; credit?: number };

const ENTRIES: { type: string; key: string; at: number; lines: Line[] }[] = [
  {
    type: "cash_load",
    key: "k1:cash:7f3a92",
    at: 0.5,
    lines: [
      { account: "kiosk_cash", owner: "Kiosk 1 cash box", debit: 1000 },
      { account: "principal", owner: "Card ••4821", credit: 1000 },
    ],
  },
  {
    type: "bonus_grant",
    key: "k1:bonus:7f3a92",
    at: 1.7,
    lines: [
      { account: "bonus_expense", owner: "Store promotion", debit: 100 },
      { account: "bonus", owner: "Card ••4821", credit: 100 },
    ],
  },
];

const RESPONSES = {
  replay: { code: "200", tone: "ok", text: "Key already posted: the same entry comes back. Nothing new is written." },
  tamper: { code: "409", tone: "bad", text: "Same key, different amount: the payload hash doesn't match. Rejected." },
} as const;

const cents = (n?: number) => (n === undefined ? "" : n.toLocaleString("en-US").replace(",", " "));

export function LedgerScreen({ active }: { active: boolean }) {
  const t = useActiveTime(active, 9);
  const [response, setResponse] = useState<{ kind: keyof typeof RESPONSES; n: number } | null>(null);

  useEffect(() => {
    if (!response) return;
    const id = setTimeout(() => setResponse(null), 3600);
    return () => clearTimeout(id);
  }, [response]);

  const send = (kind: keyof typeof RESPONSES) => setResponse((r) => ({ kind, n: (r?.n ?? 0) + 1 }));
  const r = response ? RESPONSES[response.kind] : null;

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[22px] border border-black/[0.08] bg-white shadow-[0_40px_80px_-44px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-3.5">
        <div>
          <p className="text-[14px] font-semibold tracking-tight">Payment ledger</p>
          <p className="font-mono text-[10.5px] text-[#8A8A85]">Kiosk 1 · the only writer · amounts in cents</p>
        </div>
        <span className="rounded-full bg-[#EEF3FF] px-2.5 py-1 font-mono text-[10.5px]" style={{ color: ACCENT }}>
          2 entries · 4 lines
        </span>
      </div>

      <div className="space-y-3 px-6 pt-4">
        {ENTRIES.map((e, i) => (
          <motion.div
            key={e.type}
            className="relative rounded-2xl border border-black/[0.07] bg-[#FAFAF7] p-3.5"
            initial={false}
            animate={{ opacity: t > e.at ? 1 : 0, y: t > e.at ? 0 : 12 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {i === 0 && response && (
              <motion.span
                key={response.n}
                className="pointer-events-none absolute -inset-px rounded-2xl border-2"
                style={{ borderColor: r?.tone === "ok" ? ACCENT : "#e11d48" }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.6, delay: 0.3 }}
              />
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#111] px-1.5 py-0.5 font-mono text-[10.5px] text-white">{e.type}</span>
                <span className="font-mono text-[10.5px] text-[#8A8A85]">key {e.key}</span>
              </div>
              <motion.span
                className="flex items-center gap-1 font-mono text-[10.5px] text-emerald-600"
                initial={false}
                animate={{ opacity: t > e.at + 0.9 ? 1 : 0 }}
              >
                <LuCheck className="size-3" strokeWidth={3} /> Σ debit = Σ credit
              </motion.span>
            </div>
            <table className="mt-2 w-full text-[12.5px]">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-[0.12em] text-[#8A8A85]">
                  <th className="pb-1 font-normal">Account</th>
                  <th className="pb-1 text-right font-normal">Debit</th>
                  <th className="pb-1 text-right font-normal">Credit</th>
                </tr>
              </thead>
              <tbody>
                {e.lines.map((l, j) => (
                  <motion.tr key={l.account} initial={false} animate={{ opacity: t > e.at + 0.25 + j * 0.25 ? 1 : 0 }} transition={{ duration: 0.3 }}>
                    <td className="py-0.5">
                      <span className="font-mono text-[11.5px]">{l.account}</span> <span className="text-[#8A8A85]">· {l.owner}</span>
                    </td>
                    <td className="py-0.5 text-right font-mono tabular-nums">{cents(l.debit)}</td>
                    <td className="py-0.5 text-right font-mono tabular-nums">{cents(l.credit)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ))}
      </div>

      <motion.div className="mx-6 mt-3 flex items-center justify-between rounded-2xl px-4 py-3 text-white" style={{ background: ACCENT }} initial={false} animate={{ opacity: t > 3 ? 1 : 0, y: t > 3 ? 0 : 10 }} transition={{ duration: 0.5, ease: EASE }}>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">Card ••4821 = sum of its lines</p>
          <p className="mt-0.5 font-mono text-[12.5px]">principal 1 000 + bonus 100</p>
        </div>
        <p className="font-mono text-[24px] font-semibold">$11.00</p>
      </motion.div>

      <div className="absolute inset-x-6 bottom-4 flex items-center gap-2">
        <button type="button" onClick={() => send("replay")} className="flex items-center gap-1.5 rounded-full bg-[#111] px-3.5 py-2 text-[12px] font-medium text-white transition-transform hover:scale-[1.03] active:scale-95">
          <LuRotateCcw className="size-3.5" /> Post the cash load again
        </button>
        <button type="button" onClick={() => send("tamper")} className="rounded-full border border-black/10 bg-white px-3.5 py-2 text-[12px] font-medium transition-transform hover:scale-[1.03] active:scale-95">
          Same key, $100
        </button>
        <AnimatePresence>
          {r && (
            <motion.p
              key={response!.n}
              className="ml-1 flex min-w-0 items-center gap-2 text-[11.5px] leading-tight text-[#55554F]"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10.5px] font-semibold ${r.tone === "ok" ? "bg-[#EEF3FF]" : "bg-rose-50 text-rose-600"}`} style={r.tone === "ok" ? { color: ACCENT } : undefined}>
                {r.code}
              </span>
              {r.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
