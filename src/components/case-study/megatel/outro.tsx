"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/home/demo-tiles";
import { EASE, Eyebrow, SectionHeading, serif } from "@/components/home/shared";
import { TechIcon } from "@/components/tech-icons";
import Closing from "../closing";

const NUMBERS = [
  { value: 846, suffix: "", label: "commits since June 2024" },
  { value: 230, suffix: "k+", label: "lines of TypeScript, Rust, Go and SQL" },
  { value: 3, suffix: "", label: "apps sharing one database" },
  { value: 6, suffix: "", label: "interface languages, including Arabic" },
];

const ROLE = [
  { title: "Architecture", text: "Designed the system: three apps around one Supabase database, and where each responsibility lives." },
  { title: "Desktop app & Go server", text: "Built both on my own: the Rust softphone, capture and streaming, the timer runtime, and every API and media route." },
  { title: "Web platform", text: "Led it with four other developers and wrote about 60% of its commits: interviews, knowledge, mail, calls, AI." },
];

const STACK = [
  { app: "Web", items: ["Next.js", "TypeScript", "React", "Framer Motion"] },
  { app: "Desktop", items: ["Tauri 2", "Rust", "React", "Vite"] },
  { app: "Server", items: ["Go", "WebRTC", "HLS"] },
  { app: "Data & AI", items: ["Supabase", "PostgreSQL", "LLM APIs", "LangChain"] },
];

export default function Outro() {
  return (
    <>
      <section id="numbers" className="px-4 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <SectionHeading index="05" label="By the numbers" aside="A real system in daily use, not a weekend demo. Figures are from the three repositories.">
            Built, shipped, <span className={serif}>still growing.</span>
          </SectionHeading>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-black/[0.07] lg:grid-cols-4">
            {NUMBERS.map((n, i) => (
              <motion.div
                key={n.label}
                className="bg-white p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              >
                <dt className="sr-only">{n.label}</dt>
                <dd className="text-5xl font-semibold tracking-[-0.05em] md:text-6xl">
                  <CountUp to={n.value} suffix={n.suffix} />
                </dd>
                <dd className="mt-2 text-sm text-[#55554F]">{n.label}</dd>
              </motion.div>
            ))}
          </dl>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[1.75rem] border border-black/[0.07] bg-white p-6 md:p-8">
              <Eyebrow>My part</Eyebrow>
              <ul className="mt-6 space-y-5">
                {ROLE.map((r, i) => (
                  <motion.li
                    key={r.title}
                    className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-6"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  >
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm leading-relaxed text-[#55554F]">{r.text}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.75rem] border border-black/[0.07] bg-white p-6 md:p-8">
              <Eyebrow>Stack</Eyebrow>
              <div className="mt-6 space-y-4">
                {STACK.map((group) => (
                  <div key={group.app}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A85]">{group.app}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F2EE] px-2.5 py-1 text-[12px] text-[#55554F]">
                          <TechIcon name={item} className="size-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-[#8A8A85]">
            MegaTel is private client work. Every screen on this page is a recreation with made-up names and data.
          </p>
        </div>
      </section>

      <Closing slug="megatel" />
    </>
  );
}
