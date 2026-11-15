"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { EASE, SectionHeading, serif } from "@/components/home/shared";
import { Canvas } from "../canvas";
import { KioskScreen, STAGE_H, STAGE_W } from "./kiosk";
import { LedgerScreen } from "./ledger";
import { ReaderScreen } from "./reader";
import { SyncScreen } from "./sync-screen";
import { ACCENT } from "./tokens";

const STEPS: {
  id: string;
  label: string;
  title: string;
  body: string;
  tags: string[];
  hint?: string;
  balance: string;
  Screen: React.ComponentType<{ active: boolean }>;
}[] = [
  {
    id: "load",
    label: "At the kiosk",
    title: "Ten dollars in, eleven on the card.",
    body: "The customer picks cash and feeds two bills into the validator, and the store's bonus rule adds a dollar. The touchscreen app drives the bill validator, the card dispenser, the receipt printer and a Stripe card terminal, in English or Spanish.",
    tags: ["Flutter on Raspberry Pi", "Bill validator · dispenser · printer", "Stripe Terminal"],
    balance: "$0.00 → $11.00",
    Screen: KioskScreen,
  },
  {
    id: "ledger",
    label: "On the books",
    title: "Money that always adds up.",
    body: "A balance is never a number someone edits. Every payment is a ledger entry whose lines balance, in cents, with an idempotency key, so a retried request can't charge or credit twice. A card's balance is the sum of its lines. Only the kiosk writes entries; the cloud asks it to.",
    tags: ["Double-entry ledger", "Minor units", "Idempotency keys"],
    hint: "Try it: post the same payment again.",
    balance: "$11.00",
    Screen: LedgerScreen,
  },
  {
    id: "tap",
    label: "At the washer",
    title: "Tap, beep, the drum turns.",
    body: "The ESP32 reader on Washer 3 sends the tap to the kiosk, which charges the card on the ledger. The reader then pays the washer over its RS232 port, as if coins had dropped, and the cycle starts. If its kiosk doesn't answer, the reader tries the next one.",
    tags: ["ESP32 · NFC", "RS232 washer protocol", "Kiosk failover"],
    hint: "Try it: tap the card, then tap again.",
    balance: "$11.00 → $7.50",
    Screen: ReaderScreen,
  },
  {
    id: "sync",
    label: "In the cloud",
    title: "Recorded once, even when sent twice.",
    body: "Triggers queue every change in an outbox, and a worker ships it in batches. The cloud writes a batch in one transaction and remembers each event's ID, so a batch sent again after a lost reply changes nothing. The owner sees the sale seconds later.",
    tags: ["Trigger-fed outbox", "Idempotent ingest", "Multi-tenant cloud"],
    balance: "$7.50 · synced",
    Screen: SyncScreen,
  },
];

/** The sticky stage that follows the active step. Desktop only. */
function Stage({ step }: { step: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useInView(wrap, { margin: "-10% 0px" });
  const current = STEPS[step];
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "start 0.3"] });
  // Padded to 0→1 so the values hold outside the range (see the scroll-range note).
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <div ref={wrap} className="relative w-full [perspective:1600px]">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8A85]">Card ••4821</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current.balance}
            className="rounded-full bg-white px-3 py-1 font-mono text-[12px] font-medium shadow-[0_6px_20px_-10px_rgba(0,0,0,0.3)]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {current.balance}
          </motion.p>
        </AnimatePresence>
      </div>
      <motion.div style={{ rotateX, scale }} className="origin-bottom">
        <Canvas width={STAGE_W} height={STAGE_H}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <current.Screen active={visible} />
            </motion.div>
          </AnimatePresence>
        </Canvas>
      </motion.div>

      <nav aria-label="Steps" className="mt-8 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <a key={s.id} href={`#dollar-${s.id}`} className="group text-left">
            <span className="block h-[3px] overflow-hidden rounded-full bg-black/10">
              <motion.span className="block h-full origin-left rounded-full" style={{ background: ACCENT }} initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
            </span>
            <span className={`mt-2 block text-[11px] font-medium transition-colors ${i === step ? "text-[#111]" : "text-[#8A8A85] group-hover:text-[#55554F]"}`}>{s.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

/** On small screens each step carries its own stage, running while it is on screen. */
function InlineStage({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-15% 0px" });
  const s = STEPS[index];
  return (
    <div ref={ref} className="mt-8">
      <Canvas width={STAGE_W} height={STAGE_H}>
        <s.Screen active={visible} />
      </Canvas>
    </div>
  );
}

export default function Dollar() {
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
    <section id="dollar" className="px-4 pt-24 md:px-8 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          label="Follow a dollar"
          accent={ACCENT}
          aside="Ten dollars of cash, from the bill slot to the owner's dashboard: through a Raspberry Pi, an ESP32, a washer's control board and the cloud."
        >
          One payment, <span className={serif}>four machines,</span> zero double charges.
        </SectionHeading>

        <div className="mt-10 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div>
            {STEPS.map((s, i) => (
              <article
                key={s.id}
                id={`dollar-${s.id}`}
                data-index={i}
                ref={(el) => {
                  blocks.current[i] = el;
                }}
                className="scroll-mt-[20vh] border-t border-black/[0.07] py-12 first:border-t-0 lg:flex lg:min-h-[88vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
              >
                <div className={`transition-opacity duration-500 ${i === step ? "lg:opacity-100" : "lg:opacity-25"}`}>
                  <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8A85]">
                    <span style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span>
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
                  {s.hint && (
                    <p className="mt-4 hidden text-sm font-medium lg:block" style={{ color: ACCENT }}>
                      {s.hint}
                    </p>
                  )}
                </div>
                <div className="lg:hidden">
                  <InlineStage index={i} />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen flex-col justify-center pb-4 pt-24">
              <Stage step={step} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
