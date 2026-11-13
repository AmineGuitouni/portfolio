"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, motionValue, useTransform, type MotionValue } from "motion/react";
import { EASE, SectionHeading, serif } from "./shared";
import ProjectGlyph from "@/components/project-glyph";
import { TechIcon } from "@/components/tech-icons";
import MegaTelScene from "./work-scenes/megatel-scene";
import MegaShopScene from "./work-scenes/megashop-scene";
import LaundererScene from "./work-scenes/launderer-scene";
import ChessScene from "./work-scenes/chess-scene";
import VickersScene from "./work-scenes/vickers-scene";
import PfeScene from "./work-scenes/pfe-scene";
import { STAGE_H, STAGE_W } from "./work-scenes/stage";
import { moreWork, projects, type Project } from "@/data/portfolio";

// Live, looping recreations of the real product UI. Projects without one fall back to their glyph.
const SCENES: Record<string, React.ComponentType> = {
  megatel: MegaTelScene,
  launderer: LaundererScene,
  megashop: MegaShopScene,
  "rust-chess-engine": ChessScene,
  "vickers-hardness": VickersScene,
  "ai-business-platform": PfeScene,
};

// Where there is room, the cards pile up like a deck as you scroll: each one sticks a little
// lower than the last, so the edges of the cards beneath stay visible. A stuck card cannot
// be scrolled, so this only switches on when the tallest card fits the window whole.
// DECK_TOP, DECK_PEEK and DECK_GAP are mirrored by the `.work-deck` rules in globals.css.
const DECK_QUERY = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";
const DECK_TOP = 92;
const DECK_PEEK = 14;
const DECK_GAP = 24;
const DECK_MARGIN = 20; // breathing room under the lowest card

/**
 * Tracks how far each card has been covered by the one after it (0 = clear, 1 = covered).
 * Returns motion values, so scrolling animates the cards without re-rendering React.
 */
