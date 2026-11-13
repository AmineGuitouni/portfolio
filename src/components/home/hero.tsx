"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { LuTrophy } from "react-icons/lu";
import { CountUp } from "./demo-tiles";
import SignalField from "./signal-field";
import { EASE, Magnetic, serif, useClock, usePrefersReducedMotion } from "./shared";
import { TechIcon } from "@/components/tech-icons";
import { profile, recognition, stats } from "@/data/portfolio";

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

/** One line of the headline, rising out of a mask on load. */
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span aria-hidden className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
      <motion.span className="block" initial={{ y: "112%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  // Cursor position across the hero, from -0.5 to 0.5 on each axis; drives the portrait's tilt.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-16 pt-32 md:px-8 md:pt-40"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <div className="pointer-events-none absolute -right-20 top-10 size-[480px] rounded-full bg-[#FFB199] opacity-45 blur-[90px]" style={{ animation: "d5-blob 14s ease-in-out infinite" }} />
      <div className="pointer-events-none absolute -left-32 top-60 size-[420px] rounded-full bg-[#9DB8FF] opacity-35 blur-[90px]" style={{ animation: "d5-blob 18s ease-in-out infinite reverse" }} />
      <SignalField className="[mask-image:radial-gradient(80%_75%_at_50%_38%,black_30%,transparent)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-sm backdrop-blur transition-colors hover:border-black/25"
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
              className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-[#E9C46A] bg-[#FBF1D6] px-3 py-1.5 text-sm font-medium text-[#7A5A12] transition-colors hover:bg-[#F6E6B8]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <LuTrophy className="size-3.5" />
              Best PFE {recognition.date.split(" ")[1]} · ISIMA
            </motion.a>
          </div>

          <h1 aria-label={`Software that ${WORDS.join(", ")}.`} className="mt-6 text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            <Line delay={0.1}>Software that</Line>
            <Line delay={0.22}>
              <RotatingWord />
            </Line>
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-lg leading-relaxed text-[#55554F]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          >
            I’m <span className="font-medium text-[#111]">Amine Guitouni</span>, a full-stack & systems engineer. I build platforms end to end — React interfaces, Go and Rust services, PostgreSQL data and AI that does real work.
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap gap-3" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}>
            <Magnetic>
              <a href="#proof" className="block rounded-full bg-[#111] px-6 py-3 font-medium text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.03]">See it running ↓</a>
            </Magnetic>
            <Magnetic>
              <a href={profile.links.cv} target="_blank" rel="noopener noreferrer" className="block rounded-full border border-black/10 bg-white px-6 py-3 font-medium transition-colors hover:border-black/30">Résumé ↗</a>
            </Magnetic>
          </motion.div>

          <motion.div className="mt-10 flex gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.6 }}>
            {stats.slice(0, 3).map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-semibold tracking-tight"><CountUp to={s.value} suffix={s.suffix} /></p>
                <p className="mt-1 max-w-[12ch] text-xs leading-tight text-[#8A8A85]">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <Portrait px={px} py={py} />
      </div>
    </section>
  );
}

/* ───────────────────────── portrait ───────────────────────── */

// Block sizes, in CSS pixels, that the portrait steps through as it sharpens.
const STEPS = [64, 48, 36, 28, 20, 14, 10, 7, 5, 3, 2];
const STEP_MS = 80;

const LOUPE = 132; // diameter on screen
const CELLS = 11; // magnified pixels across
const SOURCE = 3; // image pixels averaged into each cell

const CHIPS = [
  // Tucked just inside the photo on phones, where there is no margin to hang over.
  { name: "Next.js", cls: "-left-2 top-10 sm:-left-8", delay: 0, depth: 60 },
  { name: "Rust", cls: "-right-2 top-24 sm:-right-6", delay: 0.6, depth: 90 },
  { name: "Go", cls: "-left-2 bottom-28 sm:-left-6", delay: 1.2, depth: 80 },
  { name: "PostgreSQL", cls: "-right-2 bottom-36 sm:-right-10", delay: 1.8, depth: 50 },
];

/** Source rectangle that makes an image cover a `w`×`h` box, like CSS object-fit: cover. */
function cover(img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  return { x: (img.naturalWidth - sw) / 2, y: (img.naturalHeight - sh) / 2, w: sw, h: sh };
}

function Portrait({ px, py }: { px: MotionValue<number>; py: MotionValue<number> }) {
  const reduced = usePrefersReducedMotion();
  const time = useClock(profile.timezone);
  const card = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const pixels = useRef<HTMLCanvasElement>(null);
  const lens = useRef<HTMLCanvasElement>(null);
  const swatch = useRef<HTMLSpanElement>(null);
  const hex = useRef<HTMLSpanElement>(null);
  // A copy of the photo at on-screen size, kept for reading colours under the cursor.
  const sample = useRef<HTMLCanvasElement | null>(null);
  const [stage, setStage] = useState<"wait" | "resolve" | "done">("wait");
  const [inspecting, setInspecting] = useState(false);

  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), { stiffness: 70, damping: 16 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 70, damping: 16 });
  const lx = useMotionValue(0);
  const ly = useMotionValue(0);

  // On load the photo renders from a handful of huge pixels down to full resolution.
  useEffect(() => {
    if (reduced) return;
    const img = image.current!;
    const canvas = pixels.current!;
    let frame = 0;

    const begin = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext("2d")!;
      const small = document.createElement("canvas");
      const crop = cover(img, w, h);

      const draw = (block: number) => {
        small.width = Math.max(2, Math.round(w / block));
        small.height = Math.max(2, Math.round(h / block));
        small.getContext("2d")!.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, small.width, small.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, canvas.width, canvas.height);
      };

      draw(STEPS[0]);
      setStage("resolve");
      const started = performance.now() + 450;
      let shown = 0;
      const tick = (now: number) => {
        const i = Math.floor((now - started) / STEP_MS);
        if (i >= STEPS.length) return setStage("done");
        if (i > shown) {
          shown = i;
          draw(STEPS[i]);
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const ready = () => (frame = requestAnimationFrame(begin));
    const failed = () => setStage("done");

    if (img.complete && img.naturalWidth) ready();
    else {
      img.addEventListener("load", ready, { once: true });
      img.addEventListener("error", failed, { once: true });
    }
    return () => {
      cancelAnimationFrame(frame);
      img.removeEventListener("load", ready);
      img.removeEventListener("error", failed);
    };
  }, [reduced]);

  // Hovering the photo opens an eyedropper: an 11×11 magnified patch and the colour at its centre.
  const inspect = (e: React.PointerEvent<HTMLDivElement>) => {
    const img = image.current;
    const el = card.current;
    const out = lens.current;
    if (e.pointerType !== "mouse" || (stage !== "done" && !reduced) || !img || !el || !out) return;

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * w;
    const y = ((e.clientY - rect.top) / rect.height) * h;

    if (!sample.current || sample.current.width !== w || sample.current.height !== h) {
      const copy = document.createElement("canvas");
      copy.width = w;
      copy.height = h;
      const crop = cover(img, w, h);
      copy.getContext("2d", { willReadFrequently: true })!.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, w, h);
      sample.current = copy;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = LOUPE * dpr;
    if (out.width !== size) out.width = out.height = size;
    const ctx = out.getContext("2d")!;
    const span = CELLS * SOURCE;
    const cell = size / CELLS;

    // Shrink the patch to 11×11 (which averages each cell), then blow it back up without smoothing.
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = "#1A1A1A";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(sample.current, x - span / 2, y - span / 2, span, span, 0, 0, CELLS, CELLS);
    const [r, g, b] = ctx.getImageData(Math.floor(CELLS / 2), Math.floor(CELLS / 2), 1, 1).data;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(out, 0, 0, CELLS, CELLS, 0, 0, size, size);

    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < CELLS; i++) {
      const at = Math.round(i * cell) + 0.5;
      ctx.moveTo(at, 0);
      ctx.lineTo(at, size);
      ctx.moveTo(0, at);
      ctx.lineTo(size, at);
    }
    ctx.stroke();
    const mid = Math.floor(CELLS / 2) * cell;
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = dpr * 3;
    ctx.strokeRect(mid, mid, cell, cell);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = dpr * 1.5;
    ctx.strokeRect(mid, mid, cell, cell);

    const colour = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
    if (hex.current) hex.current.textContent = colour;
    if (swatch.current) swatch.current.style.background = colour;
    lx.set(x);
    ly.set(y);
    setInspecting(true);
  };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-sm [perspective:1200px]"
      initial={{ opacity: 0, scale: 0.92, rotate: 3 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.2 }}
    >
      <motion.div className="relative [transform-style:preserve-3d]" style={reduced ? undefined : { rotateX, rotateY }}>
        <div
          ref={card}
          className={`relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-black/5 bg-[#E9E6DF] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] ${inspecting ? "cursor-none" : ""}`}
          onPointerMove={inspect}
          onPointerLeave={() => setInspecting(false)}
        >
          <Image
            ref={image}
            src={profile.photo}
            alt={profile.name}
            fill
            priority
            sizes="(min-width: 1024px) 380px, 90vw"
            className={`object-cover ${reduced || stage !== "wait" ? "opacity-100" : "opacity-0"}`}
          />
          <canvas ref={pixels} aria-hidden className={`pointer-events-none absolute inset-0 size-full transition-opacity duration-500 ${stage === "resolve" && !reduced ? "opacity-100" : "opacity-0"}`} />
          <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/85 p-3 backdrop-blur-md">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate text-sm font-semibold">{profile.name}</p>
              {time && (
                <p className="shrink-0 font-mono text-[11px] tabular-nums text-[#55554F]" title="Local time in Tunis">
                  {time.split(":")[0]}
                  <span className="animate-pulse">:</span>
                  {time.split(":")[1]} <span className="text-[#8A8A85]">Tunis</span>
                </p>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[#55554F]">{profile.role} · {profile.location}</p>
          </div>
        </div>

        {CHIPS.map((chip) => (
          <div key={chip.name} className={`pointer-events-none absolute ${chip.cls}`} style={{ transform: `translateZ(${chip.depth}px)` }}>
            <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-2 text-sm font-medium shadow-[0_10px_30px_-12px_rgba(0,0,0,0.3)]" style={{ animation: `d5-float 4s ease-in-out ${chip.delay}s infinite` }}>
              <TechIcon name={chip.name} className="size-4" />
              {chip.name}
            </div>
          </div>
        ))}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-30"
          style={{ x: lx, y: ly }}
          initial={false}
          animate={{ opacity: inspecting ? 1 : 0, scale: inspecting ? 1 : 0.6 }}
          transition={{ duration: 0.18 }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <canvas ref={lens} className="block rounded-full shadow-[0_0_0_3px_#fff,0_18px_40px_-10px_rgba(0,0,0,0.55)]" style={{ width: LOUPE, height: LOUPE }} />
            <div className="absolute left-1/2 top-full mt-3 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#111] px-2.5 py-1 font-mono text-[11px] text-white shadow-lg">
              <span ref={swatch} className="size-2.5 rounded-full ring-1 ring-white/40" />
              <span ref={hex}>#000000</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
