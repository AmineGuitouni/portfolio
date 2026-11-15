"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useScroll, useTransform } from "motion/react";
import { LuCheck, LuCoffee, LuPhone, LuX } from "react-icons/lu";
import { EASE, SectionHeading, serif } from "@/components/home/shared";
import { Canvas } from "../canvas";
import { AppWindow, WIN_H, WIN_W, type TabId } from "./app-window";
import { CallScreen, ClockScreen, QueueScreen } from "./screens";
import { InterviewScreen } from "./interview";
import { WissenScreen } from "./wissen";
import { ACCENT, C } from "./tokens";

type ScreenProps = { active: boolean; keyboard?: boolean };

const STEPS: {
  id: string;
  time: string;
  label: string;
  title: string;
  body: string;
  tags: string[];
  tab: TabId;
  window: string;
  Screen: React.ComponentType<ScreenProps>;
}[] = [
  {
    id: "clock-in",
    time: "08:58",
    label: "Clock in",
    title: "The shift starts with one button.",
    body: "Workers clock in to the project on their schedule. The timer runs in Rust, so it keeps going when the window is closed, and global shortcuts start or pause it from any app. A floating bubble keeps the time on top of every window. Drag it around: it snaps to the nearest edge.",
    tags: ["Rust timer runtime", "Global shortcuts", "Always-on-top overlay"],
    tab: "timer",
    window: "Timer",
    Screen: ClockScreen,
  },
  {
    id: "next-contact",
    time: "09:02",
    label: "Next contact",
    title: "No two people dial the same number.",
    body: "One click reserves the next company in the queue for this worker alone. While dozens of colleagues pull from the same pool, the database hands each contact to exactly one person. If nobody finishes it, the reservation runs out and the contact goes back into the pool.",
    tags: ["Postgres row leases", "Retry stages", "Callbacks"],
    tab: "tracking",
    window: "Tracking",
    Screen: QueueScreen,
  },
  {
    id: "call",
    time: "09:03",
    label: "The call",
    title: "A phone built into the app.",
    body: "The SIP softphone is written from scratch in Rust: registration, G.711 audio over RTP, hold, keypad tones. Every call is recorded in stereo, the worker on one channel and the customer on the other. Recordings go to an outbox on disk before uploading, so a crash never loses one.",
    tags: ["SIP + RTP in Rust", "WASAPI audio", "Crash-safe uploads"],
    tab: "phone",
    window: "Phone",
    Screen: CallScreen,
  },
  {
    id: "interview",
    time: "09:04",
    label: "The interview",
    title: "Scripts that branch on every answer.",
    body: "Admins draw interviews as a graph; workers walk through them with the keyboard. Published scripts are versioned, so editing one never changes an interview already in progress. An interview can be paused and picked up later at the same question.",
    tags: ["Graph-based scripts", "Versioning", "Follow-ups"],
    tab: "runner",
    window: "Interview",
    Screen: InterviewScreen,
  },
  {
    id: "knowledge",
    time: "09:06",
    label: "A hard question",
    title: "The answer, mid-call, without guessing.",
    body: "Ctrl+K searches the knowledge base: German full text that forgives typos, blended with embeddings. Every entry separates what to say from what not to promise. The AI answers only from those entries and cites them. If they don't cover the question, it says so.",
    tags: ["Hybrid search", "Rerank", "Cited answers"],
    tab: "wissen",
    window: "Wissen",
    Screen: WissenScreen,
  },
];

