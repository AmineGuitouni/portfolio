"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowLeft, LuCheck, LuPause, LuPhone } from "react-icons/lu";
import { EASE, usePrefersReducedMotion } from "@/components/home/shared";
import { Kbd, Label, Panel } from "./app-window";
import { C } from "./tokens";

type SlideId = "intro" | "q1" | "callback" | "sat" | "offer" | "appt" | "end";

const SCRIPT: Record<SlideId, { node: string; q: string; opts: { label: string; to: SlideId }[] }> = {
  intro: {
    node: "Intro",
    q: "Am I speaking with the person who looks after cleaning and facility services?",
    opts: [
      { label: "Yes, speaking", to: "q1" },
      { label: "No, call back later", to: "callback" },
    ],
  },
  q1: {
    node: "Service?",
    q: "Does your company currently use an external cleaning service?",
    opts: [
      { label: "Yes, regularly", to: "sat" },
      { label: "Now and then", to: "sat" },
      { label: "No", to: "offer" },
    ],
  },
  callback: {
    node: "Callback",
    q: "When is a good time to reach the right person?",
    opts: [
      { label: "Today, afternoon", to: "end" },
      { label: "Tomorrow morning", to: "end" },
    ],
  },
  sat: {
    node: "Rating",
    q: "How happy are you with your current provider?",
    opts: [
      { label: "Very happy", to: "end" },
      { label: "It could be better", to: "offer" },
      { label: "Not happy", to: "offer" },
    ],
  },
  offer: {
    node: "Offer",
    q: "Would you like a free, no-obligation quote from a partner near you?",
    opts: [
      { label: "Yes, book a visit", to: "appt" },
      { label: "No, thank you", to: "end" },
    ],
  },
  appt: {
    node: "Visit",
    q: "Which day suits you for the on-site visit?",
    opts: [
      { label: "This week", to: "end" },
      { label: "Next week", to: "end" },
    ],
  },
  end: {
    node: "Done",
    q: "Interview complete. Thank you for your time!",
    opts: [{ label: "Start over", to: "intro" }],
  },
};

// Answers the demo picks by itself until the visitor takes over.
const AUTO: Record<SlideId, number> = { intro: 0, q1: 0, callback: 0, sat: 1, offer: 0, appt: 1, end: 0 };

const NODES: Record<SlideId, { x: number; y: number; w: number }> = {
  intro: { x: 110, y: 22, w: 70 },
  q1: { x: 73, y: 86, w: 70 },
  callback: { x: 180, y: 86, w: 64 },
  sat: { x: 34, y: 152, w: 58 },
  offer: { x: 112, y: 152, w: 58 },
  appt: { x: 112, y: 218, w: 58 },
  end: { x: 110, y: 286, w: 196 },
};
const NODE_H = 22;

// Hand-routed so no edge crosses a node.
const EDGES: { from: SlideId; to: SlideId; d: string }[] = [
  { from: "intro", to: "q1", d: "M110 33 C110 56 73 52 73 75" },
  { from: "intro", to: "callback", d: "M110 33 C110 56 180 52 180 75" },
  { from: "q1", to: "sat", d: "M73 97 C73 122 34 116 34 141" },
  { from: "q1", to: "offer", d: "M73 97 C73 122 112 116 112 141" },
  { from: "sat", to: "offer", d: "M63 152 L83 152" },
  { from: "sat", to: "end", d: "M34 163 L34 275" },
  { from: "offer", to: "appt", d: "M112 163 L112 207" },
  { from: "offer", to: "end", d: "M141 152 C158 152 158 230 158 275" },
  { from: "appt", to: "end", d: "M112 229 L112 275" },
  { from: "callback", to: "end", d: "M180 97 L180 275" },
];