function useDeck(count: number) {
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const cover = useMemo(() => Array.from({ length: count }, () => motionValue(0)), [count]);
  const [stacked, setStacked] = useState(false);
  const [buried, setBuried] = useState<boolean[]>(() => Array(count).fill(false));

  useEffect(() => {
    const query = window.matchMedia(DECK_QUERY);
    let frame = 0;

    const measure = () => {
      frame = 0;
      // Rows are equal height once stacked, so the tallest card's content decides either way.
      const tallest = Math.max(0, ...items.current.map((el) => el?.firstElementChild?.scrollHeight ?? 0));
      const fits = query.matches && window.innerHeight >= DECK_TOP + (count - 1) * DECK_PEEK + tallest + DECK_MARGIN;
      setStacked(fits);
      const rects = items.current.map((el) => el?.getBoundingClientRect());
      const next = rects.map((rect, i) => {
        const following = rects[i + 1];
        if (!fits || !rect || !following) return 0;
        // The next card starts a full card below and ends up just DECK_PEEK lower.
        const travelled = 1 - (following.top - rect.top - DECK_PEEK) / (rect.height + DECK_GAP - DECK_PEEK);
        return Math.min(1, Math.max(0, travelled));
      });
      next.forEach((value, i) => cover[i].set(value));
      setBuried((current) => {
        const now = next.map((value) => value > 0.985);
        return now.every((flag, i) => flag === current[i]) ? current : now;
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    query.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      query.removeEventListener("change", schedule);
    };
  }, [cover, count]);

  return { items, cover, stacked, buried };
}

function Card({ project, index, cover, buried }: { project: Project; index: number; cover: MotionValue<number>; buried: boolean }) {
  const Scene = SCENES[project.slug];
  const scale = useTransform(cover, (v) => 1 - v * 0.045);
  const shade = useTransform(cover, (v) => v * 0.1);
  const [primary, ...secondary] = project.links;

  return (
    <motion.article
      className="relative flex h-full origin-top flex-col overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white shadow-[0_-1px_0_rgba(255,255,255,0.9)_inset,0_30px_60px_-36px_rgba(0,0,0,0.3)]"
      style={{ scale }}
    >
      <header className="flex items-center justify-between gap-4 border-b border-black/[0.06] px-5 py-3.5 md:px-7">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="font-mono text-xs" style={{ color: "#FF6A3D" }}>{String(index + 1).padStart(2, "0")}</span>
          <h3 className="truncate text-xl font-semibold tracking-tight">{project.name}</h3>
        </div>
        <p className="shrink-0 text-right text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8A85]">
          <span className="hidden sm:inline">{project.kind} · </span>
          {project.year}
        </p>
      </header>

      <div className="grid flex-1 gap-x-8 gap-y-6 p-5 md:p-7 xl:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
            {/* A buried card keeps its footprint but stops animating until it is uncovered again. */}
            {buried ? (
              <div style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}`, background: `${project.accent}14` }} />
            ) : Scene ? (
              <Scene />
            ) : (
              <div className="relative" style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}`, background: `${project.accent}14` }}>
                <ProjectGlyph slug={project.slug} color={project.accent} ink="#111111" className="absolute inset-0 size-full" />
              </div>
            )}
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li key={tech} className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F2EE] px-2.5 py-1 text-[11px] text-[#55554F]">
                <TechIcon name={tech} className="size-3" />
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <p className="text-[1.375rem] font-medium leading-snug tracking-tight">{project.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#55554F]">{project.summary}</p>
          <ul className="mt-5 space-y-2 text-[13px] leading-snug text-[#2a2a27]">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2.5">
                <span className="mt-[0.45em] size-1.5 shrink-0 rounded-[1px]" style={{ background: project.accent }} />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <dl className="grid grid-cols-3 gap-3 border-t border-black/[0.06] pt-4">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="sr-only">{metric.label}</dt>
                  <dd className="text-lg font-semibold tracking-tight">{metric.value}</dd>
                  <dd className="mt-0.5 text-[11px] leading-tight text-[#8A8A85]">{metric.label}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              {primary ? (
                <a
                  href={primary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-2 rounded-full bg-[#111] py-1.5 pl-4 pr-1.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
                >
                  {primary.label}
                  <span className="flex size-6 items-center justify-center rounded-full bg-white/15 transition-transform group-hover/link:-rotate-45">→</span>
                </a>
              ) : (
                <span className="rounded-full bg-[#F3F2EE] px-3 py-1.5 text-xs font-medium text-[#55554F]">Private client work</span>
              )}
              {secondary.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#55554F] underline decoration-black/20 underline-offset-4 transition-colors hover:text-[#111] hover:decoration-[#111]">
                  {link.label} ↗
                </a>
              ))}
              <span className="ml-auto text-right text-[11px] text-[#8A8A85]">{project.credits ?? project.role}</span>
            </div>
          </div>
        </div>
      </div>

      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} />
    </motion.article>
  );
}

export default function Work() {
  const { items, cover, stacked, buried } = useDeck(projects.length);

  return (
    <section id="work" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="04" label="Work" aside="Platforms that run real businesses, an award-winning AI product, a chess engine written from scratch and a vision model I trained myself.">
          Selected <span className={serif}>work.</span>
        </SectionHeading>

        <ol className="work-deck relative mt-12" data-stacked={stacked || undefined}>
          {projects.map((project, i) => (
            <motion.li
              key={project.slug}
              ref={(el) => {
                items.current[i] = el;
              }}
              // When the cards are stacked, in-page links aim at the markers below instead,
              // because a stuck card no longer sits where its place in the page is.
              id={stacked ? undefined : `work-${project.slug}`}
              style={{ "--i": i } as React.CSSProperties}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <Card project={project} index={i} cover={cover[i]} buried={buried[i]} />
            </motion.li>
          ))}
          {stacked &&
            projects.map((project, i) => (
              <li
                key={project.slug}
                id={`work-${project.slug}`}
                aria-hidden
                className="pointer-events-none absolute left-0 h-px w-px"
                // Rows are equal height, so card i starts i rows down. Stopping a few pixels
                // short leaves the card stuck in place with the next one still clear of it.
                style={{ top: `calc((100% + ${DECK_GAP}px) * ${i} / ${projects.length} - ${DECK_TOP + i * DECK_PEEK - 8}px)` }}
              />
            ))}
        </ol>

        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          {moreWork.map((w) => (
            <a key={w.name} href={w.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3 transition-colors hover:border-black/20">
              <span className="min-w-0">
                <span className="font-medium">{w.name}</span>
                <span className="ml-2 text-sm text-[#8A8A85]">{w.note}</span>
              </span>
              <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
