"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/home/demo-tiles";
import { EASE, Eyebrow, SectionHeading, serif } from "@/components/home/shared";
import { TechIcon } from "@/components/tech-icons";
import Closing from "../closing";
import { ACCENT } from "./tokens";

const NUMBERS = [
  { value: 420, suffix: "+", label: "of my commits across cloud, kiosk and firmware" },
  { value: 3, suffix: "", label: "tiers: machines, stores, cloud" },
  { value: 45, suffix: "", label: "documented product areas in the cloud" },
  { value: 2, suffix: "", label: "kiosk languages, English and Spanish" },
];

const ROLE: { title: string; text: React.ReactNode }[] = [
  { title: "Cloud platform", text: "Built it on my own (267 of its 268 commits): staff admin, company and store dashboards, the sync API, analytics, both AI assistants and the Rust job worker." },
  { title: "Payments & sync", text: "Designed the double-entry ledger and moved live stores onto it. Wrote the kiosk sync, restoring a store from the cloud, store pause and remote updates: nearly 60% of the kiosk backend's commits." },
  {
    title: "Built with",
    text: (
      <>
        <a href="https://www.linkedin.com/in/chawki-gharsellaoui-9a5574267/" target="_blank" rel="noopener noreferrer" className="font-medium text-[#111] underline decoration-black/20 underline-offset-4 hover:decoration-[#111]">
          Chawki Gharsellaoui
        </a>
        , CEO of{" "}
        <a href="https://www.linkedin.com/company/102161617/" target="_blank" rel="noopener noreferrer" className="font-medium text-[#111] underline decoration-black/20 underline-offset-4 hover:decoration-[#111]">
          Digi Growing
        </a>
        , who built the touchscreen app, the reader firmware and the cash changer.
      </>
    ),
  },
];

const STACK = [
  { app: "Cloud", items: ["Next.js", "TypeScript", "Tailwind CSS", "Drizzle ORM", "Redis"] },
  { app: "Worker", items: ["Rust", "PostgreSQL"] },
  { app: "Kiosk", items: ["Flutter", "Node.js", "Express", "PostgreSQL", "Stripe"] },
  { app: "Machines", items: ["ESP32 · C++", "RS232", "OTA"] },
];

export default function Outro() {
  return (
    <>
      <section id="numbers" className="px-4 pt-24 md:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <SectionHeading index="05" label="By the numbers" accent={ACCENT} aside="Running in real laundromats, with real money. Figures are from the repositories.">
            From the drum <span className={serif}>to the database.</span>
          </SectionHeading>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-black/[0.07] lg:grid-cols-4">
            {NUMBERS.map((n, i) => (
              <motion.div key={n.label} className="bg-white p-6 md:p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}>
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

          <p className="mt-6 text-center text-[13px] text-[#8A8A85]">Launderer is private client work. Every screen on this page is a recreation with made-up stores, cards and amounts.</p>
        </div>
      </section>

      <Closing slug="launderer" accent={ACCENT} />
    </>
  );
}
