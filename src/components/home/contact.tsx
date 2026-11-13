"use client";

import { useState } from "react";
import { motion } from "motion/react";
import SignalField from "./signal-field";
import { EASE, Eyebrow, Magnetic, Reveal, serif, useClock } from "./shared";
import { profile } from "@/data/portfolio";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const time = useClock(profile.timezone, true);

  return (
    <section id="contact" className="px-4 md:px-8">
      <motion.div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#111] px-6 py-16 text-white md:px-16 md:py-24"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {/* The hero's packet grid again, on dark, so the page ends where it began. */}
        <SignalField ink="255,255,255" className="[mask-image:radial-gradient(90%_90%_at_70%_20%,black,transparent)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[#FF6A3D] opacity-40 blur-[100px]" style={{ animation: "d5-blob 12s ease-in-out infinite" }} />
        <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <Eyebrow index="05" dark>Contact</Eyebrow>
            <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
              <Reveal>Got a system</Reveal>
              <Reveal delay={0.1} className={`${serif} text-[#FF6A3D]`}>in mind?</Reveal>
            </h2>
            <p className="mt-5 max-w-md text-white/60">Platforms, realtime features, AI integrations, desktop apps — tell me what you’re building and I’ll reply within a day.</p>
          </div>
          <div className="space-y-3">
            <Magnetic strength={0.12} className="w-full">
              <a href={profile.links.mail} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-2xl bg-white px-5 py-4 font-medium text-[#111] transition-colors hover:bg-[#FF6A3D] hover:text-white">
                Email me <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(profile.email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-[#111]/60 px-5 py-4 text-left text-white/85 backdrop-blur-sm transition-colors hover:bg-white/5"
            >
              <span className="truncate">{copied ? "Copied ✓" : profile.email}</span>
              <span className="text-xs text-white/40">copy</span>
            </button>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[["LinkedIn", profile.links.linkedin], ["GitHub", profile.links.github], ["WhatsApp", profile.links.whatsapp]].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/15 bg-[#111]/60 px-3 py-3 text-center text-white/80 backdrop-blur-sm transition-colors hover:bg-white/5">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <footer className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-2 pt-8 text-xs text-[#8A8A85]">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p className="font-mono tabular-nums">{time ? `${time} in Tunis` : " "}</p>
          <p>Built with Next.js 16, Motion, Lenis and a Rust engine in WebAssembly</p>
          <a href="#top" className="font-medium text-[#55554F] transition-colors hover:text-[#111]">Back to top ↑</a>
        </div>
        {/* Oversized signature, cropped by the bottom of the page */}
        <div aria-hidden className="mt-6 select-none overflow-hidden">
          <motion.p
            className="-mb-[0.19em] whitespace-nowrap bg-gradient-to-b from-[#111]/[0.16] to-[#111]/[0.03] bg-clip-text text-center font-semibold leading-[0.85] tracking-[-0.06em] text-transparent"
            // The name is about 6.5 em wide at this tracking, so this fills the column without spilling.
            style={{ fontSize: "min((100vw - 4rem) / 6.5, 177px)" }}
            initial={{ y: "40%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            {profile.shortName}
          </motion.p>
        </div>
      </footer>
    </section>
  );
}
