"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from "motion/react";
import { Fraunces } from "next/font/google";
import { AssistantTile, ChessTile, CountUp, MachinesTile, RealtimeTile, StreamTile } from "./demo-tiles";
import ProjectGlyph from "@/components/project-glyph";
import MegaTelScene from "./work-scenes/megatel-scene";
import MegaShopScene from "./work-scenes/megashop-scene";
import LaundererScene from "./work-scenes/launderer-scene";
import ChessScene from "./work-scenes/chess-scene";
import VickersScene from "./work-scenes/vickers-scene";
import PfeScene from "./work-scenes/pfe-scene";
import Experience from "./experience";
import { TechIcon, marqueeIcons } from "@/components/tech-icons";
import { LuTrophy } from "react-icons/lu";
import { languages, moreWork, profile, projects, recognition, stack, stats } from "@/data/portfolio";

const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "opsz"], variable: "--d5-serif" });

const EASE = [0.16, 1, 0.3, 1] as const;
const serif = "font-[family-name:var(--d5-serif)] italic font-normal";

export default function Home() {
  return (
    <div
      className={`${fraunces.variable} min-h-screen bg-[#FAFAF7] text-[#111111] antialiased selection:bg-[#FF6A3D] selection:text-white`}
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes d5-blob { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-40px) scale(1.08); } 66% { transform: translate(-25px,20px) scale(0.95); } }
        @keyframes d5-marquee { to { transform: translateX(-50%); } }
        @keyframes d5-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
      <Nav />
      <Hero />
      <LogoMarquee />
      <Bento />
      <Toolbox />
      <Experience />
      <AllWork />
      <Contact />
    </div>
  );
}

/* ───────────────────────── nav ───────────────────────── */

function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-3xl items-center justify-between rounded-full border border-black/5 bg-white/80 p-1.5 pl-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <a href="#top" className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#111] text-[11px] text-white">AG</span>
          <span className="hidden sm:inline">Amine Guitouni</span>
        </a>
        <div className="hidden items-center gap-1 text-sm text-[#55554F] md:flex">
          {[["Proof", "#proof"], ["Toolbox", "#toolbox"], ["Experience", "#experience"], ["Work", "#work"]].map(([l, h]) => (
            <a key={l} href={h} className="rounded-full px-3 py-1.5 transition-colors hover:bg-black/5 hover:text-[#111]">{l}</a>
          ))}
        </div>
        <a href="#contact" className="rounded-full bg-[#111] px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.03]">Let’s talk</a>
      </nav>
    </header>
  );
}

/* ───────────────────────── hero ───────────────────────── */