/** The floating timer bubble: draggable, snaps to the nearer side, opens a small radial menu. */
function OverlayBubble({ bounds }: { bounds: React.RefObject<HTMLDivElement | null> }) {
  const self = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [side, setSide] = useState<"left" | "right">("right");
  const [open, setOpen] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const moved = useRef(false);
  const [secs, setSecs] = useState(0);
  const inView = useInView(self);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [inView]);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 1200);
    return () => clearTimeout(id);
  }, [flash]);

  const snap = () => {
    const box = bounds.current?.getBoundingClientRect();
    const me = self.current?.getBoundingClientRect();
    if (!box || !me) return;
    const toLeft = me.left + me.width / 2 < box.left + box.width / 2;
    const target = toLeft ? box.left + 8 : box.right - 8 - me.width;
    setSide(toLeft ? "left" : "right");
    animate(x, x.get() + (target - me.left), { type: "spring", stiffness: 380, damping: 30 });
  };

  const menu = [
    { Icon: LuPhone, label: "Call", color: C.green },
    { Icon: LuCheck, label: "Successful", color: C.brand },
    { Icon: LuCoffee, label: "Break", color: C.amber },
    { Icon: LuX, label: "Close", color: C.muted },
  ];
  const time = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <motion.div
      ref={self}
      className="absolute right-[-44px] top-[50%] z-20 touch-none"
      style={{ x, y }}
      drag
      dragMomentum={false}
      dragConstraints={bounds}
      dragElastic={0.08}
      onDragStart={() => {
        moved.current = true;
        setOpen(false);
        setDragged(true);
      }}
      onDragEnd={snap}
    >
      <AnimatePresence>
        {open &&
          menu.map((item, i) => {
            const angle = ((side === "right" ? 180 : 0) + (i - 1.5) * 38) * (Math.PI / 180);
            return (
              <motion.button
                key={item.label}
                type="button"
                aria-label={item.label}
                className="absolute left-[11px] top-[11px] flex size-9 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)]"
                style={{ color: item.color }}
                initial={{ x: 0, y: 0, scale: 0.3, opacity: 0 }}
                animate={{ x: Math.cos(angle) * 66, y: Math.sin(angle) * 66, scale: 1, opacity: 1 }}
                exit={{ x: 0, y: 0, scale: 0.3, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 26, delay: i * 0.03 }}
                onClick={() => {
                  setFlash(item.label);
                  setOpen(false);
                }}
              >
                <item.Icon className="size-4" />
              </motion.button>
            );
          })}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Timer bubble: click for actions, drag to move"
        className="relative flex size-[58px] cursor-grab items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-600 text-white shadow-[0_14px_30px_-8px_rgba(5,80,50,0.55)] active:cursor-grabbing"
        onPointerDown={() => {
          moved.current = false;
        }}
        onClick={() => {
          if (!moved.current) setOpen((o) => !o);
        }}
      >
        <span className="absolute inset-0 animate-ping rounded-full border border-emerald-400 opacity-30 [animation-duration:2.4s]" />
        <span className="font-mono text-[12px] font-bold tabular-nums">{time}</span>
      </button>

      <AnimatePresence>
        {(flash || !dragged) && (
          <motion.span
            key={flash ?? "hint"}
            className={`pointer-events-none absolute bottom-full mb-2 whitespace-nowrap rounded-full bg-[#111] px-2.5 py-1 text-[11px] font-medium text-white ${side === "right" ? "right-0" : "left-0"}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: flash ? 0 : 0.8 }}
          >
            {flash ? `${flash} ✓` : "Drag me, or click"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** The sticky app window that follows the active step. Desktop only. */
function Device({ step }: { step: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const bounds = useRef<HTMLDivElement>(null);
  const visible = useInView(wrap, { margin: "-10% 0px" });
  const current = STEPS[step];
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "start 0.3"] });
  // Padded to 0→1 so the values hold outside the range (see the scroll-range note).
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <div ref={wrap} className="relative w-full [perspective:1600px]">
      <div ref={bounds} aria-hidden className="pointer-events-none absolute -inset-x-12 -bottom-4 -top-6" />
      <motion.div style={{ rotateX, scale }} className="origin-bottom">
        <Canvas width={WIN_W} height={WIN_H}>
          <AppWindow tab={current.tab} title={current.window}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <current.Screen active={visible} keyboard />
              </motion.div>
            </AnimatePresence>
          </AppWindow>
        </Canvas>
      </motion.div>
      <OverlayBubble bounds={bounds} />

      <nav aria-label="Shift steps" className="mt-8 grid grid-cols-5 gap-2">
        {STEPS.map((s, i) => (
          <a key={s.id} href={`#step-${s.id}`} className="group text-left">
            <span className="block h-[3px] overflow-hidden rounded-full bg-black/10">
              <motion.span
                className="block h-full origin-left rounded-full"
                style={{ background: ACCENT }}
                initial={false}
                animate={{ scaleX: i <= step ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </span>
            <span className={`mt-2 block text-[11px] font-medium transition-colors ${i === step ? "text-[#111]" : "text-[#8A8A85] group-hover:text-[#55554F]"}`}>
              {s.label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}

/** On small screens each step carries its own copy of the window, running while it is on screen. */
function InlineDevice({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-15% 0px" });
  const s = STEPS[index];
  return (
    <div ref={ref} className="mt-8">
      <Canvas width={WIN_W} height={WIN_H}>
        <AppWindow tab={s.tab} title={s.window}>
          <div className="absolute inset-0">
            <s.Screen active={visible} />
          </div>
        </AppWindow>
      </Canvas>
    </div>
  );
}

export default function Shift() {
  const [step, setStep] = useState(0);
  const blocks = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setStep(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    blocks.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="shift" className="px-4 pt-24 md:px-8 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          label="A shift, start to finish"
          aside="Interviewers spend their whole day in the desktop app. Follow one call through it, from clocking in to answering a question the script didn't cover."
        >
          One call, <span className={serif}>five tools,</span> no tab switching.
        </SectionHeading>

        <div className="mt-10 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14">
          <div>
            {STEPS.map((s, i) => (
              <article
                key={s.id}
                id={`step-${s.id}`}
                data-index={i}
                ref={(el) => {
                  blocks.current[i] = el;
                }}
                className="scroll-mt-[20vh] border-t border-black/[0.07] py-12 first:border-t-0 lg:flex lg:min-h-[88vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
              >
                <div className={`transition-opacity duration-500 ${i === step ? "lg:opacity-100" : "lg:opacity-25"}`}>
                  <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8A85]">
                    <span className="text-[#FF6A3D]">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s.time}</span>
                    <span className="h-px w-6 bg-black/15" />
                    <span>{s.label}</span>
                  </p>
                  <h3 className="mt-4 text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[2.1rem]">{s.title}</h3>
                  <p className="mt-4 leading-relaxed text-[#55554F]">{s.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {s.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-black/[0.08] bg-white px-2.5 py-1 font-mono text-[10.5px] text-[#55554F]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  {s.id === "interview" && <p className="mt-4 hidden text-sm font-medium text-[#FF6A3D] lg:block">Try it: click an answer, or press 1–3.</p>}
                </div>
                <div className="lg:hidden">
                  <InlineDevice index={i} />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen flex-col justify-center pb-4 pt-24">
              <Device step={step} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
