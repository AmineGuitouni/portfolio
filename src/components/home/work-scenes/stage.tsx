"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export const STAGE_W = 480;
export const STAGE_H = 300;

/**
 * Renders a fixed 480×300 design canvas scaled to the card's width, so each scene can be
 * laid out in exact pixels (like the real app UI it recreates) and still fit any card size.
 */
export function Stage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / STAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
      <div
        className="absolute left-0 top-0 origin-top-left transition-opacity duration-300"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale ?? 1})`, opacity: scale === null ? 0 : 1 }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * A looping timeline clock. Returns seconds into the current loop (`t`), how many loops have
 * completed (`loop`) and total elapsed time. It only advances while the scene is on screen,
 * and holds a representative frame for users who prefer reduced motion.
 */
export function useSceneClock(duration: number, stillFrame = duration * 0.6) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000; // read before the updater runs, which may be deferred
      last = now;
      setElapsed((e) => e + dt);
    }, 100);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const total = reduced ? stillFrame : elapsed;
  return { ref, t: total % duration, loop: Math.floor(total / duration), total };
}

/** True while `t` is inside [from, to). */
export const during = (t: number, from: number, to: number) => t >= from && t < to;
