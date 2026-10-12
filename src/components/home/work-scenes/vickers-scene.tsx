"use client";

import { AnimatePresence, motion } from "motion/react";
import { Stage, during, useSceneClock } from "./stage";

const C = {
  bg: "#0c100b",
  panel: "#131912",
  border: "#273024",
  text: "#e8f0e0",
  muted: "#8a9a80",
  dim: "#3b4636",
  lime: "#b8ff3d",
};
const LOOP = 11;

// Corners of a real labelled indentation (bounding_boxes_points_all.csv, IMG_0738), centred.
const LABEL = [
  [0.32593, 0.45185],
  [0.57531, 0.42407],
  [0.61358, 0.61111],
  [0.35802, 0.64167],
];
const CX = LABEL.reduce((s, p) => s + p[0], 0) / 4;
const CY = LABEL.reduce((s, p) => s + p[1], 0) / 4;
/** Maps the label into a view of `size` px, scaled so the indent fills ~45% of it. */
const quad = (size: number, scale = 1.55) =>
  LABEL.map(([x, y]) => [size / 2 + (x - CX) * size * scale, size / 2 + (y - CY) * size * scale] as const);
const pts = (q: readonly (readonly [number, number])[]) => q.map((p) => p.join(",")).join(" ");

// U-Net from unet/unet_model.py: encoder 64→1024, ConvTranspose decoder with skip connections.
const LEVELS = [
  { ch: 64, res: 256 },
  { ch: 128, res: 128 },
  { ch: 256, res: 64 },
  { ch: 512, res: 32 },
  { ch: 1024, res: 16 },
];
const ENC_AT = [2.0, 2.3, 2.6, 2.9, 3.25];
const DEC_AT = [4.6, 4.3, 4.0, 3.65]; // level 0..3 (up4 … up1)
const OUT_AT = 4.95;

function Block({ x, y, w, h, lit, label }: { x: number; y: number; w: number; h: number; lit: boolean; label?: string }) {
  // DoubleConv: two conv layers drawn as two slabs
  return (
    <g>
      {[0, 1].map((k) => (
        <motion.rect
          key={k}
          x={x + k * (w / 2 + 1)}
          y={y}
          width={w / 2}
          height={h}
          rx={1.5}
          initial={false}
          animate={{ fill: lit ? C.lime : "#1c231a", stroke: lit ? C.lime : C.dim, opacity: lit ? 1 : 0.9 }}
          transition={{ duration: 0.25 }}
          strokeWidth={0.8}
          style={{ filter: lit ? `drop-shadow(0 0 4px ${C.lime})` : "none" }}
        />
      ))}
      {label && (
        <text x={x + w / 2} y={y - 3} textAnchor="middle" fontSize="6" fill={lit ? C.lime : C.muted} fontFamily="ui-monospace, monospace">
          {label}
        </text>
      )}
    </g>
  );
}

