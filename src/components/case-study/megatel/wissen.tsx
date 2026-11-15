"use client";

import { AnimatePresence, motion } from "motion/react";
import { LuArrowLeft, LuBookOpen, LuSearch, LuSparkles, LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import { EASE } from "@/components/home/shared";
import { useActiveTime } from "../canvas";
import { Kbd, Label, Panel } from "./app-window";
import { C } from "./tokens";

const QUERY = "reinigng";
const QUESTION = "Can they also clean on Saturdays?";
const ANSWER_SAY = "Yes, weekend cleaning is available on request.";
const ANSWER_BG = "Weekend slots cost extra. The partner confirms the price in the offer, so don't name a figure.";
const LOOP = 15;

const RESULTS = [
  { title: "Reinigungsintervall", sub: "How often the partner cleans", tag: "Services" },
  { title: "Grund- vs. Unterhaltsreinigung", sub: "Deep clean or regular upkeep", tag: "Services" },
  { title: "Reinigung am Wochenende", sub: "Saturday and Sunday slots", tag: "Scheduling" },
];

/** Text revealed character by character between two moments. */
const typed = (text: string, t: number, from: number, cps: number) => text.slice(0, Math.max(0, Math.floor((t - from) * cps)));

function SayBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-l-[3px] px-3 py-2" style={{ background: C.greenSoft, borderColor: C.green }}>
      <p className="text-[8.5px] font-bold uppercase tracking-[0.14em]" style={{ color: C.green }}>Say</p>
      <p className="mt-0.5 text-[11px] font-medium leading-snug">{children}</p>
    </div>
  );
}

function BackgroundBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-l-[3px] px-3 py-2" style={{ background: C.amberSoft, borderColor: "#f59e0b" }}>
      <p className="text-[8.5px] font-bold uppercase tracking-[0.14em]" style={{ color: C.amber }}>Background · no promises</p>
      <p className="mt-0.5 text-[11px] leading-snug" style={{ color: "#57534e" }}>{children}</p>
    </div>
  );
}

