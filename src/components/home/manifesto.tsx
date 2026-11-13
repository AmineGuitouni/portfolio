"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import type { IconType } from "react-icons";
import { LuBraces, LuBrainCircuit, LuDatabase, LuLayers, LuMousePointerClick } from "react-icons/lu";
import { Eyebrow, serif, usePrefersReducedMotion } from "./shared";
import { profile } from "@/data/portfolio";

// The five stops named in the manifesto, each with the tools from the stack that live there.
const PATH: { word: string; label: string; tools: string; Icon: IconType }[] = [
  { word: "interface", label: "Interface", tools: "React · Next.js", Icon: LuMousePointerClick },
  { word: "api", label: "API", tools: "Go · Rust · Node.js", Icon: LuBraces },
  { word: "queue", label: "Queue", tools: "Kafka · pg NOTIFY", Icon: LuLayers },
  { word: "database", label: "Database", tools: "PostgreSQL · Redis", Icon: LuDatabase },
  { word: "model", label: "Model", tools: "PyTorch · LLMs", Icon: LuBrainCircuit },
];
const KEYWORDS = new Set(PATH.map((stop) => stop.word));
const WORDS = profile.manifesto.split(" ");

/** A word that goes from faint to solid as the reader scrolls past its place in the sentence. */
function Word({ text, progress, from, to }: { text: string; progress: MotionValue<number>; from: number; to: number }) {
  // The range is padded out to 0→1 so the value holds on both sides instead of snapping back.
  const opacity = useTransform(progress, [0, from, to, 1], [0.16, 0.16, 1, 1]);
  const keyword = KEYWORDS.has(text.toLowerCase().replace(/[^a-z]/g, ""));
  return (
    <motion.span style={{ opacity }} className={keyword ? `${serif} text-[#FF6A3D]` : undefined}>
      {text}{" "}
    </motion.span>
  );
}

function Stop({ stop, at, progress }: { stop: (typeof PATH)[number]; at: number; progress: MotionValue<number> }) {
  const reached = useSpring(useTransform(progress, (v): number => (v >= at - 0.015 ? 1 : 0)), { stiffness: 300, damping: 26 });
  const borderColor = useTransform(reached, [0, 1], ["rgba(17,17,17,0.10)", "rgba(255,106,61,1)"]);
  const color = useTransform(reached, [0, 1], ["#A5A5A0", "#FF6A3D"]);
  const scale = useTransform(reached, [0, 1], [1, 1.12]);
  const boxShadow = useTransform(reached, [0, 1], ["0 0 0 0px rgba(255,106,61,0)", "0 0 0 7px rgba(255,106,61,0.13)"]);
  const labelOpacity = useTransform(reached, [0, 1], [0.45, 1]);
  return (
    <li className="flex flex-col items-center text-center">
      <motion.span className="relative flex size-11 items-center justify-center rounded-full border bg-[#FAFAF7]" style={{ borderColor, color, scale, boxShadow }}>
        <stop.Icon className="size-[18px]" />
      </motion.span>
      <motion.span className="mt-3 text-[13px] font-medium sm:text-sm" style={{ opacity: labelOpacity }}>{stop.label}</motion.span>
      <motion.span className="mt-0.5 hidden font-mono text-[10px] text-[#8A8A85] sm:block" style={{ opacity: labelOpacity }}>{stop.tools}</motion.span>
    </li>
  );
}

/** The "whole path" statement: the sentence lights up as you read, then a packet travels the path it describes. */
export default function Manifesto() {
  const reduced = usePrefersReducedMotion();
  const text = useRef<HTMLParagraphElement>(null);
  const path = useRef<HTMLDivElement>(null);
  const { scrollYProgress: reading } = useScroll({ target: text, offset: ["start 0.82", "end 0.5"] });
  const { scrollYProgress: travel } = useScroll({ target: path, offset: ["start 0.88", "start 0.42"] });
  const packetLeft = useTransform(travel, (v) => `${10 + v * 80}%`);

  return (
    <section id="approach" className="px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-5xl">
        <Eyebrow>The whole path</Eyebrow>
        <p ref={text} className="mt-8 text-[clamp(1.7rem,4.3vw,3.4rem)] font-medium leading-[1.14] tracking-[-0.03em]">
          {reduced
            ? profile.manifesto
            : WORDS.map((word, i) => (
                <Word key={i} text={word} progress={reading} from={0.02 + (i / WORDS.length) * 0.9} to={0.02 + ((i + 2) / WORDS.length) * 0.9} />
              ))}
        </p>

        <div ref={path} className="relative mt-16 md:mt-24">
          {/* Track between the first and last stop (the centres of a five-column grid) */}
          <div className="absolute left-[10%] right-[10%] top-[22px] h-px bg-[repeating-linear-gradient(90deg,#CFCBC2_0_5px,transparent_5px_10px)]" />
          <motion.div className="absolute left-[10%] right-[10%] top-[21px] h-[3px] origin-left rounded-full bg-[#FF6A3D]" style={{ scaleX: reduced ? 1 : travel }} />
          {!reduced && (
            <motion.span className="absolute top-[22px] z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-[#FF6A3D] shadow-[0_0_0_4px_rgba(255,106,61,0.2),0_0_18px_rgba(255,106,61,0.9)]" style={{ left: packetLeft }} />
          )}
          <ol className="relative grid grid-cols-5">
            {PATH.map((stop, i) => (
              <Stop key={stop.word} stop={stop} at={i / (PATH.length - 1)} progress={travel} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
