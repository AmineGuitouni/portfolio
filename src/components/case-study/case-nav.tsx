"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import { useActiveSection } from "@/components/home/nav";

/** The floating pill nav for a case study: back home, the page's chapters, and reading progress. */
export default function CaseNav({
  name,
  chapters,
  accent = "#FF6A3D",
}: {
  name: string;
  chapters: { id: string; label: string }[];
  accent?: string;
}) {
  const ids = chapters.map((c) => c.id);
  const active = useActiveSection(ids);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="relative flex w-full max-w-3xl items-center justify-between overflow-hidden rounded-full border border-black/5 bg-white/80 p-1.5 pl-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <Link href="/#work" className="group flex items-center gap-2.5 rounded-full pr-3 text-sm font-semibold">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#111] text-white transition-transform group-hover:-translate-x-0.5">←</span>
          <span>{name}</span>
        </Link>
        <div className="hidden items-center gap-1 text-sm md:flex">
          {chapters.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={active === c.id ? "location" : undefined}
              className={`relative rounded-full px-3 py-1.5 transition-colors ${active === c.id ? "text-[#111]" : "text-[#55554F] hover:text-[#111]"}`}
            >
              {active === c.id && <motion.span layoutId="case-nav-active" className="absolute inset-0 rounded-full bg-black/[0.06]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{c.label}</span>
            </a>
          ))}
        </div>
        <Link href="/#contact" className="rounded-full bg-[#111] px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.03]">
          Let’s talk
        </Link>
        <motion.span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left" style={{ scaleX: progress, background: accent }} />
      </nav>
    </header>
  );
}
