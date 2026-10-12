"use client";

import { AnimatePresence, motion } from "motion/react";
import { Stage, during, useSceneClock } from "./stage";

// Styles from the desktop app (src/styles/global.css, chess-board.css, bot-search-panel.css)
const C = {
  app: "#121212",
  panel: "#191919",
  panelBorder: "#353535",
  control: "#252525",
  controlBorder: "#444",
  text: "#f5f5f5",
  muted: "#888",
  soft: "#aaa",
  light: "#d5d8c3",
  dark: "#66725b",
  frame: "#292929",
  focus: "#3578e5",
};
const LAST_FROM = "linear-gradient(rgb(222 184 61 / 36%), rgb(222 184 61 / 36%))";
const LAST_TO = "linear-gradient(rgb(235 194 58 / 52%), rgb(235 194 58 / 52%))";
const CHECK = "radial-gradient(circle, rgb(190 48 48 / 88%) 0 22%, rgb(147 37 37 / 58%) 48%, transparent 76%)";

// Morphy's Opera Game (1858) before 16.Qb8+ — FEN 4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 1 16
type P = { id: string; type: "k" | "q" | "r" | "b" | "n" | "p"; white: boolean; sq: string };
const START: P[] = [
  { id: "bk", type: "k", white: false, sq: "e8" },
  { id: "bb", type: "b", white: false, sq: "f8" },
  { id: "br", type: "r", white: false, sq: "h8" },
  { id: "bp-a", type: "p", white: false, sq: "a7" },
  { id: "bn", type: "n", white: false, sq: "d7" },
  { id: "bp-f", type: "p", white: false, sq: "f7" },
  { id: "bp-g", type: "p", white: false, sq: "g7" },
  { id: "bp-h", type: "p", white: false, sq: "h7" },
  { id: "bq", type: "q", white: false, sq: "e6" },
  { id: "bp-e", type: "p", white: false, sq: "e5" },
  { id: "wb", type: "b", white: true, sq: "g5" },
  { id: "wp-e", type: "p", white: true, sq: "e4" },
  { id: "wq", type: "q", white: true, sq: "b3" },
  { id: "wp-a", type: "p", white: true, sq: "a2" },
  { id: "wp-b", type: "p", white: true, sq: "b2" },
  { id: "wp-c", type: "p", white: true, sq: "c2" },
  { id: "wp-f", type: "p", white: true, sq: "f2" },
  { id: "wp-g", type: "p", white: true, sq: "g2" },
  { id: "wp-h", type: "p", white: true, sq: "h2" },
  { id: "wk", type: "k", white: true, sq: "c1" },
  { id: "wr", type: "r", white: true, sq: "d1" },
];
const NAMES = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" } as const;

/**
 * Real output of the engine's iterative deepening on this position (core/bot/search.rs,
 * release build, cumulative nodes). Depths 1–2 grab the queen; depth 3 finds the sacrifice.
 */
const ITERATIONS = [
  { depth: 1, move: "Qxe6", uci: "b3e6", score: "−0.49", nodes: 104 },
  { depth: 2, move: "Qxe6", uci: "b3e6", score: "−0.49", nodes: 906 },
  { depth: 3, move: "Qb8+", uci: "b3b8", score: "#2", nodes: 3016 },
  { depth: 4, move: "Qb8+", uci: "b3b8", score: "#2", nodes: 3326 },
  { depth: 5, move: "Qb8+", uci: "b3b8", score: "#2", nodes: 3605 },
  { depth: 6, move: "Qb8+", uci: "b3b8", score: "#2", nodes: 3979 },
];
const ROW_AT = [1.3, 2.0, 3.0, 3.7, 4.3, 4.9];
// Legal moves the search walks through (captures first, as move ordering does) — drawn as flickering probes.
const PROBES = ["b3e6", "d1d7", "b3b8", "g5e7", "b3b5", "d1d6", "g5f6", "b3d5", "b3a4", "g5h6"];
const LOOP = 13;

