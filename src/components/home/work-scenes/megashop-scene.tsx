"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { LuCheck, LuSearch, LuShoppingBag, LuUpload } from "react-icons/lu";
import { Stage, during, useSceneClock } from "./stage";

// Tokens from the MegaShop storefront (shop/app/globals.css)
const C = {
  surface: "#f6f6f6",
  low: "#f0f1f1",
  lowest: "#ffffff",
  high: "#e1e3e3",
  fg: "#2d2f2f",
  muted: "#5a5c5c",
  outline: "rgba(172,173,173,0.45)",
  primary: "#a13900",
  container: "#ff793e",
};
const GRADIENT = `linear-gradient(135deg, ${C.primary} 0%, ${C.container} 100%)`;

const COLORS = [
  { name: "Black", hex: "#2d2f2f" },
  { name: "Sand", hex: "#cdb995" },
  { name: "Forest", hex: "#36513f" },
  { name: "Clay", hex: "#b4532a" },
];
const SIZES = ["S", "M", "L", "XL"];
const LOOP = 10;

/** MegaShop storefront: variants, Logo Print placement, add to cart and realtime support chat. */
export default function MegaShopScene() {
  const { ref, t, loop } = useSceneClock(LOOP, 5.0);

  const colorIdx = t < 0.9 ? 0 : t < 1.8 ? 1 : 2;
  const size = t < 2.6 ? "M" : "L";
  const uploading = during(t, 3.2, 4.0);
  const logoPlaced = t >= 4.0;
  const pressCart = during(t, 5.6, 5.9);
  const flying = during(t, 5.8, 6.4);
  const added = t >= 6.3;
  const cartCount = 1 + loop + (added ? 1 : 0);
  const typing = during(t, 7.0, 7.8);
  const chat = during(t, 7.8, 9.6);
  const color = COLORS[colorIdx];

  return (
    <div ref={ref}>
      <Stage>
        <div className="absolute inset-0" style={{ background: C.surface, color: C.fg }}>
          {/* Header */}
          <div className="flex h-8 items-center gap-3 border-b bg-white px-3 text-[7.5px] font-semibold uppercase tracking-[0.08em]" style={{ borderColor: C.high }}>
            <Image src="/work/megashop-mark.png" alt="" width={18} height={15} />
            <span className="relative" style={{ color: C.primary }}>
              Shop
              <span className="absolute -bottom-[9px] left-0 h-[2px] w-full" style={{ background: C.primary }} />
            </span>
            <span>Sale</span>
            <span>Logo print</span>
            <span className="text-[#858a8a]">Collection ▾</span>
            <span className="ml-auto flex h-5 w-28 items-center gap-1 rounded-md px-2 normal-case tracking-normal text-[#858a8a]" style={{ background: C.low }}>
              <LuSearch className="size-2.5" /> Search products…
            </span>
            <span className="rounded-md border px-1.5 py-0.5" style={{ borderColor: C.high }}>EU</span>
            <motion.span className="relative" animate={added && during(t, 6.3, 6.8) ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}>
              <LuShoppingBag className="size-3.5" />
              <motion.span
                key={cartCount}
                className="absolute -right-1.5 -top-1.5 flex size-3 items-center justify-center rounded-full text-[6.5px] text-white"
                style={{ background: C.primary }}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
              >
                {cartCount}
              </motion.span>
            </motion.span>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 p-3">
            {/* Gallery with the product and its print area */}
            <div className="relative h-[244px] overflow-hidden rounded-xl" style={{ background: C.low }}>
              <span className="absolute left-2 top-2 rounded-full bg-white px-1.5 py-0.5 text-[6.5px] font-bold uppercase tracking-[0.1em]">New drop</span>
              <svg viewBox="0 0 200 230" className="absolute inset-x-0 bottom-2 mx-auto h-[210px]">
                <defs>
                  <linearGradient id="ms-shade" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
                    <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
                    <stop offset="1" stopColor="#000" stopOpacity="0.22" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M70 62 C70 36 130 36 130 62 L158 76 C166 80 170 86 172 94 L186 150 L164 158 L150 116 L150 212 C150 216 147 218 143 218 L57 218 C53 218 50 216 50 212 L50 116 L36 158 L14 150 L28 94 C30 86 34 80 42 76 Z"
                  animate={{ fill: color.hex }}
                  transition={{ duration: 0.5 }}
                />
                <path d="M70 62 C70 36 130 36 130 62 L158 76 C166 80 170 86 172 94 L186 150 L164 158 L150 116 L150 212 C150 216 147 218 143 218 L57 218 C53 218 50 216 50 212 L50 116 L36 158 L14 150 L28 94 C30 86 34 80 42 76 Z" fill="url(#ms-shade)" />
                <path d="M78 64 C82 48 118 48 122 64 C116 76 84 76 78 64Z" fill="#000" opacity="0.25" />
                <path d="M92 74 L90 102 M108 74 L110 102" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M68 168 L132 168 L140 196 L60 196 Z" fill="#000" opacity="0.12" />
                <path d="M50 206 L150 206 M14 150 L36 158 M164 158 L186 150" stroke="#000" strokeOpacity="0.15" strokeWidth="3" />
                {/* Print area */}
                <motion.rect
                  x="76" y="96" width="48" height="40" rx="3" fill="none" stroke="#fff" strokeWidth="1.2" strokeDasharray="3 3"
                  animate={{ opacity: logoPlaced ? 0 : uploading ? [0.3, 1, 0.3] : 0.6 }}
                  transition={{ duration: 0.8, repeat: uploading ? Infinity : 0 }}
                />
              </svg>
              {/* Customer artwork landing in the print area */}
              <AnimatePresence>
                {logoPlaced && (
                  <motion.div
                    className="absolute left-1/2 top-[92px] flex -translate-x-1/2 flex-col items-center text-white"
                    initial={{ scale: 2.4, y: -60, opacity: 0, rotate: -12 }}
                    animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  >
                    <span className="flex size-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-black">N</span>
                    <span className="mt-0.5 text-[5.5px] font-black tracking-[0.2em]">NOVA CREW</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-1 rounded-full transition-all" style={{ width: i === 0 ? 12 : 4, background: i === 0 ? C.fg : C.outline }} />
                ))}
              </div>
            </div>

            {/* Purchase panel — fixed to the gallery height so the CTA always sits on the baseline */}
            <div className="flex h-[244px] flex-col">
              <p className="inline-flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.14em]" style={{ color: C.primary }}>
                <span className="h-0.5 w-3 rounded-full" style={{ background: C.primary }} /> Logo print · Hoodies
              </p>
              <h3 className="mt-1 text-[19px] font-black uppercase leading-[0.92] tracking-tighter">Essential<br />Hoodie</h3>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[13px] font-bold">€49.90</span>
                <AnimatePresence>
                  {logoPlaced && (
                    <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[8px] font-semibold" style={{ color: C.primary }}>
                      + €8.00 logo print
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Color swatches (product-option-picker) */}
              <div className="mt-2 flex items-baseline justify-between">
                <p className="text-[7px] font-bold uppercase tracking-[0.06em]">Color</p>
                <p className="text-[7.5px]" style={{ color: C.muted }}><strong style={{ color: C.fg }}>{color.name}</strong> · {COLORS.length}</p>
              </div>
              <div className="mt-1 flex gap-2">
                {COLORS.map((c, i) => (
                  <span
                    key={c.name}
                    className="flex size-6 items-center justify-center rounded-full transition-shadow duration-300"
                    style={{ boxShadow: i === colorIdx ? `0 0 0 2px ${C.surface}, 0 0 0 3.5px ${C.fg}` : `0 0 0 1px rgba(45,47,47,0.18)` }}
                  >
                    <span className="size-[18px] rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" style={{ background: c.hex }} />
                  </span>
                ))}
              </div>

              {/* Size chips */}
              <p className="mt-2 text-[7px] font-bold uppercase tracking-[0.06em]">Size</p>
              <div className="mt-1 flex gap-1.5">
                {SIZES.map((s) => (
                  <span
                    key={s}
                    className="flex h-6 min-w-[30px] items-center justify-center rounded-[0.4rem] text-[8px] font-semibold transition-colors duration-300"
                    style={s === size ? { background: C.fg, color: C.surface } : { background: C.lowest, outline: `1px solid ${C.outline}`, outlineOffset: -1 }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Logo print positions */}
              <p className="mt-2 text-[7px] font-bold uppercase tracking-[0.06em]">Positions</p>
              <div className="mt-1 flex gap-1.5 text-[7.5px] font-semibold">
                <span className="flex items-center gap-1 rounded-md border bg-white px-2 py-1" style={{ borderColor: logoPlaced ? C.primary : C.high }}>
                  {logoPlaced ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex size-3 items-center justify-center rounded-full text-white" style={{ background: C.primary }}>
                      <LuCheck className="size-2" />
                    </motion.span>
                  ) : (
                    <motion.span animate={uploading ? { y: [0, -2, 0] } : {}} transition={{ duration: 0.5, repeat: Infinity }}>
                      <LuUpload className="size-2.5" style={{ color: C.primary }} />
                    </motion.span>
                  )}
                  Front · required
                </span>
                <span className="flex items-center gap-1 rounded-md border bg-white px-2 py-1" style={{ borderColor: C.high, color: C.muted }}>Back · optional</span>
              </div>

              {/* Add to cart */}
              <motion.span
                className="relative mt-auto flex h-7 shrink-0 items-center justify-center rounded-md text-[8.5px] font-semibold uppercase tracking-wide text-[#ffefea]"
                style={{ background: GRADIENT }}
                animate={{ scale: pressCart ? 0.94 : 1 }}
              >
                {added ? "Added to cart ✓" : "Add to cart"}
              </motion.span>
            </div>
          </div>

          {/* Item flying to the cart */}
          <AnimatePresence>
            {flying && (
              <motion.span
                className="absolute size-3 rounded-full"
                style={{ background: C.container, boxShadow: `0 0 12px ${C.container}` }}
                initial={{ left: 342, top: 262, scale: 1 }}
                animate={{ left: [342, 420, 452], top: [262, 110, 10], scale: [1, 0.8, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeIn" }}
              />
            )}
          </AnimatePresence>

          {/* Realtime support chat (support-message-thread.tsx) */}
          <AnimatePresence>
            {(typing || chat) && (
              <motion.div
                className="absolute bottom-3 right-3 w-[150px] rounded-2xl border bg-white p-2 text-[7.5px]"
                style={{ borderColor: C.high, boxShadow: "0 16px 36px rgba(45,47,47,0.18)" }}
                initial={{ opacity: 0, y: 14, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14 }}
              >
                <p className="mb-1 flex items-center gap-1 font-bold">
                  <span className="size-1.5 rounded-full bg-[#00B37E]" /> Support · live
                </p>
                {typing ? (
                  <span className="flex gap-0.5 py-1" style={{ color: C.muted }}>
                    {[0, 1, 2].map((i) => (
                      <motion.i key={i} className="size-1 rounded-full bg-current" animate={{ y: [0, -2, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </span>
                ) : (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl rounded-es-md px-2 py-1.5 shadow-[0_6px_16px_rgba(45,47,47,0.06)]" style={{ background: C.low }}>
                    Your logo is ready for print 👌
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Stage>
    </div>
  );
}
