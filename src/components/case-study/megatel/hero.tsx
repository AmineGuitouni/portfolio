"use client";

import { motion } from "motion/react";
import SignalField from "@/components/home/signal-field";
import { EASE, Magnetic, serif } from "@/components/home/shared";

const META = [
  { k: "Role", v: "Lead engineer · architecture, desktop, server" },
  { k: "Timeline", v: "June 2024 — today" },
  { k: "Platforms", v: "Web · Windows desktop · Go API" },
  { k: "Client", v: "Multilingual call-center company, Germany" },
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

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
      <SignalField className="[mask-image:radial-gradient(70%_80%_at_80%_10%,black,transparent)]" />
      <div className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-[#FF6A3D] opacity-[0.16] blur-[110px]" style={{ animation: "d5-blob 14s ease-in-out infinite" }} />

      <div className="relative mx-auto max-w-6xl">
        <motion.p
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8A8A85]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="text-[#FF6A3D]">Case study</span>
          <span className="h-px w-8 bg-black/15" />
          Workforce platform
        </motion.p>

        <h1 className="mt-6 text-[clamp(4rem,15vw,11.5rem)] font-semibold leading-[0.86] tracking-[-0.06em]">
          <Rise delay={0.05}>MegaTel</Rise>
        </h1>
        <p className="mt-6 max-w-4xl text-[clamp(1.6rem,3.6vw,3rem)] font-medium leading-[1.08] tracking-[-0.035em]">
          <Rise delay={0.2}>The whole working day of a</Rise>
          <Rise delay={0.28}>
            <span className={`${serif} text-[#FF6A3D]`}>call-center floor,</span> in one platform.
          </Rise>
        </p>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.1fr_1fr] md:items-end">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: EASE }}>
            <p className="max-w-xl text-lg leading-relaxed text-[#55554F]">
              Interviewers clock in, call companies, run branching interview scripts and look up answers, all in one desktop app. Supervisors watch the floor live and run everything else from the web. I designed the system and built most of it.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.15}>
                <a href="#shift" className="group inline-flex items-center gap-2 rounded-full bg-[#111] py-2 pl-5 pr-2 text-sm font-medium text-white">
                  Follow a call
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-y-0.5">↓</span>
                </a>
              </Magnetic>
              <a href="https://mega-tel.de" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#55554F] underline decoration-black/20 underline-offset-4 transition-colors hover:text-[#111] hover:decoration-[#111]">
                mega-tel.de ↗
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
