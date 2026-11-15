"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowRight, LuCheck, LuCornerDownRight, LuMail, LuRotateCcw, LuSparkles, LuX } from "react-icons/lu";
import { EASE, SectionHeading, serif, usePrefersReducedMotion } from "@/components/home/shared";
import { Canvas, useActiveTime, Watch } from "../canvas";
import { C } from "./tokens";

function Tile({ title, text, className = "", children }: { title: string; text: string; className?: string; children: React.ReactNode }) {
  return (
    <motion.article
      className={`flex flex-col overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="flex-1 bg-[#F6F5F1] p-4 md:p-5">{children}</div>
      <div className="border-t border-black/[0.06] px-5 py-4 md:px-6">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#55554F]">{text}</p>
      </div>
    </motion.article>
  );
}

/* ── Script builder ─────────────────────────────────────────────── */

const BW = 640;
const BH = 250;
const BNODES = [
  { id: "start", x: 20, y: 105, label: "Intro", kind: "Slide" },
  { id: "q1", x: 160, y: 105, label: "Uses a service?", kind: "Choice" },
  { id: "rate", x: 330, y: 35, label: "Rating 1–5", kind: "Scale" },
  { id: "offer", x: 330, y: 175, label: "Free quote", kind: "Choice" },
  { id: "partner", x: 490, y: 105, label: "Find partner", kind: "Lookup" },
];
const BEDGES = [
  "M120 125 C140 125 140 125 160 125",
  "M270 118 C300 118 300 55 330 55",
  "M270 132 C300 132 300 195 330 195",
  "M440 55 C465 55 465 118 490 118",
  "M440 195 C465 195 465 132 490 132",
];

function Builder({ active }: { active: boolean }) {
  const [published, setPublished] = useState(3);
  const draft = published === 3;
  return (
    <div>
      <Canvas width={BW} height={BH} className="rounded-2xl border border-black/[0.06] bg-white bg-[radial-gradient(#e7e3dc_1px,transparent_1px)] [background-size:16px_16px]">
        <svg className="absolute inset-0" width={BW} height={BH}>
          {BEDGES.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke={C.brand}
              strokeWidth="1.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: active ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.12, ease: EASE }}
            />
          ))}
        </svg>
        {BNODES.map((n, i) => (
          <motion.div
            key={n.id}
            className="absolute w-[110px] rounded-xl border bg-white px-3 py-2 shadow-[0_10px_24px_-14px_rgba(67,42,23,0.45)]"
            style={{ left: n.x, top: n.y, borderColor: n.id === "partner" ? C.brand : C.borderStrong }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: C.muted }}>{n.kind}</p>
            <p className="text-[12px] font-bold" style={{ color: C.text }}>{n.label}</p>
          </motion.div>
        ))}
      </Canvas>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
        {[1, 2, 3, 4].map((v) => {
          const state = v === published ? "published" : v > published ? "draft" : "archived";
          return (
            <span
              key={v}
              className="rounded-full border px-2.5 py-1 font-mono transition-colors duration-300"
              style={
                state === "published"
                  ? { borderColor: "#86efac", background: "#ecfdf3", color: "#15803d" }
                  : state === "draft"
                    ? { borderColor: "#fbd5b5", background: "#fff1e6", color: C.brand }
                    : { borderColor: "rgba(0,0,0,0.08)", color: "#8A8A85" }
              }
            >
              v{v} · {state}
            </span>
          );
        })}
        <button
          type="button"
          onClick={() => setPublished(draft ? 4 : 3)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#111] px-3.5 py-1.5 font-medium text-white transition-transform hover:scale-[1.03]"
        >
          {draft ? "Publish v4" : <><LuRotateCcw className="size-3" /> Reset</>}
        </button>
      </div>
    </div>
  );
}

/* ── AI assistant with approval ─────────────────────────────────── */

function Assistant({ active }: { active: boolean }) {
  const [decision, setDecision] = useState<"pending" | "working" | "approved" | "rejected">("pending");
  useEffect(() => {
    if (decision !== "working") return;
    const id = setTimeout(() => setDecision("approved"), 900);
    return () => clearTimeout(id);
  }, [decision]);
  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    transition: { duration: 0.45, delay, ease: EASE },
  });

  return (
    <div className="flex h-full flex-col gap-3 text-[13px]">
      <motion.p {...appear(0.1)} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#111] px-3.5 py-2.5 text-white">
        Who is on the Customer Survey today?
      </motion.p>
      <motion.div {...appear(0.5)} className="max-w-[92%] space-y-2">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-2.5 py-1 font-mono text-[11px] text-[#55554F]">
          <span className="size-1.5 rounded-full bg-green-500" /> list_calendar_events · read, ran on its own
        </p>
        <p className="leading-relaxed text-[#2a2a27]">Four people: Sara K., Jonas K., Lea M. and Tim S. Sara starts first, at 09:00.</p>
      </motion.div>
      <motion.p {...appear(1.1)} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#111] px-3.5 py-2.5 text-white">
        Move Sara&apos;s Friday shift to start at 10:00.
      </motion.p>
      <motion.div {...appear(1.6)} className="max-w-[92%] space-y-2">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#55554F]"><LuSparkles className="size-3.5 text-[#FF6A3D]" /> Found 1 event. This changes data, so it needs your OK:</p>
        <div className="rounded-2xl border border-black/[0.08] bg-white p-3.5">
          <p className="font-mono text-[11px] text-[#8A8A85]">edit_calendar_event</p>
          <p className="mt-1 font-medium">Sara K. · Fri 18 Nov · Customer Survey</p>
          <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-[12px]">
            <span className="text-[#8A8A85]">start</span>
            <span><span className="text-red-500 line-through">09:00</span> <LuArrowRight className="inline size-3 text-[#8A8A85]" /> <span className="font-semibold text-green-700">10:00</span></span>
            <span className="text-[#8A8A85]">end</span>
            <span>15:30 <span className="text-[#8A8A85]">(unchanged)</span></span>
          </div>
          <div className="mt-3 min-h-[34px]">
            <AnimatePresence mode="wait" initial={false}>
              {decision === "pending" || decision === "working" ? (
                <motion.div key="ask" className="flex gap-2" exit={{ opacity: 0 }}>
                  <button type="button" onClick={() => setDecision("working")} className="inline-flex items-center gap-1.5 rounded-full bg-[#111] px-3.5 py-1.5 text-[12px] font-medium text-white transition-transform hover:scale-[1.03]">
                    {decision === "working" ? <motion.span className="size-3 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} /> : <LuCheck className="size-3.5" />}
                    Approve
                  </button>
                  <button type="button" onClick={() => setDecision("rejected")} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-[12px] font-medium text-[#55554F] transition-colors hover:border-black/30">
                    <LuX className="size-3.5" /> Reject
                  </button>
                </motion.div>
              ) : (
                <motion.div key="done" className="flex items-center justify-between" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${decision === "approved" ? "text-green-700" : "text-[#55554F]"}`}>
                    {decision === "approved" ? <><LuCheck className="size-3.5" /> Applied and logged</> : <><LuX className="size-3.5" /> Cancelled, nothing changed</>}
                  </span>
                  <button type="button" onClick={() => setDecision("pending")} aria-label="Reset" className="text-[#8A8A85] transition-colors hover:text-[#111]">
                    <LuRotateCcw className="size-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      <motion.p {...appear(2)} className="mt-auto pt-2 text-[12px] text-[#8A8A85]">Try it: approve or reject the change.</motion.p>
    </div>
  );
}

/* ── Mail ───────────────────────────────────────────────────────── */

const DELIVERY = ["Sent", "Delivered", "Opened"];

function Mail({ active }: { active: boolean }) {
  const t = useActiveTime(active, 6, 9);
  const stage = t < 1.2 ? 0 : t < 2.4 ? 1 : 2;
  const replied = t >= 3.6;
  const routed = t >= 4.8;
  return (
    <div className="space-y-2.5 text-[12.5px]">
      <div className="rounded-2xl border border-black/[0.07] bg-white p-3.5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 font-medium"><LuMail className="size-3.5 text-[#FF6A3D]" /> Your visit on Thursday, 10:00</p>
          <span className="text-[11px] text-[#8A8A85]">to M. Keller</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          {DELIVERY.map((d, i) => (
            <span
              key={d}
              className="rounded-full px-2 py-0.5 font-mono text-[10.5px] transition-colors duration-300"
              style={i <= stage ? { background: i === 2 ? "#ecfdf3" : "#fff1e6", color: i === 2 ? "#15803d" : C.brand } : { background: "#F3F2EE", color: "#A5A5A0" }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {replied && (
          <motion.div className="rounded-2xl border border-black/[0.07] bg-white p-3.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <p className="font-medium">Re: Your visit on Thursday</p>
            <p className="text-[#55554F]">Perfect, see you then!</p>
            <AnimatePresence>
              {routed && (
                <motion.p className="mt-2 flex items-center gap-1.5 text-[11.5px] font-medium text-green-700" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  <LuCornerDownRight className="size-3.5" /> Filed under case 4821 · Bäckerei Sonnenschein
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Languages ──────────────────────────────────────────────────── */

const LANGS = {
  DE: { dir: "ltr", start: "Arbeit starten", nav: ["Kalender", "Chat", "Dokumente"], hello: "Guten Morgen, Sara" },
  EN: { dir: "ltr", start: "Start working", nav: ["Calendar", "Chat", "Documents"], hello: "Good morning, Sara" },
  FR: { dir: "ltr", start: "Commencer", nav: ["Calendrier", "Discussion", "Documents"], hello: "Bonjour, Sara" },
  AR: { dir: "rtl", start: "بدء العمل", nav: ["التقويم", "الدردشة", "المستندات"], hello: "صباح الخير، سارة" },
} as const;
type Lang = keyof typeof LANGS;
const ORDER: Lang[] = ["DE", "EN", "FR", "AR"];

function Languages({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [lang, setLang] = useState<Lang>("DE");
  const [picked, setPicked] = useState(false);
  useEffect(() => {
    if (!active || picked || reduced) return;
    const id = setInterval(() => setLang((l) => ORDER[(ORDER.indexOf(l) + 1) % ORDER.length]), 2000);
    return () => clearInterval(id);
  }, [active, picked, reduced]);
  const L = LANGS[lang];

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex rounded-full bg-black/[0.05] p-1 text-[12px] font-medium">
        {ORDER.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setPicked(true);
              setLang(l);
            }}
            className={`relative flex-1 rounded-full py-1.5 transition-colors ${lang === l ? "text-white" : "text-[#55554F] hover:text-[#111]"}`}
          >
            {lang === l && <motion.span layoutId="mt-lang" className="absolute inset-0 rounded-full bg-[#111]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="relative">{l}</span>
          </button>
        ))}
      </div>
      <div dir={L.dir} className="flex flex-1 overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
        <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-[38%] space-y-1 border-black/[0.06] bg-[#fcfaf8] p-2.5 ltr:border-r rtl:border-l">
          {L.nav.map((n, i) => (
            <p key={n} className="truncate rounded-lg px-2 py-1.5 text-[12px]" style={i === 0 ? { background: C.accentSoft, color: C.brand, fontWeight: 600 } : { color: "#55554F" }}>
              {n}
            </p>
          ))}
        </motion.div>
        <div className="flex flex-1 flex-col justify-between p-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={lang} className="text-[14px] font-semibold" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              {L.hello}
            </motion.p>
          </AnimatePresence>
          <span className="mt-3 rounded-xl py-2 text-center text-[12px] font-semibold text-white" style={{ background: C.action }}>{L.start}</span>
        </div>
      </div>
    </div>
  );
}

/** Tells its child whether it has been seen yet and whether it is on screen right now. */
export default function Admin() {
  return (
    <section id="admin" className="px-4 pt-24 md:px-8 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          label="The other side of the desk"
          aside="The web platform is where the floor is run: projects, scripts, people, schedules, calls, mail, invoices and performance. Four pieces of it, working."
        >
          Running the floor <span className={serif}>from a browser.</span>
        </SectionHeading>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <Tile
            className="lg:col-span-2"
            title="Script builder"
            text="Interviews are drawn as a graph, with branching, scales, partner lookups and pinned knowledge. Published versions are frozen, so interviews in progress stay on the version they started with."
          >
            <Watch>{({ seen }) => <Builder active={seen} />}</Watch>
          </Tile>
          <Tile
            className="lg:row-span-2"
            title="An AI assistant that asks first"
            text="It works through 38 tools over schedules, people, projects and documents. Reading runs freely; anything that writes waits for a person to approve it."
          >
            <Watch className="h-full">{({ seen }) => <Assistant active={seen} />}</Watch>
          </Tile>
          <Tile title="Tracked mail" text="Personal and team mailboxes with delivery tracking. Replies are filed under the right case on their own.">
            <Watch>{({ visible }) => <Mail active={visible} />}</Watch>
          </Tile>
          <Tile title="Four languages, one layout" text="German first, plus English, French and Arabic, which flips the interface to right-to-left. The desktop app ships in five languages.">
            <Watch className="h-full">{({ visible }) => <Languages active={visible} />}</Watch>
          </Tile>
        </div>
      </div>
    </section>
  );
}
