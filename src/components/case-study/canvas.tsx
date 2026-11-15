"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/components/home/shared";

/**
 * A fixed-size design canvas scaled to its container's width, so mock product UI can be laid
 * out in exact pixels and still fit any column. Hidden until the first measurement.
 */
export function Canvas({
  width,
  height,
  className = "",
  style,
  children,
}: {
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ aspectRatio: `${width} / ${height}`, ...style }}>
      <div
        className="absolute left-0 top-0 origin-top-left transition-opacity duration-300"
        style={{ width, height, transform: `scale(${scale ?? 1})`, opacity: scale === null ? 0 : 1 }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Seconds since `active` turned true, ticking every 100 ms, and back to 0 when it turns false.
 * With `loop`, wraps around. Visitors who prefer reduced motion get the fixed `still` frame.
 */
export function useActiveTime(active: boolean, still: number, loop?: number) {
  const reduced = usePrefersReducedMotion();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;
    const start = performance.now();
    const id = setInterval(() => setElapsed((performance.now() - start) / 1000), 100);
    return () => {
      clearInterval(id);
      setElapsed(0);
    };
  }, [active, reduced]);

  if (reduced) return still;
  return loop ? elapsed % loop : elapsed;
}

/** Clamp to [0, 1]. */
export const unit = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Deterministic pseudo-random number in [0, 1) for an integer seed. Rounded to six places:
 * the server's and the browser's Math.sin can differ in the last digits, and the multiplier
 * magnifies that, which would make server-rendered markup fail to hydrate.
 */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1e6) / 1e6;
};

/**
 * Render prop that tells its children whether the block has been seen once and whether it is
 * on screen now, so a demo can start the first time it appears and pause while off screen.
 */
export function Watch({ className, children }: { className?: string; children: (state: { seen: boolean; visible: boolean }) => React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-15% 0px" });
  const visible = useInView(ref, { margin: "-10% 0px" });
  return (
    <div ref={ref} className={className}>
      {children({ seen, visible })}
    </div>
  );
}