/** Vickers Vision: microscope image → U-Net segmentation → contour corners → indentation diagonals. */
export default function VickersScene() {
  const { ref, t } = useSceneClock(LOOP, 8.2);

  const circleLocked = t >= 1.1;
  const inputSent = t >= 1.5;
  const maskSharp = t >= 5.6;
  const showMask = t >= OUT_AT;
  const contour = t >= 6.1;
  const cornersShown = [6.5, 6.75, 7.0, 7.25].map((at) => t >= at);
  const mapped = t >= 7.7;
  const json = t >= 8.4;
  const fade = t >= 10.4;
  const encLit = ENC_AT.map((at) => t >= at && t < OUT_AT + 1.6);
  const decLit = DEC_AT.map((at) => t >= at && t < OUT_AT + 1.6);
  const outLit = during(t, OUT_AT, OUT_AT + 1.6);

  // U-Net geometry (inside a 200×190 svg)
  const blocks = LEVELS.map((l, i) => {
    const w = 9 + i * 3.4;
    const h = 56 - i * 9.5;
    const y = 16 + i * 43;
    return { ...l, w, h, y, xe: 14 + i * 13, xd: 200 - 14 - i * 13 - w };
  });

  const micro = quad(120, 1.9);
  const mask = quad(104, 1.9);

  return (
    <div ref={ref}>
      <Stage>
        <motion.div className="absolute inset-0 font-sans" style={{ background: C.bg, color: C.text }} animate={{ opacity: fade ? 0.4 : 1 }} transition={{ duration: 0.5 }}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(184,255,61,0.08),transparent)]" />

          {/* Header */}
          <div className="flex items-center justify-between px-3 pt-2.5 font-mono text-[7px]" style={{ color: C.muted }}>
            <span className="flex items-center gap-1.5">
              <span className="rounded border px-1.5 py-0.5" style={{ borderColor: C.border, color: C.lime }}>PyTorch</span>
              <span className="rounded border px-1.5 py-0.5" style={{ borderColor: C.border }}>U-Net · 31.0M params</span>
            </span>
            <span>POST /image-detection/</span>
          </div>

          {/* 1. Microscope image + field-of-view detection */}
          <div className="absolute left-3 top-[34px] w-[124px]">
            <p className="mb-1 font-mono text-[6.5px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>01 · Microscope</p>
            <div className="relative size-[120px]">
              <svg viewBox="0 0 120 120" className="size-full">
                <defs>
                  <filter id="vk-grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
                    <feColorMatrix values="0 0 0 0 0.62  0 0 0 0 0.64  0 0 0 0 0.6  0 0 0 0.55 0" />
                  </filter>
                  <clipPath id="vk-circle">
                    <circle cx="60" cy="60" r="58" />
                  </clipPath>
                </defs>
                <g clipPath="url(#vk-circle)">
                  <rect width="120" height="120" fill="#a4a89f" />
                  <rect width="120" height="120" filter="url(#vk-grain)" />
                  <path d="M0 30 L120 44 M0 86 L120 74 M20 0 L34 120" stroke="#6f736b" strokeWidth="0.6" opacity="0.6" />
                  {/* The indentation: four pyramid facets meeting at the centre */}
                  {micro.map((p, i) => {
                    const n = micro[(i + 1) % 4];
                    return <polygon key={i} points={`${p.join(",")} ${n.join(",")} 60,60`} fill={["#1d1f1b", "#383c35", "#55594f", "#2a2d27"][i]} stroke="#141613" strokeWidth="0.6" />;
                  })}
                </g>
                {/* Field-of-view circle detection (detect_circle_diameter) */}
                <motion.circle
                  cx="60" cy="60" r="57" fill="none" stroke={C.lime} strokeWidth="1.2" strokeDasharray="6 5"
                  initial={false}
                  animate={{ rotate: circleLocked ? 0 : 180, opacity: t < 0.2 ? 0 : circleLocked ? 0.35 : 1 }}
                  style={{ originX: "60px", originY: "60px" }}
                  transition={{ duration: 0.9 }}
                />
                {/* Corners mapped back onto the original image + diagonals d1, d2 */}
                <AnimatePresence>
                  {mapped && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <motion.line x1={micro[0][0]} y1={micro[0][1]} x2={micro[2][0]} y2={micro[2][1]} stroke={C.lime} strokeWidth="1" strokeDasharray="3 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                      <motion.line x1={micro[1][0]} y1={micro[1][1]} x2={micro[3][0]} y2={micro[3][1]} stroke="#e8f0e0" strokeWidth="1" strokeDasharray="3 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.25 }} />
                      {micro.map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="2.6" fill={C.lime} stroke={C.bg} strokeWidth="0.8" />
                      ))}
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>
              <AnimatePresence>
                {mapped && (
                  <motion.div className="absolute -bottom-1 left-0 right-0 flex justify-between font-mono text-[6.5px]" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <span style={{ color: C.lime }}>d₁ 84.2px</span>
                    <span>d₂ 78.7px</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Cropped, resized grayscale input travelling into the network */}
            <motion.div
              className="absolute top-[150px] flex items-center gap-1 rounded border px-1.5 py-1 font-mono text-[6.5px]"
              style={{ borderColor: C.border, background: C.panel }}
              initial={false}
              animate={inputSent ? { x: [0, 92, 104], opacity: [1, 1, 0], scale: [1, 0.9, 0.7] } : { x: 0, opacity: t >= 1.1 ? 1 : 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeIn" }}
            >
              <span className="size-3 rounded-sm bg-[linear-gradient(135deg,#9a9d96,#3a3d38)]" /> 1×256×256
            </motion.div>
          </div>

          {/* 2. U-Net */}
          <div className="absolute left-[152px] top-[34px] w-[200px]">
            <p className="mb-1 text-center font-mono text-[6.5px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>02 · U-Net forward pass</p>
            <svg viewBox="0 0 200 222" className="h-[222px] w-[200px] overflow-visible">
              {/* Skip connections (copy & concatenate) */}
              {blocks.slice(0, 4).map((b, i) => {
                const lit = decLit[i];
                const y = b.y + b.h / 2;
                return (
                  <motion.line
                    key={`skip-${i}`}
                    x1={b.xe + b.w + 3}
                    x2={b.xd - 3}
                    y1={y}
                    y2={y}
                    strokeWidth={lit ? 1.4 : 0.8}
                    strokeDasharray="3 3"
                    initial={false}
                    animate={{ stroke: lit ? C.lime : C.dim, strokeDashoffset: lit ? [0, -12] : 0 }}
                    transition={{ strokeDashoffset: { duration: 0.6, repeat: lit ? Infinity : 0, ease: "linear" } }}
                  />
                );
              })}
              {/* Down (maxpool) and up (ConvTranspose2d) arrows */}
              {blocks.slice(0, 4).map((b, i) => {
                const n = blocks[i + 1];
                return (
                  <g key={`arrows-${i}`} stroke={C.dim} strokeWidth="0.9" fill="none">
                    <path d={`M${b.xe + b.w / 2} ${b.y + b.h + 2} L${n.xe + n.w / 2} ${n.y - 6}`} stroke={encLit[i + 1] ? C.lime : C.dim} />
                    <path d={`M${n.xd + n.w / 2} ${n.y - 6} L${b.xd + b.w / 2} ${b.y + b.h + 2}`} stroke={decLit[i] ? C.lime : C.dim} />
                  </g>
                );
              })}
              {/* Encoder / decoder / skip labels */}
              <text x={30} y={212} fontSize="6" fill={C.muted} fontFamily="ui-monospace, monospace" letterSpacing="0.6">ENCODER ↓</text>
              <text x={170} y={212} textAnchor="end" fontSize="6" fill={C.muted} fontFamily="ui-monospace, monospace" letterSpacing="0.6">↑ DECODER</text>
              <text x={100} y={blocks[0].y + blocks[0].h / 2 - 4} textAnchor="middle" fontSize="5.5" fill={decLit[0] ? C.lime : C.muted} fontFamily="ui-monospace, monospace">skip connections · copy & concat</text>
              {/* Encoder */}
              {blocks.map((b, i) => (
                <Block key={`e-${i}`} x={i === 4 ? 100 - b.w / 2 : b.xe} y={b.y} w={b.w} h={b.h} lit={encLit[i]} label={String(b.ch)} />
              ))}
              {/* Decoder */}
              {blocks.slice(0, 4).map((b, i) => (
                <Block key={`d-${i}`} x={b.xd} y={b.y} w={b.w} h={b.h} lit={decLit[i]} label={String(b.ch)} />
              ))}
              {/* Output 1×1 conv */}
              <motion.rect x={190} y={blocks[0].y + 10} width={6} height={26} rx={1.5} initial={false} animate={{ fill: outLit ? C.lime : "#1c231a", stroke: outLit ? C.lime : C.dim }} strokeWidth={0.8} />
              <text x={193} y={blocks[0].y + 45} textAnchor="middle" fontSize="5.5" fill={outLit ? C.lime : C.muted} fontFamily="ui-monospace, monospace">1×1</text>
              {/* Resolution ladder */}
              {blocks.map((b, i) => (
                <text key={`r-${i}`} x={-2} y={b.y + b.h / 2 + 2} textAnchor="end" fontSize="5.5" fill={C.muted} fontFamily="ui-monospace, monospace">
                  {b.res}²
                </text>
              ))}
              {/* Signal travelling through the U */}
              {during(t, 1.95, OUT_AT) && (
                <motion.circle
                  r="3.2"
                  fill={C.lime}
                  style={{ filter: `drop-shadow(0 0 5px ${C.lime})` }}
                  initial={false}
                  animate={{
                    cx: [blocks[0].xe + 4, ...blocks.slice(1, 4).map((b) => b.xe + b.w / 2), 100, ...blocks.slice(0, 4).reverse().map((b) => b.xd + b.w / 2), 193],
                    cy: [...blocks.map((b) => b.y + b.h / 2), ...blocks.slice(0, 4).reverse().map((b) => b.y + b.h / 2), blocks[0].y + 23],
                  }}
                  transition={{ duration: OUT_AT - 1.95, ease: "linear" }}
                />
              )}
            </svg>
          </div>

          {/* 3. Output mask → corners */}
          <div className="absolute right-3 top-[34px] w-[108px]">
            <p className="mb-1 font-mono text-[6.5px] uppercase tracking-[0.12em]" style={{ color: C.muted }}>03 · Mask → corners</p>
            <div className="relative size-[104px] overflow-hidden rounded-md border" style={{ borderColor: C.border, background: "#050705" }}>
              <svg viewBox="0 0 104 104" className="size-full">
                <defs>
                  <filter id="vk-soft">
                    <feGaussianBlur stdDeviation={maskSharp ? 0 : 5} />
                  </filter>
                </defs>
                {showMask && (
                  <motion.polygon
                    points={pts(mask)}
                    fill="#f4f8ee"
                    filter="url(#vk-soft)"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ originX: "52px", originY: "52px" }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                {contour && (
                  <motion.polygon points={pts(mask)} fill="none" stroke={C.lime} strokeWidth="1.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45 }} />
                )}
                {mask.map(([x, y], i) =>
                  cornersShown[i] ? (
                    <g key={i}>
                      <motion.circle cx={x} cy={y} r="3.2" fill={C.lime} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 14 }} />
                      <motion.circle cx={x} cy={y} r="3.2" fill="none" stroke={C.lime} initial={{ r: 3.2, opacity: 0.9 }} animate={{ r: 11, opacity: 0 }} transition={{ duration: 0.7 }} />
                    </g>
                  ) : null,
                )}
              </svg>
              <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1 font-mono text-[6px]" style={{ color: maskSharp ? C.lime : C.muted }}>
                {maskSharp ? "σ(x) > 0.95" : showMask ? "logits" : "—"}
              </span>
            </div>
            <p className="mt-1 font-mono text-[6px]" style={{ color: contour ? C.text : C.dim }}>approxPolyDP → 4 pts</p>

            {/* API response */}
            <AnimatePresence>
              {json && (
                <motion.pre
                  className="mt-1.5 rounded-md border p-1.5 font-mono text-[6px] leading-[1.45]"
                  style={{ borderColor: C.border, background: C.panel, color: C.muted }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {"{ "}<span style={{ color: C.lime }}>&quot;x1&quot;</span>: 0.326, <span style={{ color: C.lime }}>&quot;y1&quot;</span>: 0.452,{"\n  "}… <span style={{ color: C.lime }}>&quot;x4&quot;</span>: 0.358, <span style={{ color: C.lime }}>&quot;y4&quot;</span>: 0.642,{"\n  "}<span style={{ color: C.text }}>&quot;pixelDistance&quot;</span>: …{" }"}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>

          {/* Training facts */}
          <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between border-t pt-1.5 font-mono text-[6.5px]" style={{ borderColor: C.border, color: C.muted }}>
            <span>train: BCE + Dice · Adam · 178 labelled indents</span>
            <span style={{ color: C.text }}>
              d₁, d₂ → <span style={{ color: C.lime }}>HV = 1.8544·F / d²</span>
            </span>
          </div>
        </motion.div>
      </Stage>
    </div>
  );
}