export function WissenScreen({ active }: { active: boolean }) {
  const t = useActiveTime(active, 11.5, LOOP);
  const phase = t < 2.3 ? "search" : t < 3.6 ? "results" : t < 7 ? "entry" : "ai";
  const query = phase === "ai" ? QUESTION : typed(QUERY, t, 0.6, 7);
  const typing = (phase === "search" && t > 0.4) || (phase === "ai" && t < 7.9);
  const aiQuery = phase === "ai" ? typed(QUESTION, t, 7, 30) : "";

  return (
    <div className="grid h-full grid-cols-[200px_1fr]">
      {/* The interview keeps running underneath, dimmed while the panel has focus. */}
      <div className="border-r p-4 opacity-55" style={{ borderColor: C.border }}>
        <Label>Question 3</Label>
        <p className="mt-2 text-[12.5px] font-bold leading-snug">How happy are you with your current provider?</p>
        <div className="mt-3 space-y-1.5">
          {["Very happy", "It could be better", "Not happy"].map((o, i) => (
            <div key={o} className="flex items-center gap-2 rounded-lg border bg-white px-2 py-1.5 text-[10px] font-semibold" style={{ borderColor: C.borderStrong }}>
              <Kbd>{i + 1}</Kbd> {o}
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-lg px-2 py-1.5 text-[9.5px] font-semibold" style={{ background: C.accentSoft, color: C.brand }}>★ 2 entries pinned to this question</p>
      </div>

      <div className="flex min-h-0 flex-col p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-lg p-0.5 text-[10.5px] font-semibold" style={{ background: C.inset }}>
            <span className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 shadow-sm"><LuBookOpen className="size-3" style={{ color: C.brand }} /> Wissen</span>
            <span className="px-2.5 py-1" style={{ color: C.muted }}>Partner</span>
          </div>
          <span className="text-[9.5px]" style={{ color: C.muted }}>214 entries · 3 collections</span>
        </div>

        <div
          className="mt-3 flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 transition-shadow duration-300"
          style={{ borderColor: typing ? C.brand : C.borderStrong, boxShadow: typing ? "0 0 0 3px rgba(211,87,13,0.12)" : "none" }}
        >
          {phase === "ai" ? <LuSparkles className="size-3.5" style={{ color: C.brand }} /> : <LuSearch className="size-3.5" style={{ color: C.muted }} />}
          <span className="flex-1 text-[12px] font-medium">
            {phase === "ai" ? aiQuery : query}
            {typing && <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse" style={{ background: C.text }} />}
            {!query && phase === "search" && !typing && <span style={{ color: C.faint }}>Search or ask…</span>}
          </span>
          {phase === "ai" ? (
            <span className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[9.5px] font-bold text-white" style={{ background: C.brand }}>Ask AI <Kbd dark>⌃⏎</Kbd></span>
          ) : (
            <Kbd>Ctrl K</Kbd>
          )}
        </div>

        <div className="relative mt-3 min-h-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "search" && (
              <motion.div key="idle" className="space-y-1.5" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Label>For this question</Label>
                {["Zufriedenheit nachfragen", "Anbieterwechsel"].map((x) => (
                  <div key={x} className="rounded-lg border bg-white px-3 py-2 text-[11px] font-semibold" style={{ borderColor: C.border }}>
                    <span style={{ color: C.highlight }}>★ </span>{x}
                  </div>
                ))}
              </motion.div>
            )}

            {phase === "results" && (
              <motion.div key="results" className="space-y-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <p className="text-[9.5px]" style={{ color: C.muted }}>
                  3 results for <span className="font-semibold line-through decoration-red-400">reinigng</span> → <span className="font-semibold" style={{ color: C.green }}>reinigung</span>
                </p>
                {RESULTS.map((r, i) => (
                  <motion.div
                    key={r.title}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                    style={i === 0 ? { background: C.accentSoft, borderColor: "#fbd5b5" } : { background: "white", borderColor: C.border }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3, ease: EASE }}
                  >
                    <div>
                      <p className="text-[11.5px] font-bold"><mark className="rounded-sm bg-transparent" style={{ color: C.brand }}>Reinigung</mark>{r.title.slice(9)}</p>
                      <p className="text-[9.5px]" style={{ color: C.muted }}>{r.sub}</p>
                    </div>
                    <span className="text-[9px]" style={{ color: C.faint }}>{r.tag}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {phase === "entry" && (
              <motion.div key="entry" className="space-y-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }}>
                <p className="flex items-center gap-1 text-[9.5px] font-semibold" style={{ color: C.muted }}><LuArrowLeft className="size-3" /> 3 results</p>
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-black tracking-tight">Reinigungsintervall</p>
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: C.inset, color: C.muted }}>Rule</span>
                </div>
                <SayBlock>“We set the interval to suit your premises: daily, weekly or every two weeks.”</SayBlock>
                <BackgroundBlock>The partner decides the final interval after visiting. Never promise a price on the phone.</BackgroundBlock>
                <p className="text-[9.5px]" style={{ color: C.faint }}>Source · Partner handbook, p. 4</p>
              </motion.div>
            )}

            {phase === "ai" && (
              <motion.div key="ai" className="space-y-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                {t < 8.4 ? (
                  <div className="flex items-center gap-2 pt-2 text-[10.5px]" style={{ color: C.muted }}>
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="size-1.5 rounded-full" style={{ background: C.brand }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </span>
                    Searching the knowledge base…
                  </div>
                ) : (
                  <>
                    <Panel className="space-y-2 p-3">
                      <p className="flex items-center gap-1.5 text-[9.5px] font-bold" style={{ color: C.brand }}><LuSparkles className="size-3" /> Answer from 2 entries</p>
                      <SayBlock>
                        {typed(ANSWER_SAY, t, 8.4, 45)}
                        <Cite n={3} show={t > 9.6} />
                      </SayBlock>
                      {t > 9.6 && (
                        <BackgroundBlock>
                          {typed(ANSWER_BG, t, 9.6, 55)}
                          <Cite n={3} show={t > 11.4} />
                          <Cite n={1} show={t > 11.4} />
                        </BackgroundBlock>
                      )}
                    </Panel>
                    <motion.div className="flex items-center justify-between text-[9.5px]" style={{ color: C.muted }} initial={{ opacity: 0 }} animate={{ opacity: t > 11.6 ? 1 : 0 }}>
                      <span>Not in the entries? It says so instead of guessing.</span>
                      <span className="flex gap-2">
                        <LuThumbsUp className="size-3.5" style={{ color: t > 12.6 ? C.green : undefined }} />
                        <LuThumbsDown className="size-3.5" />
                      </span>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Cite({ n, show }: { n: number; show: boolean }) {
  if (!show) return null;
  return (
    <motion.sup
      className="ml-0.5 inline-flex size-3.5 items-center justify-center rounded-[4px] text-[8px] font-bold text-white"
      style={{ background: C.brand }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      {n}
    </motion.sup>
  );
}