const WORDS = ["ships", "scales", "streams", "thinks"];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.1em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={WORDS[i]}
          className={`${serif} inline-block text-[#FF6A3D]`}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {WORDS[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-16 pt-32 md:px-8 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#11111114_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
      <div className="pointer-events-none absolute -right-20 top-10 size-[480px] rounded-full bg-[#FFB199] opacity-50 blur-[90px]" style={{ animation: "d5-blob 14s ease-in-out infinite" }} />
      <div className="pointer-events-none absolute -left-32 top-60 size-[420px] rounded-full bg-[#9DB8FF] opacity-40 blur-[90px]" style={{ animation: "d5-blob 18s ease-in-out infinite reverse" }} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-sm backdrop-blur"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#00B37E] opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-[#00B37E]" />
            </span>
            Available for new projects
            <span className="text-[#8A8A85]">→</span>
          </motion.a>
          <motion.a
            href="#experience"
            className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-[#E9C46A] bg-[#FBF1D6] px-3 py-1.5 text-sm font-medium text-[#7A5A12]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <LuTrophy className="size-3.5" />
            Best PFE {recognition.date.split(" ")[1]} · ISIMA
          </motion.a>
          </div>
          <motion.h1
            className="mt-6 text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          >
            Software that <br />
            <RotatingWord />
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-lg leading-relaxed text-[#55554F]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          >
            I’m <span className="font-medium text-[#111]">Amine Guitouni</span>, a full-stack & systems engineer. I build platforms end to end — React interfaces, Go and Rust services, PostgreSQL data and AI that does real work.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-3" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}>
            <a href="#proof" className="rounded-full bg-[#111] px-6 py-3 font-medium text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.03]">See it running ↓</a>
            <a href={profile.links.cv} target="_blank" rel="noopener noreferrer" className="rounded-full border border-black/10 bg-white px-6 py-3 font-medium transition-colors hover:border-black/30">Résumé ↗</a>
          </motion.div>
          <div className="mt-10 flex gap-8">
            {stats.slice(0, 3).map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-semibold tracking-tight"><CountUp to={s.value} suffix={s.suffix} /></p>
                <p className="mt-1 max-w-[12ch] text-xs leading-tight text-[#8A8A85]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div className="relative mx-auto w-full max-w-sm" initial={{ opacity: 0, scale: 0.92, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.2 }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-black/5 bg-[#E9E6DF] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]">
            <Image src={profile.photo} alt={profile.name} fill priority sizes="(min-width: 1024px) 380px, 90vw" className="object-cover" />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/85 p-3 backdrop-blur-md">
              <p className="text-sm font-semibold">{profile.name}</p>
              <p className="text-xs text-[#55554F]">{profile.role} · {profile.location}</p>
            </div>
          </div>
          {[
            { name: "Next.js", cls: "-left-8 top-10", d: 0 },
            { name: "Rust", cls: "-right-6 top-24", d: 0.6 },
            { name: "Go", cls: "-left-6 bottom-28", d: 1.2 },
            { name: "PostgreSQL", cls: "-right-10 bottom-36", d: 1.8 },
          ].map((c) => (
            <div key={c.name} className={`absolute ${c.cls} flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-2 text-sm font-medium shadow-[0_10px_30px_-12px_rgba(0,0,0,0.3)]`} style={{ animation: `d5-float 4s ease-in-out ${c.d}s infinite` }}>
              <TechIcon name={c.name} className="size-4" />
              {c.name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LogoMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-black/5 bg-white py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max" style={{ animation: "d5-marquee 40s linear infinite" }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-12 pr-12">
            {marqueeIcons.map(({ name, Icon }) => (
              <span key={name + k} className="flex items-center gap-2 text-[#8A8A85] transition-colors hover:text-[#111]">
                <Icon className="size-6" />
                <span className="text-sm font-medium">{name}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── bento ───────────────────────── */

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

function Bento() {
  return (
    <section id="proof" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
            Proof, <span className={serif}>not promises.</span>
          </h2>
          <p className="max-w-sm text-[#55554F]">Every tile below is a tiny, working model of something I’ve built — the same ideas, running live in your browser.</p>
        </div>

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
            <div className="flex h-full flex-col justify-between">
              <p className="text-6xl font-semibold tracking-[-0.05em]"><CountUp to={stats[0].value} suffix="+" /></p>
              <div className="mt-4 grid grid-cols-[repeat(14,1fr)] gap-1 md:grid-cols-[repeat(28,1fr)]">
                {Array.from({ length: 112 }).map((_, i) => {
                  const v = ((i * 7919) % 13) / 12;
                  return <span key={i} className="aspect-square rounded-[3px]" style={{ background: v > 0.75 ? "#FF6A3D" : v > 0.45 ? "#FFB199" : v > 0.2 ? "#FFE1D6" : "#F3F2EE" }} />;
                })}
              </div>
            </div>
          </Tile>
          <Tile className="md:col-span-2" tag="By bytes, across repos" title="What I write" delay={0.1}>
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
          </Tile>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── toolbox ───────────────────────── */

function Toolbox() {
  const [tab, setTab] = useState(stack[0].id);
  const group = stack.find((g) => g.id === tab)!;
  return (
    <section id="toolbox" className="border-t border-black/5 bg-white px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
          The toolbox, <span className={serif}>by layer.</span>
        </h2>
        <div className="mt-10 flex flex-wrap gap-1 rounded-full border border-black/5 bg-[#F3F2EE] p-1 md:w-fit">
          {stack.map((g) => (
            <button key={g.id} onClick={() => setTab(g.id)} className="relative rounded-full px-4 py-2 text-sm font-medium">
              {tab === g.id && <motion.span layoutId="d5-tab" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className={`relative ${tab === g.id ? "text-[#111]" : "text-[#8A8A85]"}`}>{g.title}</span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-[#55554F]">{group.caption}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {group.items.map((t, i) => (
              <motion.div
                key={group.id + t.name}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                className="group rounded-2xl border border-black/[0.06] bg-[#FAFAF7] p-4 transition-colors hover:border-black/15 hover:bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:-rotate-6 group-hover:scale-110">
                    <TechIcon name={t.name} className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-[#8A8A85]">{t.note}</p>
                  </div>
                </div>
                {t.usedIn.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {t.usedIn.map((u) => (
                    <span key={u} className="rounded-full bg-white px-2 py-0.5 text-[11px] text-[#55554F] ring-1 ring-black/5">{u}</span>
                  ))}
                </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── all work ───────────────────────── */

// Live, looping recreations of the real product UI. Projects without one fall back to their glyph.
const SCENES: Record<string, React.ComponentType> = {
  megatel: MegaTelScene,
  launderer: LaundererScene,
  megashop: MegaShopScene,
  "rust-chess-engine": ChessScene,
  "vickers-hardness": VickersScene,
  "ai-business-platform": PfeScene,
};

function WorkCard({ i }: { i: number }) {
  const p = projects[i];
  const Scene = SCENES[p.slug];
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  return (
    <motion.div
      ref={ref}
      id={`work-${p.slug}`}
      className="group relative scroll-mt-24 overflow-hidden rounded-3xl border border-black/[0.06] bg-white"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (i % 2) * 0.08 }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 4);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 4);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {Scene ? (
        <div className="border-b border-black/[0.06]">
          <Scene />
        </div>
      ) : (
        <div className="relative aspect-[16/10] overflow-hidden" style={{ background: `${p.accent}14` }}>
          <ProjectGlyph slug={p.slug} color={p.accent} ink="#111111" className="absolute inset-0 size-full transition-transform duration-700 group-hover:scale-110" />
        </div>
      )}
      <div className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8A85]">{p.kind} · {p.year}</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight">{p.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#55554F]">{p.tagline}</p>
        {p.credits && <p className="mt-1 text-xs text-[#8A8A85]">{p.credits}</p>}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-3">
            {p.metrics.slice(0, 2).map((m) => (
              <span key={m.label} className="text-xs text-[#8A8A85]"><span className="font-semibold text-[#111]">{m.value}</span> {m.label}</span>
            ))}
          </div>
          {p.links[0] && (
            <a href={p.links[0].href} target="_blank" rel="noopener noreferrer" className="flex size-8 items-center justify-center rounded-full bg-[#111] text-white transition-transform group-hover:-rotate-45" aria-label={`Open ${p.name}`}>→</a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AllWork() {
  return (
    <section id="work" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
            Selected <span className={serif}>work.</span>
          </h2>
          <p className="max-w-sm text-[#55554F]">Platforms that run real businesses, an award-winning AI product, a chess engine written from scratch and a vision model I trained myself.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <WorkCard key={p.slug} i={i} />
          ))}
        </div>
        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          {moreWork.map((w) => (
            <a key={w.name} href={w.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-4 py-3 transition-colors hover:border-black/20">
              <span>
                <span className="font-medium">{w.name}</span>
                <span className="ml-2 text-sm text-[#8A8A85]">{w.note}</span>
              </span>
              <span className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── contact ───────────────────────── */

function Contact() {
  const [copied, setCopied] = useState(false);
  return (
    <section id="contact" className="px-4 pb-28 md:px-8">
      <motion.div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#111] px-6 py-16 text-white md:px-16 md:py-24"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[#FF6A3D] opacity-40 blur-[100px]" style={{ animation: "d5-blob 12s ease-in-out infinite" }} />
        <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="text-sm text-white/50">Contact</p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl">
              Got a system <span className={`${serif} text-[#FF6A3D]`}>in mind?</span>
            </h2>
            <p className="mt-5 max-w-md text-white/60">Platforms, realtime features, AI integrations, desktop apps — tell me what you’re building and I’ll reply within a day.</p>
          </div>
          <div className="space-y-3">
            <a href={profile.links.mail} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 font-medium text-[#111] transition-transform hover:scale-[1.02]">
              Email me <span>→</span>
            </a>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(profile.email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
              className="flex w-full items-center justify-between rounded-2xl border border-white/15 px-5 py-4 text-left text-white/85 transition-colors hover:bg-white/5"
            >
              <span className="truncate">{copied ? "Copied ✓" : profile.email}</span>
              <span className="text-xs text-white/40">copy</span>
            </button>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[["LinkedIn", profile.links.linkedin], ["GitHub", profile.links.github], ["WhatsApp", profile.links.whatsapp]].map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/15 px-3 py-3 text-center text-white/80 transition-colors hover:bg-white/5">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-[#8A8A85]">© 2026 {profile.name} · Built with Next.js 16, Motion & Lenis</p>
    </section>
  );
}