const BOARD = 216;
const SQ = BOARD / 8;
const xy = (sq: string) => ({ x: (sq.charCodeAt(0) - 97) * SQ, y: (8 - Number(sq[1])) * SQ });
const centre = (sq: string) => {
  const { x, y } = xy(sq);
  return { x: x + SQ / 2, y: y + SQ / 2 };
};

function Arrow({ uci, color, width = 5, dashed = false }: { uci: string; color: string; width?: number; dashed?: boolean }) {
  const a = centre(uci.slice(0, 2));
  const b = centre(uci.slice(2, 4));
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const head = 11;
  const end = { x: b.x - Math.cos(ang) * head * 0.7, y: b.y - Math.sin(ang) * head * 0.7 };
  const p1 = { x: b.x - Math.cos(ang - 0.45) * head, y: b.y - Math.sin(ang - 0.45) * head };
  const p2 = { x: b.x - Math.cos(ang + 0.45) * head, y: b.y - Math.sin(ang + 0.45) * head };
  return (
    <g>
      <line x1={a.x} y1={a.y} x2={end.x} y2={end.y} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? "4 5" : undefined} />
      <polygon points={`${b.x},${b.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`} fill={color} />
    </g>
  );
}

/** The Rust engine's desktop app: an iterative-deepening search finds Morphy's mate, then plays it. */
export default function ChessScene() {
  const { ref, t } = useSceneClock(LOOP, 9.4);

  // Playout after the search: 16.Qb8+ Nxb8 17.Rd8#
  const pieces = START.map((p) => {
    if (p.id === "wq" && t >= 6.0) return { ...p, sq: "b8" };
    if (p.id === "bn" && t >= 7.2) return { ...p, sq: "b8" };
    if (p.id === "wr" && t >= 8.4) return { ...p, sq: "d8" };
    return p;
  }).filter((p) => !(p.id === "wq" && t >= 7.2));

  const lastMove = t >= 8.4 ? ["d1", "d8"] : t >= 7.2 ? ["d7", "b8"] : t >= 6.0 ? ["b3", "b8"] : null;
  const inCheck = during(t, 6.0, 7.2) || t >= 8.4;
  const mate = during(t, 8.9, 12.2);
  const searching = during(t, 0.7, 5.3);
  const rows = ITERATIONS.filter((_, i) => t >= ROW_AT[i]);
  const best = rows.at(-1);
  const showResult = during(t, 5.3, 12.2);
  const probe = searching ? PROBES[Math.floor(t * 7) % PROBES.length] : null;
  const fade = t >= 12.2;
  const status = mate ? "Checkmate · white wins" : t >= 6.0 ? (t >= 8.4 ? "Black to move" : t >= 7.2 ? "White to move" : "Black to move · check") : "White to move";

  return (
    <div ref={ref}>
      <Stage>
        <motion.div className="absolute inset-0 font-sans" style={{ background: C.app, color: C.text }} animate={{ opacity: fade ? 0.35 : 1 }} transition={{ duration: 0.5 }}>
          {/* .game-page__header + .game__status */}
          <div className="flex items-center justify-between px-3 pt-2.5 text-[7px] font-semibold uppercase tracking-[0.04em]" style={{ color: C.soft }}>
            <span className="rounded-[4px] border px-1.5 py-0.5 normal-case tracking-normal" style={{ borderColor: C.controlBorder, background: C.control, color: "#e8e8e8" }}>← Back</span>
            <span className="text-[10px] normal-case tracking-normal" style={{ color: C.text }}>Human vs Engine</span>
            <span className="flex gap-1 normal-case tracking-normal">
              {["Undo", "Reset"].map((l) => (
                <span key={l} className="rounded-[4px] border px-1.5 py-0.5" style={{ borderColor: C.controlBorder, background: C.control, color: "#e8e8e8" }}>{l}</span>
              ))}
            </span>
          </div>
          <div className="flex justify-between px-3 pt-1.5 text-[7px] font-semibold tracking-[0.04em]" style={{ color: C.soft }}>
            <AnimatePresence mode="wait">
              <motion.span key={status} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.2 }}>
                {status}
              </motion.span>
            </AnimatePresence>
            <span>Opera Game · Paris 1858</span>
          </div>

          {/* Board (.chess-board) */}
          <div className="absolute left-3 top-[46px] rounded-[5px] shadow-[0_16px_40px_rgba(0,0,0,0.45)]" style={{ border: `6px solid ${C.frame}` }}>
            <div className="relative overflow-hidden" style={{ width: BOARD, height: BOARD }}>
              <div className="grid size-full grid-cols-8 grid-rows-8">
                {Array.from({ length: 64 }).map((_, i) => {
                  const file = i % 8;
                  const rank = 8 - Math.floor(i / 8);
                  const sq = "abcdefgh"[file] + rank;
                  const isDark = (file + rank) % 2 === 1; // a1 is dark
                  const base = isDark ? C.dark : C.light;
                  const layers = [
                    lastMove?.[0] === sq ? LAST_FROM : null,
                    lastMove?.[1] === sq ? LAST_TO : null,
                    inCheck && sq === "e8" ? CHECK : null,
                  ].filter(Boolean);
                  return (
                    <div key={sq} className="relative" style={{ background: layers.length ? `${layers.join(", ")}, ${base}` : base }}>
                      {file === 0 && <span className="absolute left-0.5 top-0.5 text-[5.5px] font-bold" style={{ color: isDark ? "rgb(235 238 222 / 70%)" : "rgb(23 27 21 / 67%)" }}>{rank}</span>}
                      {rank === 1 && <span className="absolute bottom-0 right-0.5 text-[5.5px] font-bold" style={{ color: isDark ? "rgb(235 238 222 / 70%)" : "rgb(23 27 21 / 67%)" }}>{"abcdefgh"[file]}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Search overlay: probes flicker through candidate moves, the best line settles per depth */}
              <svg className="pointer-events-none absolute inset-0 z-10" width={BOARD} height={BOARD}>
                {probe && <Arrow uci={probe} color="rgb(104 174 255 / 55%)" width={3} dashed />}
                {best && t < 6.0 && (
                  <motion.g key={best.uci} initial={{ opacity: 0 }} animate={{ opacity: 0.92 }} transition={{ duration: 0.3 }}>
                    <Arrow uci={best.uci} color={best.score.startsWith("#") ? "#46c987" : "rgb(235 194 58)"} width={5.5} />
                  </motion.g>
                )}
              </svg>

              {pieces.map((p) => {
                const { x, y } = xy(p.sq);
                return (
                  <motion.img
                    key={p.id}
                    src={`/work/chess/${NAMES[p.type]}-${p.white ? "w" : "b"}.svg`}
                    alt=""
                    draggable={false}
                    className="absolute z-[5] select-none"
                    style={{ width: SQ * 0.88, height: SQ * 0.88, margin: SQ * 0.06 }}
                    initial={false}
                    animate={{ left: x, top: y }}
                    transition={{ type: "spring", stiffness: 170, damping: 22 }}
                  />
                );
              })}

              <AnimatePresence>
                {mate && (
                  <motion.div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[1.5px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.p className="text-[17px] font-bold" initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
                      Checkmate
                    </motion.p>
                    <p className="text-[8px]" style={{ color: C.soft }}>16.Qb8+!! Nxb8 17.Rd8# · found at depth 3</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* .bot-search panel */}
          <div className="absolute right-3 top-[46px] w-[220px] rounded-[5px] border p-2.5" style={{ background: C.panel, borderColor: C.panelBorder }}>
            <p className="text-[9px] font-bold" style={{ color: "#ddd" }}>Bot search</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[6.5px] font-semibold uppercase tracking-[0.04em]" style={{ color: C.muted }}>Depth</span>
              <span className="flex h-5 w-10 items-center rounded-[4px] border px-1.5 text-[8px]" style={{ borderColor: C.controlBorder, background: C.control, color: "#eee" }}>6</span>
              <motion.span
                className="flex h-5 flex-1 items-center justify-center rounded-[4px] border text-[8px] font-semibold"
                style={{ borderColor: searching ? C.focus : C.controlBorder, background: C.control, color: searching ? "#9cc2ff" : "#eee" }}
                animate={{ scale: during(t, 0.5, 0.75) ? 0.94 : 1 }}
              >
                {searching ? "Searching..." : "Search"}
              </motion.span>
            </div>

            {/* Iterative deepening log */}
            <div className="mt-2 border-t pt-1.5" style={{ borderColor: "#303030" }}>
              <div className="grid grid-cols-[22px_1fr_34px_42px] text-[6.5px] font-semibold uppercase tracking-[0.04em]" style={{ color: C.muted }}>
                <span>D</span>
                <span>Best</span>
                <span className="text-right">Eval</span>
                <span className="text-right">Nodes</span>
              </div>
              <div className="mt-1 h-[93px] space-y-[2px]">
                {ITERATIONS.map((it, i) => {
                  const shown = t >= ROW_AT[i];
                  const isMate = it.score.startsWith("#");
                  const breakthrough = i === 2;
                  return (
                    <motion.div
                      key={it.depth}
                      className="relative grid h-[14px] grid-cols-[22px_1fr_34px_42px] items-center rounded-[3px] px-0.5 font-mono text-[7.5px]"
                      initial={false}
                      animate={{ opacity: shown ? 1 : 0.12, x: shown ? 0 : -4, backgroundColor: shown && breakthrough && t < ROW_AT[3] + 0.6 ? "rgba(70,201,135,0.18)" : "rgba(0,0,0,0)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <span style={{ color: C.muted }}>{it.depth}</span>
                      <span className="font-semibold" style={{ color: isMate ? "#46c987" : "#e8c66b" }}>{it.move}</span>
                      <span className="text-right" style={{ color: isMate ? "#46c987" : "#ddd" }}>{it.score}</span>
                      <span className="text-right tabular-nums" style={{ color: C.soft }}>{it.nodes.toLocaleString("en-US")}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Result (.bot-search__result) */}
            <div className="mt-1.5 h-[34px] border-t pt-1" style={{ borderColor: "#303030" }}>
              <AnimatePresence mode="wait">
                {showResult ? (
                  <motion.dl key="res" className="grid grid-cols-2 gap-x-2 text-[7.5px]" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div>
                      <dt className="text-[6.5px] font-semibold uppercase" style={{ color: C.muted }}>Last best move</dt>
                      <dd className="font-mono text-[10px] font-bold" style={{ color: "#46c987" }}>b3b8</dd>
                    </div>
                    <div>
                      <dt className="text-[6.5px] font-semibold uppercase" style={{ color: C.muted }}>Time</dt>
                      <dd className="font-mono text-[10px] font-bold">3.87 ms</dd>
                    </div>
                  </motion.dl>
                ) : searching ? (
                  <motion.p key="prog" className="text-[7.5px]" style={{ color: C.soft }} initial={{ opacity: 0 }} animate={{ opacity: [0.5, 1, 0.5] }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 1.2, repeat: Infinity }}>
                    Searching… alpha-beta · TT · quiescence
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* Engine facts strip */}
          <div className="absolute bottom-2 left-3 flex w-[228px] justify-between font-mono text-[6.5px]" style={{ color: C.muted }}>
            <span>perft(5) 4,865,609 ✓</span>
            <span>55–59M nodes/s</span>
          </div>
        </motion.div>
      </Stage>
    </div>
  );
}
