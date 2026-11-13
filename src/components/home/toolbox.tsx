"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE, SectionHeading, serif, usePrefersReducedMotion } from "./shared";
import { TechIcon, techIcon } from "@/components/tech-icons";
import { stack } from "@/data/portfolio";

const PLATE = 200; // side of one layer, before the isometric tilt
const GAP = 36; // distance between resting layers
const LIFT = 58; // how far the layers above the selected one rise to uncover it

/**
 * The stack drawn as six slabs in isometric view. Choosing a layer colours it and lifts
 * everything above it out of the way, so the layer you are reading about is the one exposed.
 */
function LayerStack({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const reduced = usePrefersReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const count = stack.length;

  return (
    <div className="relative h-[430px] w-[300px] shrink-0 [perspective:1600px]" aria-hidden>
      <motion.div
        className="absolute left-1/2 top-[57%] [transform-style:preserve-3d]"
        style={{ rotateX: 57, rotateZ: -45 }}
        animate={reduced ? undefined : { z: [0, 7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Soft shadow on the ground under the stack */}
        <div className="absolute rounded-[34px] bg-black/25 blur-2xl" style={{ width: PLATE, height: PLATE, left: -PLATE / 2, top: -PLATE / 2, transform: "translateZ(-46px)" }} />

        {stack.map((group, i) => {
          const selected = i === active;
          const z = (count - 1 - i) * GAP + (i < active ? LIFT : 0) + (hover === i && !selected ? 8 : 0);
          const icons = group.items.slice(0, 4);
          return (
            <motion.div
              key={group.id}
              className="absolute [transform-style:preserve-3d]"
              style={{ width: PLATE, height: PLATE, left: -PLATE / 2, top: -PLATE / 2 }}
              initial={false}
              animate={{ z }}
              transition={{ type: "spring", stiffness: 170, damping: 20 }}
            >
              {/* Underside, a few pixels down, reads as the slab's thickness */}
              <div
                className="absolute inset-0 rounded-[26px] transition-colors duration-300"
                style={{ transform: "translateZ(-9px)", background: selected ? "#C8431B" : "#D2CEC3" }}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => onSelect(i)}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                className={`absolute inset-0 rounded-[26px] border text-left transition-colors duration-300 ${
                  selected ? "border-[#FF8A63] bg-[#FF6A3D] text-white" : "border-black/10 bg-white text-[#111] hover:bg-[#FFF6F2]"
                }`}
              >
                <span className={`absolute left-4 top-3.5 font-mono text-[10px] uppercase tracking-[0.16em] ${selected ? "text-white/80" : "text-[#8A8A85]"}`}>
                  {String(i + 1).padStart(2, "0")} {group.title}
                </span>
                <span className="absolute bottom-4 left-4 flex gap-2">
                  {icons.map((item) => {
                    const Icon = techIcon(item.name);
                    return Icon ? <Icon key={item.name} className={`size-5 ${selected ? "text-white" : "text-[#B9B5AA]"}`} /> : null;
                  })}
                </span>
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function Toolbox() {
  const [tab, setTab] = useState(stack[0].id);
  const active = stack.findIndex((g) => g.id === tab);
  const group = stack[active];

  return (
    <section id="toolbox" className="border-t border-black/5 bg-white px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="02" label="Toolbox" aside="Six layers, one engineer. Pick one to see what I reach for there and which projects it shipped in.">
          The toolbox, <span className={serif}>by layer.</span>
        </SectionHeading>

        <div className="mt-10 gap-10 lg:mt-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          {/* Large screens: the stack itself is the tab control, with a labelled list beside it */}
          <div className="hidden items-center gap-2 lg:flex">
            <LayerStack active={active} onSelect={(i) => setTab(stack[i].id)} />
            <div role="tablist" aria-label="Stack layers" aria-orientation="vertical" className="flex w-44 flex-col gap-0.5">
              {stack.map((g, i) => (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={tab === g.id}
                  onClick={() => setTab(g.id)}
                  className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${tab === g.id ? "text-[#111]" : "text-[#8A8A85] hover:text-[#111]"}`}
                >
                  {tab === g.id && <motion.span layoutId="d5-layer" className="absolute inset-0 rounded-xl bg-[#F3F2EE]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className={`relative font-mono text-[10px] ${tab === g.id ? "text-[#FF6A3D]" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative">{g.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            {/* Small screens: plain pills */}
            <div role="tablist" aria-label="Stack layers" className="flex flex-wrap gap-1 rounded-3xl border border-black/5 bg-[#F3F2EE] p-1 sm:w-fit sm:rounded-full lg:hidden">
              {stack.map((g) => (
                <button key={g.id} role="tab" aria-selected={tab === g.id} onClick={() => setTab(g.id)} className="relative rounded-full px-4 py-2 text-sm font-medium">
                  {tab === g.id && <motion.span layoutId="d5-tab" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className={`relative ${tab === g.id ? "text-[#111]" : "text-[#8A8A85]"}`}>{g.title}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={group.id}
                className="mt-6 text-lg text-[#55554F] lg:mt-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {group.caption}
              </motion.p>
            </AnimatePresence>
            {/* Tall enough for the largest layer (seven tools), so switching never moves the page */}
            <div className="mt-6 grid content-start gap-3 sm:grid-cols-2 lg:min-h-[412px]">
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
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:-rotate-6 group-hover:scale-110">
                        <TechIcon name={t.name} className="size-5" />
                      </span>
                      <div className="min-w-0">
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
        </div>
      </div>
    </section>
  );
}
