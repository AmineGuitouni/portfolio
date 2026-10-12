"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowUpRight, LuChevronDown, LuFileCheck, LuMail, LuMapPin, LuTrophy } from "react-icons/lu";
import { TechIcon } from "@/components/tech-icons";
import { experience, profile, recognition } from "@/data/portfolio";

const EASE = [0.16, 1, 0.3, 1] as const;
const serif = "font-[family-name:var(--d5-serif)] italic font-normal";

/** Letters stay private; this opens a pre-filled email asking for a copy. */
const requestHref = (what: string) =>
  `mailto:${profile.email}?subject=${encodeURIComponent(`Request: ${what}`)}&body=${encodeURIComponent(
    `Hi Amine,\n\nCould you share a copy of the ${what}?\n\nThanks,\n`,
  )}`;

function RequestButton({ what }: { what: string }) {
  return (
    <a
      href={requestHref(what)}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#111] px-3.5 py-2 text-xs font-medium text-white transition-transform hover:scale-[1.03]"
    >
      <LuMail className="size-3.5" /> Request a copy
    </a>
  );
}

function ProjectLink({ slug }: { slug: string }) {
  return (
    <a href={`#work-${slug}`} className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-3.5 py-2 text-xs font-medium transition-colors hover:border-black/30">
      See the project <LuArrowUpRight className="size-3.5" />
    </a>
  );
}

export default function Experience() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen((o) => (o === id ? null : id));

  return (
    <section id="experience" className="scroll-mt-24 px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
            Experience, <span className={serif}>on record.</span>
          </h2>
          <p className="max-w-sm text-[#55554F]">Every role and award below is backed by a signed letter, available on request.</p>
        </div>

        {/* Award */}
        <motion.div
          className="relative mt-12 overflow-hidden rounded-3xl border-2 border-[#E9C46A] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(233,196,106,0.9)] md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-24 -skew-x-12 bg-gradient-to-r from-transparent via-[#FFF3C4] to-transparent opacity-80"
            animate={{ left: ["-15%", "115%"] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#F6D27A,#E2B04A)] text-[#4A3305] shadow-[0_10px_24px_-10px_rgba(226,176,74,0.9)]">
              <LuTrophy className="size-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#A07A1F]">Award · {recognition.date}</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">{recognition.title}</h3>
              <p className="mt-1 text-sm text-[#55554F]">
                {recognition.issuer} — <span className="font-medium text-[#111]">{recognition.project}</span>, {recognition.team}.
              </p>
            </div>
            <button
              onClick={() => toggle("award")}
              aria-expanded={open === "award"}
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-[#FBF1D6] px-3.5 py-2 text-xs font-medium text-[#7A5A12] transition-colors hover:bg-[#F6E6B8] md:self-center"
            >
              <LuFileCheck className="size-3.5" /> Signed certificate
              <LuChevronDown className={`size-3.5 transition-transform duration-300 ${open === "award" ? "rotate-180" : ""}`} />
            </button>
          </div>
          <AnimatePresence initial={false}>
            {open === "award" && (
              <motion.div className="relative overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                <div className="mt-6 border-t border-black/[0.06] pt-5 md:pl-[76px]">
                  <p className={`${serif} text-lg leading-relaxed text-[#2a2a27]`}>“{recognition.summary}”</p>
                  <p className="mt-2 text-xs text-[#8A8A85]">{recognition.signedBy} · original in French</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <RequestButton what="Best PFE award certificate (ISIMA)" />
                    <ProjectLink slug={recognition.projectSlug} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Timeline */}
        <ol className="relative mt-5 overflow-hidden rounded-3xl border border-black/[0.06] bg-white">
          {experience.map((e, i) => {
            const isOpen = open === e.id;
            return (
              <motion.li
                key={e.id}
                className="border-b border-black/[0.06] last:border-b-0"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
              >
                <div className="grid gap-4 p-6 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-start md:gap-6 md:p-8">
                  <div className="flex items-center gap-3 md:block">
                    <span className="relative flex size-2.5 md:mb-3">
                      {i === 0 && <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#FF6A3D] opacity-60" />}
                      <span className={`relative inline-flex size-2.5 rounded-full ${i === 0 ? "bg-[#FF6A3D]" : "bg-[#CFCBC2]"}`} />
                    </span>
                    <p className="text-sm font-medium">{e.period}</p>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {e.role} <span className="text-[#8A8A85]">· {e.company}</span>
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#8A8A85]">
                      <LuMapPin className="size-3" /> {e.location}
                    </p>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#55554F]">{e.work}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {e.stack.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F2EE] px-2.5 py-1 text-[11px] text-[#55554F]">
                          <TechIcon name={s} className="size-3" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(e.id)}
                    aria-expanded={isOpen}
                    className="inline-flex items-center gap-1.5 self-start justify-self-start rounded-full bg-[#E9F7EF] px-3.5 py-2 text-xs font-medium text-[#0F7A4D] transition-colors hover:bg-[#D7F0E2]"
                  >
                    <LuFileCheck className="size-3.5" /> Signed letter
                    <LuChevronDown className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                      <div className="mx-6 mb-6 rounded-2xl bg-[#FAFAF7] p-5 md:mx-8 md:mb-8 md:ml-[206px]">
                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8A85]">Internship certificate — summary</p>
                        <p className={`${serif} mt-2 text-lg leading-relaxed text-[#2a2a27]`}>“{e.letter}”</p>
                        <p className="mt-2 text-xs text-[#8A8A85]">{e.signedBy} · original in French</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <RequestButton what={`${e.company} internship certificate`} />
                          {e.projectSlug && <ProjectLink slug={e.projectSlug} />}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
