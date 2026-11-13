"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

const LINKS = [
  { id: "proof", label: "Proof" },
  { id: "toolbox", label: "Toolbox" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
];

/** The section currently crossing the middle of the viewport, if any. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((current) => (current === entry.target.id ? null : current));
        }
      },
      { rootMargin: "-45% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const IDS = LINKS.map((link) => link.id);

export default function Nav() {
  const active = useActiveSection(IDS);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="relative flex w-full max-w-3xl items-center justify-between overflow-hidden rounded-full border border-black/5 bg-white/80 p-1.5 pl-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <a href="#top" className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#111] text-[11px] text-white">AG</span>
          <span className="hidden sm:inline">Amine Guitouni</span>
        </a>
        <div className="hidden items-center gap-1 text-sm md:flex">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? "location" : undefined}
              className={`relative rounded-full px-3 py-1.5 transition-colors ${active === link.id ? "text-[#111]" : "text-[#55554F] hover:text-[#111]"}`}
            >
              {active === link.id && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-black/[0.06]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className="relative">{link.label}</span>
            </a>
          ))}
        </div>
        <a href="#contact" className="rounded-full bg-[#111] px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.03]">Let’s talk</a>
        {/* Reading progress, drawn along the bottom edge of the bar. */}
        <motion.span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#FF6A3D]" style={{ scaleX: progress }} />
      </nav>
    </header>
  );
}
