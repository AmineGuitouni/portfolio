"use client";

import { useEffect, useRef } from "react";

const CELL = 28;
const SPEED = 300; // px per second
const TRAIL = 22; // samples kept per packet
const MAX_PACKETS = 26;

type Packet = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  /** Distance left before the next grid node, where it may turn. */
  toNode: number;
  /** Nodes left to visit before it fades out. */
  hops: number;
  life: number;
  trail: number[];
};

/**
 * A dot grid that carries traffic: packets route along its lines, the dots swell under the
 * cursor, and a click sends a burst out from that point. Drawn on one canvas behind its
 * parent section, which it also listens to for pointer input.
 */
export default function SignalField({ ink = "17,17,17", accent = "255,106,61", className = "" }: { ink?: string; accent?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const host = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const grid = document.createElement("canvas");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let visible = false;
    let last = 0;
    let nextAmbient = 0;
    let lastTrail = 0;
    const pointer = { x: -9999, y: -9999, px: 0, py: 0, active: false };
    const packets: Packet[] = [];

    const snap = (v: number) => Math.round(v / CELL) * CELL;

    const drawGrid = () => {
      const g = grid.getContext("2d")!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, width, height);
      g.fillStyle = `rgba(${ink},0.13)`;
      for (let y = CELL; y < height; y += CELL) for (let x = CELL; x < width; x += CELL) g.fillRect(x - 1, y - 1, 2, 2);
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [canvas, grid]) {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
      }
      drawGrid();
      if (still || !visible) paint(0);
    };

    const spawn = (x: number, y: number, dx: number, dy: number, hops = 6 + Math.floor(Math.random() * 14)) => {
      if (packets.length >= MAX_PACKETS) packets.shift();
      packets.push({ x: snap(x), y: snap(y), dx, dy, toNode: CELL, hops, life: 1, trail: [] });
    };

    const ambient = () => {
      // Enter from a random edge and head inwards.
      const horizontal = Math.random() < 0.6;
      if (horizontal) {
        const fromLeft = Math.random() < 0.5;
        spawn(fromLeft ? 0 : width, Math.random() * height, fromLeft ? 1 : -1, 0, 10 + Math.floor(Math.random() * 22));
      } else {
        spawn(Math.random() * width, 0, 0, 1, 8 + Math.floor(Math.random() * 14));
      }
    };

    const step = (dt: number) => {
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        let travel = SPEED * dt;
        while (travel > 0 && p.hops > 0) {
          const move = Math.min(travel, p.toNode);
          p.x += p.dx * move;
          p.y += p.dy * move;
          p.toNode -= move;
          travel -= move;
          if (p.toNode <= 0.001) {
            p.toNode = CELL;
            p.hops--;
            // Turn left or right at roughly one node in three.
            if (Math.random() < 0.34) {
              const turn = Math.random() < 0.5 ? 1 : -1;
              [p.dx, p.dy] = [-p.dy * turn, p.dx * turn];
            }
          }
        }
        p.trail.push(p.x, p.y);
        if (p.trail.length > TRAIL * 2) p.trail.splice(0, 2);
        if (p.hops <= 0) p.life -= dt * 2.4;
        const gone = p.life <= 0 || p.x < -CELL || p.x > width + CELL || p.y < -CELL || p.y > height + CELL;
        if (gone) packets.splice(i, 1);
      }
    };

    function paint(now: number) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(grid, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Lens: dots near the cursor swell and warm up.
      if (pointer.active) {
        const R = 150;
        const x0 = Math.max(CELL, snap(pointer.x - R));
        const y0 = Math.max(CELL, snap(pointer.y - R));
        for (let y = y0; y <= pointer.y + R && y < height; y += CELL) {
          for (let x = x0; x <= pointer.x + R && x < width; x += CELL) {
            const d = Math.hypot(x - pointer.x, y - pointer.y);
            if (d > R) continue;
            const k = (1 - d / R) ** 2;
            const size = 2 + k * 5;
            ctx.fillStyle = `rgba(${accent},${0.12 + k * 0.75})`;
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
          }
        }
      }

      // Packets: a square head and a trail that fades behind it.
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      for (const p of packets) {
        const n = p.trail.length / 2;
        for (let i = 1; i < n; i++) {
          ctx.strokeStyle = `rgba(${accent},${(i / n) * 0.75 * p.life})`;
          ctx.beginPath();
          ctx.moveTo(p.trail[(i - 1) * 2], p.trail[(i - 1) * 2 + 1]);
          ctx.lineTo(p.trail[i * 2], p.trail[i * 2 + 1]);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${accent},${p.life})`;
        ctx.fillRect(p.x - 2.5, p.y - 2.5, 5, 5);
      }
      void now;
    }

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (now > nextAmbient) {
        ambient();
        nextAmbient = now + 420 + Math.random() * 900;
      }
      step(dt);
      paint(now);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (still || frame || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const locate = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const wasActive = pointer.active;
      locate(e);
      pointer.active = true;
      // Moving the cursor leaves a wake: a packet heads off the way it was travelling.
      const now = performance.now();
      const vx = pointer.x - pointer.px;
      const vy = pointer.y - pointer.py;
      if (wasActive && now - lastTrail > 150 && Math.hypot(vx, vy) > 5) {
        lastTrail = now;
        if (Math.abs(vx) > Math.abs(vy)) spawn(pointer.x, pointer.y, Math.sign(vx), 0, 4 + Math.floor(Math.random() * 7));
        else spawn(pointer.x, pointer.y, 0, Math.sign(vy), 4 + Math.floor(Math.random() * 7));
      }
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      locate(e);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) spawn(pointer.x, pointer.y, dx, dy, 7 + Math.floor(Math.random() * 10));
    };

    const sizes = new ResizeObserver(resize);
    sizes.observe(host);
    const sight = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    sight.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    if (!still) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);
    }

    return () => {
      stop();
      sizes.disconnect();
      sight.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [ink, accent]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}
