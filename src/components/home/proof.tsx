"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { ChessTile } from "./chess/chess-tile";
import { AssistantTile, CountUp, MachinesTile, RealtimeTile, StreamTile } from "./demo-tiles";
import { EASE, SectionHeading, serif } from "./shared";
import ProjectGlyph from "@/components/project-glyph";
import { languages, projects, stats } from "@/data/portfolio";

function Tile({ className = "", title, tag, project, children, delay = 0 }: { className?: string; title: string; tag: string; project?: string; children: React.ReactNode; delay?: number }) {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(255,106,61,0.10), transparent 60%)`;
  const p = projects.find((x) => x.slug === project);
  return (
    <motion.div
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_-24px_rgba(0,0,0,0.18)] ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8A85]">{tag}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{title}</h3>
        </div>
        {p && (p.links[0] ? (
          <a href={p.links[0].href} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full border border-black/10 px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-[#111] hover:text-white">{p.name} ↗</a>
        ) : (
          <span className="shrink-0 rounded-full bg-[#F3F2EE] px-2.5 py-1 text-[11px] font-medium text-[#55554F]">{p.name}</span>
        ))}
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </motion.div>
  );
}

// The two commit counts the project cards already state, read from the same data so they stay in step.
const commitShare = projects.flatMap((project) => {
  const metric = project.metrics.find((m) => m.label.startsWith("commits "));
  return metric ? [{ name: project.name, where: metric.label.replace("commits ", ""), count: parseInt(metric.value, 10), text: metric.value, color: project.accent }] : [];
});
const COMMITS_PER_SQUARE = 10;

/** One square per ten commits, coloured by the repository they went to. */
function CommitGrid({ total }: { total: number }) {
  const squares = Math.round(total / COMMITS_PER_SQUARE);
  const colors = commitShare.flatMap((c) => Array.from({ length: Math.round(c.count / COMMITS_PER_SQUARE) }, () => c.color));
  return (
    <motion.div
      className="grid grid-cols-[repeat(13,1fr)] gap-1 md:grid-cols-[repeat(26,1fr)]"
      role="img"
      aria-label={`${commitShare.map((c) => `${c.text} commits ${c.where} for ${c.name}`).join(", ")}, the rest across other repositories`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: 0.007 }}
    >
      {Array.from({ length: squares }, (_, i) => (
        <motion.span
          key={i}
          className="aspect-square rounded-[3px]"
          style={{ background: colors[i] ?? "#E4E1D9" }}
          variants={{ hidden: { opacity: 0, scale: 0.3 }, shown: { opacity: 1, scale: 1 } }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
        />
      ))}
    </motion.div>
  );
}

export default function Proof() {
  const total = stats[0].value;
  return (
    <section id="proof" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" label="Proof" aside="Every tile below is a tiny, working model of something I’ve built — the same ideas, running live in your browser. The chess engine isn’t a model at all: it’s the real one.">
          Proof, <span className={serif}>not promises.</span>
        </SectionHeading>

        <div className="mt-12 grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-4">
          <Tile className="md:col-span-2 md:row-span-2" tag="Rust · Engine" title="A Rust engine searching 59M positions a second" project="rust-chess-engine">
            <ChessTile />
          </Tile>
          <Tile className="md:col-span-2" tag="Go · Rust · WebRTC" title="Live screen & audio supervision" project="megatel" delay={0.05}>
            <StreamTile />
          </Tile>
          <Tile className="md:col-span-2" tag="Rust · Postgres · WebSockets" title="Support chat with zero polling" project="megashop" delay={0.1}>
            <RealtimeTile />
          </Tile>
          <Tile className="md:col-span-2" tag="LLM · Tool calling" title="An assistant that queries real data" project="launderer">
            <AssistantTile />
          </Tile>
          <Tile tag="Multi-tenant SaaS" title="Machine operations" project="launderer" delay={0.05}>
            <MachinesTile />
          </Tile>
          <Tile tag="PyTorch · U-Net" title="Hardness from a microscope" project="vickers-hardness" delay={0.1}>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-[#14141A]">
              <ProjectGlyph slug="vickers-hardness" color="#B8FF3D" ink="#FAFAF7" className="size-full" />
              <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-[#B8FF3D]">4 corners · HV computed</span>
            </div>
          </Tile>
          <Tile className="md:col-span-2" tag="GitHub" title="Commits that shipped">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-end justify-between gap-4">
                <p className="text-6xl font-semibold tracking-[-0.05em]"><CountUp to={total} suffix={stats[0].suffix} /></p>
                <p className="pb-1.5 font-mono text-[10px] text-[#8A8A85]">1 square = {COMMITS_PER_SQUARE} commits</p>
              </div>
              <CommitGrid total={total} />
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#55554F]">
                {commitShare.map((c) => (
                  <span key={c.name} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-[2px]" style={{ background: c.color }} />
                    {c.name} {c.where} <span className="font-mono text-[#8A8A85]">{c.text}</span>
                  </span>
                ))}
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-[2px] bg-[#E4E1D9]" />
                  Other repositories
                </span>
              </div>
            </div>
          </Tile>
          <Tile className="md:col-span-2" tag="By bytes, across repos" title="What I write" delay={0.1}>
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-end justify-between gap-4">
                <p className="text-6xl font-semibold tracking-[-0.05em]"><CountUp to={stats[2].value} suffix={stats[2].suffix} /></p>
                <p className="pb-1.5 text-right font-mono text-[10px] lowercase text-[#8A8A85]">{stats[2].label}</p>
              </div>
              <div>
                <div className="flex h-4 overflow-hidden rounded-full">
                  {languages.map((l) => (
                    <motion.span key={l.name} style={{ background: l.color }} initial={{ width: 0 }} whileInView={{ width: `${l.share}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {languages.map((l) => (
                    <div key={l.name} className="flex items-center gap-2 text-sm">
                      <span className="size-2.5 rounded-full" style={{ background: l.color }} />
                      <span className="truncate">{l.name}</span>
                      <span className="ml-auto font-mono text-xs text-[#8A8A85]">{l.share}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
}
