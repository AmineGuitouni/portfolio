"use client";

import Link from "next/link";
import { Eyebrow, Magnetic, Reveal, serif } from "@/components/home/shared";
import { profile, projects } from "@/data/portfolio";

/** The end of every case study: the next project, a contact card and the footer. */
export default function Closing({ slug, accent = "#FF6A3D" }: { slug: string; accent?: string }) {
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <section className="px-4 pb-10 pt-24 md:px-8 md:pt-36">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-[1.3fr_1fr]">
        <Link
          href={`/#work-${next.slug}`}
          className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[2rem] border border-black/[0.07] bg-white p-7 transition-colors hover:border-black/20 md:p-10"
        >
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full opacity-25 blur-[80px] transition-opacity group-hover:opacity-50" style={{ background: next.accent }} />
          <Eyebrow>Next project</Eyebrow>
          <div className="relative">
            <h2 className="text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
              <Reveal>{next.name}</Reveal>
            </h2>
            <p className="mt-3 max-w-md text-[#55554F]">{next.tagline}</p>
          </div>
          <span className="relative mt-6 inline-flex size-12 items-center justify-center rounded-full bg-[#111] text-white transition-transform duration-300 group-hover:-rotate-45">→</span>
        </Link>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#111] p-7 text-white md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full opacity-40 blur-[90px]" style={{ background: accent, animation: "d5-blob 12s ease-in-out infinite" }} />
          <div className="relative">
            <Eyebrow dark>Contact</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-4xl">
              Need a platform{" "}
              <span className={serif} style={{ color: accent }}>
                like this?
              </span>
            </h2>
          </div>
          <div className="relative mt-8 space-y-3">
            <Magnetic strength={0.12} className="w-full">
              <a
                href={profile.links.mail}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl bg-white px-5 py-4 font-medium text-[#111] transition-colors hover:bg-[var(--accent)] hover:text-white"
                style={{ "--accent": accent } as React.CSSProperties}
              >
                Email me <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <Link href="/#work" className="flex items-center justify-between rounded-2xl border border-white/15 px-5 py-4 text-white/80 transition-colors hover:bg-white/5">
              All work <span>↩</span>
            </Link>
          </div>
        </div>
      </div>
      <footer className="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-between gap-2 px-2 text-xs text-[#8A8A85]">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a href="#top" className="font-medium text-[#55554F] transition-colors hover:text-[#111]">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
