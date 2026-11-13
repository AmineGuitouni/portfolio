"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const serif = "font-[family-name:var(--d5-serif)] italic font-normal";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const watchReducedMotion = (notify: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

/**
 * Whether the visitor asked for less motion. Reads false on the server and while hydrating,
 * then updates, so components can change their markup on it without a hydration mismatch.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(watchReducedMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
}

/** Small numbered label that sits above a section heading. */
export function Eyebrow({ index, children, dark = false }: { index?: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/50" : "text-[#8A8A85]"}`}>
      {index && <span className="text-[#FF6A3D]">{index}</span>}
      <span className={`h-px w-8 ${dark ? "bg-white/20" : "bg-black/15"}`} />
      {children}
    </p>
  );
}

/** Heading text that rises out of a mask the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    // The padding keeps italic overhangs and descenders inside the mask; the margin cancels it out.
    <span className={`-mx-[0.08em] -mb-[0.16em] block overflow-hidden px-[0.08em] pb-[0.16em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "115%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-6% 0px" }}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SectionHeading({
  index,
  label,
  aside,
  children,
}: {
  index: string;
  label: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <Eyebrow index={index}>{label}</Eyebrow>
        <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
          <Reveal>{children}</Reveal>
        </h2>
      </div>
      {aside && (
        <motion.p
          className="max-w-sm text-[#55554F]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6% 0px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
        >
          {aside}
        </motion.p>
      )}
    </div>
  );
}

/** Pulls its child a little toward the cursor. Mouse only, so touch taps stay put. */
export function Magnetic({ children, strength = 0.28, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Wall-clock time in a given IANA zone, e.g. "14:32". Null until mounted, so server and client markup agree. */
export function useClock(timeZone: string, withSeconds = false) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: withSeconds ? "2-digit" : undefined,
      timeZone,
    });
    const tick = () => setTime(format.format(new Date()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, withSeconds ? 1000 : 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [timeZone, withSeconds]);
  return time;
}
