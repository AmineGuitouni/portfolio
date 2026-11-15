"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { EASE, Magnetic, serif, usePrefersReducedMotion } from "@/components/home/shared";
import { ACCENT } from "./tokens";

const META: { k: string; v: React.ReactNode }[] = [
  { k: "Role", v: "Lead engineer · cloud, payments, sync" },
  { k: "Timeline", v: "January 2026 — today" },
  { k: "Platforms", v: "Raspberry Pi kiosks · ESP32 readers · Web" },
  {
    k: "Built with",
    v: (
      <a href="https://www.linkedin.com/company/102161617/" target="_blank" rel="noopener noreferrer" className="underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-[#111]">
        Digi Growing ↗
      </a>
    ),
  },
];

function Rise({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={`-mb-[0.14em] block overflow-hidden pb-[0.14em] ${className}`}>
      <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

// Perforations of the drum: rings of holes, each ring offset so they don't line up.
const HOLES = [96, 136, 176, 216].flatMap((r, ring) => {
  const count = Math.round((2 * Math.PI * r) / 34);
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + ring * 0.21;
    // Rounded: server and browser trig can differ in the last digits, which breaks hydration.
    return { x: Math.round((300 + Math.cos(a) * r) * 100) / 100, y: Math.round((300 + Math.sin(a) * r) * 100) / 100, key: `${ring}-${i}` };
  });
});

/** A washer drum seen through its door. It turns as the page scrolls. */
function Drum() {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, (y) => (reduced ? 0 : y * 0.16));

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -right-40 -top-24 hidden size-[620px] md:block lg:-right-24"
      initial={{ opacity: 0, scale: 0.92, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.6, ease: EASE, delay: 0.1 }}
    >
      <svg viewBox="0 0 600 600" className="size-full">
        <defs>
          <radialGradient id="ld-glass" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="55%" stopColor={ACCENT} stopOpacity="0.07" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.16" />
          </radialGradient>
          <radialGradient id="ld-fade-g">
            <stop offset="60%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.25" />
          </radialGradient>
          <mask id="ld-fade">
            <rect width="600" height="600" fill="url(#ld-fade-g)" />
          </mask>
        </defs>
        <g mask="url(#ld-fade)">
          <circle cx="300" cy="300" r="292" fill="none" stroke="#111" strokeOpacity="0.07" strokeWidth="2" />
          <circle cx="300" cy="300" r="262" fill="#FAFAF7" stroke="#111" strokeOpacity="0.1" strokeWidth="14" />
          <circle cx="300" cy="300" r="244" fill="url(#ld-glass)" />
          <motion.g style={{ rotate, transformOrigin: "300px 300px" }}>
            {HOLES.map((h) => (
              <circle key={h.key} cx={h.x} cy={h.y} r="4" fill="#111" fillOpacity="0.09" />
            ))}
            {[0, 120, 240].map((deg) => (
              <rect key={deg} x="288" y="70" width="24" height="64" rx="12" fill={ACCENT} fillOpacity="0.16" transform={`rotate(${deg} 300 300)`} />
            ))}
            <circle cx="300" cy="300" r="40" fill="none" stroke="#111" strokeOpacity="0.08" strokeWidth="2" />
          </motion.g>
          {/* The reflection on the door glass stays still while the drum turns behind it. */}
          <path d="M150 210 A170 170 0 0 1 260 120" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="10" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
      <Drum />
      <div className="pointer-events-none absolute -left-40 top-40 size-[26rem] rounded-full opacity-[0.12] blur-[110px]" style={{ background: ACCENT, animation: "d5-blob 16s ease-in-out infinite" }} />

      <div className="relative mx-auto max-w-6xl">
        <motion.p
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8A85]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span style={{ color: ACCENT }}>Case study</span>
          <span className="h-px w-8 bg-black/15" />
          IoT + SaaS platform
        </motion.p>

        <h1 className="mt-6 text-[clamp(3.6rem,13vw,10.5rem)] font-semibold leading-[0.86] tracking-[-0.06em]">
          <Rise delay={0.05}>Launderer</Rise>
        </h1>
        <p className="mt-6 max-w-4xl text-[clamp(1.6rem,3.6vw,3rem)] font-medium leading-[1.08] tracking-[-0.035em]">
          <Rise delay={0.2}>A chain of laundromats, run from</Rise>
          <Rise delay={0.28}>
            <span className={serif} style={{ color: ACCENT }}>
              the card reader
            </span>{" "}
            to the cloud.
          </Rise>
        </p>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.1fr_1fr] md:items-end">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: EASE }}>
            <p className="max-w-xl text-lg leading-relaxed text-[#55554F]">
              Customers load a card at a touchscreen kiosk and tap it on any washer or dryer. Each store runs on its own small cluster of kiosks, keeps selling when the internet drops, and syncs every cent to a cloud platform where owners run their stores. I designed the cloud, the payment ledger and the sync between them.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.15}>
                <a href="#dollar" className="group inline-flex items-center gap-2 rounded-full bg-[#111] py-2 pl-5 pr-2 text-sm font-medium text-white">
                  Follow a dollar
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-y-0.5">↓</span>
                </a>
              </Magnetic>
              <a href="#resilience" className="text-sm font-medium text-[#55554F] underline decoration-black/20 underline-offset-4 transition-colors hover:text-[#111] hover:decoration-[#111]">
                Or break a store
              </a>
            </div>
          </motion.div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-black/[0.08] pt-6">
            {META.map((m, i) => (
              <motion.div key={m.k} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 + i * 0.06, ease: EASE }}>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#8A8A85]">{m.k}</dt>
                <dd className="mt-1 text-sm font-medium leading-snug">{m.v}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