export function InterviewScreen({ active, keyboard = false }: { active: boolean; keyboard?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [path, setPath] = useState<SlideId[]>(["intro"]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [paused, setPaused] = useState(false);
  const busy = useRef(false);
  const current = path[path.length - 1];
  const slide = SCRIPT[current];

  const choose = useCallback(
    (i: number, byUser: boolean) => {
      if (busy.current || !slide.opts[i]) return;
      busy.current = true;
      if (byUser) setInteracted(true);
      setChosen(i);
      setTimeout(() => {
        busy.current = false;
        setChosen(null);
        const to = slide.opts[i].to;
        setPath((p) => (to === "intro" ? ["intro"] : [...p, to]));
      }, 420);
    },
    [slide],
  );

  const back = () => {
    if (path.length > 1 && !busy.current) {
      setInteracted(true);
      setPath((p) => p.slice(0, -1));
    }
  };

  // The demo answers on its own until the visitor clicks or types.
  useEffect(() => {
    if (!active || interacted || reduced) return;
    const id = setTimeout(() => choose(AUTO[current], false), current === "end" ? 2600 : 1700);
    return () => clearTimeout(id);
  }, [active, interacted, reduced, current, choose]);

  useEffect(() => {
    if (!active || !keyboard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).closest("input, textarea, [contenteditable]")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= slide.opts.length) choose(n - 1, true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, keyboard, slide, choose]);

  useEffect(() => {
    if (!paused) return;
    const id = setTimeout(() => setPaused(false), 2200);
    return () => clearTimeout(id);
  }, [paused]);

  const visited = new Set(path);
  const walked = new Set(path.slice(1).map((to, i) => `${path[i]}>${to}`));
  const step = path.length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-white px-5 py-2.5" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[9.5px] font-bold" style={{ background: C.greenSoft, color: C.green }}>
            <LuPhone className="size-2.5" /> 00:41
          </span>
          <div className="leading-tight">
            <p className="text-[11.5px] font-bold">Bäckerei Sonnenschein</p>
            <p className="text-[9.5px]" style={{ color: C.muted }}>Customer Survey · script v3</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setInteracted(true);
            setPaused(true);
          }}
          className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-colors hover:bg-[#fff1e6]"
          style={{ borderColor: C.borderStrong, color: C.action }}
        >
          <LuPause className="size-3" /> Pause for follow-up
        </button>
      </div>
      <div className="h-[3px]" style={{ background: C.inset }}>
        <motion.div className="h-full" style={{ background: C.brand }} animate={{ width: `${current === "end" ? 100 : Math.min(92, step * 18)}%` }} transition={{ duration: 0.5, ease: EASE }} />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_232px] gap-3 p-4">
        <Panel className="relative flex flex-col overflow-hidden p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${current}-${step}`}
              className="flex flex-1 flex-col"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <Label>{current === "end" ? "Finished" : `Question ${step}`}</Label>
              <p className="mt-2 text-[16px] font-bold leading-snug tracking-tight">{slide.q}</p>
              <div className="mt-4 space-y-2">
                {slide.opts.map((opt, i) => {
                  const on = chosen === i;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => choose(i, true)}
                      className="flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[12px] font-semibold transition-colors duration-200 hover:border-[#d3570d]"
                      style={on ? { background: C.brand, borderColor: C.brand, color: "white" } : { background: "white", borderColor: C.borderStrong }}
                    >
                      <Kbd dark={on}>{i + 1}</Kbd>
                      {opt.label}
                      {on && <LuCheck className="ml-auto size-3.5" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-auto flex items-center justify-between pt-3 text-[9.5px]" style={{ color: C.muted }}>
            <button type="button" onClick={back} className="flex items-center gap-1 font-semibold disabled:opacity-40" disabled={path.length < 2}>
              <LuArrowLeft className="size-3" /> Back
            </button>
            <span>
              {interacted ? "Answer with the number keys" : "Playing by itself. Click to take over"}
            </span>
          </div>

          <AnimatePresence>
            {paused && (
              <motion.div
                className="absolute inset-x-4 bottom-10 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[10.5px] font-semibold text-white"
                style={{ background: C.text }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
              >
                <LuPause className="size-3" style={{ color: C.highlight }} />
                Paused. You can pick it up later at this exact question.
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>

        <Panel className="flex flex-col p-3">
          <div className="flex items-center justify-between">
            <Label>Script path</Label>
            <span className="font-mono text-[9px]" style={{ color: C.faint }}>v3 · published</span>
          </div>
          <svg viewBox="0 0 214 300" className="mt-1 w-full flex-1 overflow-visible">
            {EDGES.map((e) => (
              <path key={e.d} d={e.d} fill="none" stroke={C.borderStrong} strokeWidth="1.5" />
            ))}
            {EDGES.map((e) => {
              const lit = walked.has(`${e.from}>${e.to}`);
              return (
                <motion.path
                  key={`lit-${e.d}`}
                  d={e.d}
                  fill="none"
                  stroke={C.brand}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={false}
                  animate={{ pathLength: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                />
              );
            })}
            {(Object.keys(NODES) as SlideId[]).map((id) => {
              const n = NODES[id];
              const isCurrent = id === current;
              const seen = visited.has(id);
              return (
                <g key={id}>
                  {isCurrent && (
                    <motion.rect
                      x={n.x - n.w / 2 - 3}
                      y={n.y - NODE_H / 2 - 3}
                      width={n.w + 6}
                      height={NODE_H + 6}
                      rx="10"
                      fill="none"
                      stroke={C.brand}
                      strokeWidth="1.5"
                      animate={{ opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                  <rect
                    x={n.x - n.w / 2}
                    y={n.y - NODE_H / 2}
                    width={n.w}
                    height={NODE_H}
                    rx="8"
                    fill={isCurrent ? C.brand : seen ? C.accentSoft : "white"}
                    stroke={isCurrent || seen ? C.brand : C.borderStrong}
                    strokeWidth="1.2"
                    style={{ transition: "fill .3s, stroke .3s" }}
                  />
                  <text
                    x={n.x}
                    y={n.y + 3.5}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fill={isCurrent ? "white" : seen ? C.brand : C.muted}
                    style={{ transition: "fill .3s" }}
                  >
                    {SCRIPT[id].node}
                  </text>
                </g>
              );
            })}
          </svg>
        </Panel>
      </div>
    </div>
  );
}
