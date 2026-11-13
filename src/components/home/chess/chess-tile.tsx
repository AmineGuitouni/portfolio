"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { LuRotateCcw, LuX } from "react-icons/lu";
import {
  Engine, advance, fileOf, fromSq, isCapture, judge, positionKey, promotionOf, san, squareName, toSq,
  type Perft, type PieceView, type Result, type Snapshot,
} from "./engine";

const NAMES: Record<string, string> = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" };
const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
/** Known node count for perft(5) from the starting position. */
const PERFT_5 = 4_865_609;

const letter = (code: number) => String.fromCharCode(code).toLowerCase();
const isWhite = (code: number) => code < 97;

function startPieces(): PieceView[] {
  const out: PieceView[] = [];
  START.split("/").forEach((row, r) => {
    let f = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) f += +ch;
      else {
        out.push({ id: `${ch}${r * 8 + f}`, code: ch.charCodeAt(0), square: r * 8 + f });
        f++;
      }
    }
  });
  return out;
}

/** Where the eval bar sits, from material alone: 50 is level, higher favours white. */
function evalFromMaterial(pieces: PieceView[]) {
  const material = pieces.reduce((sum, piece) => sum + (isWhite(piece.code) ? 1 : -1) * VALUE[letter(piece.code)], 0);
  return Math.max(8, Math.min(92, 50 + material * 6));
}

/* ───────────────────────── board ───────────────────────── */

type BoardProps = {
  pieces: PieceView[];
  /** From and to squares of the last move. */
  last?: [number, number] | null;
  selected?: number | null;
  /** Squares the selected piece can reach; true when it captures there. */
  targets?: Map<number, boolean>;
  /** Square of a king in check. */
  check?: number | null;
  onSquare?: (square: number) => void;
  evalPct: number;
  children?: React.ReactNode;
};

function Board({ pieces, last, selected, targets, check, onSquare, evalPct, children }: BoardProps) {
  return (
    <div className="mx-auto flex w-full max-w-[440px] gap-2">
      <div className="relative w-2.5 shrink-0 overflow-hidden rounded-full bg-[#1A1A1A] ring-1 ring-black/15">
        <motion.div className="absolute inset-x-0 bottom-0 bg-white" animate={{ height: `${evalPct}%` }} transition={{ type: "spring", stiffness: 80, damping: 20 }} />
      </div>
      <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)]">
        <div className="grid size-full grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }, (_, square) => {
            const dark = (fileOf(square) + (square >> 3)) % 2 === 1;
            const tone = square === selected ? "bg-[#F0A93A]" : last?.includes(square) ? "bg-[#F6D365]" : dark ? "bg-[#B58863]" : "bg-[#F0D9B5]";
            const target = targets?.get(square);
            const marks = (
              <>
                {square === check && <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(214,48,49,0.9)_0_22%,rgba(214,48,49,0.4)_52%,transparent_76%)]" />}
                {target === false && <span className="absolute left-1/2 top-1/2 size-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/20" />}
                {target === true && <span className="absolute inset-[6%] rounded-full border-[3px] border-black/25" />}
              </>
            );
            if (!onSquare) return <div key={square} className={`relative ${tone}`}>{marks}</div>;
            const occupant = pieces.find((piece) => piece.square === square);
            return (
              <button
                key={square}
                type="button"
                onClick={() => onSquare(square)}
                aria-label={squareName(square) + (occupant ? `, ${isWhite(occupant.code) ? "white" : "black"} ${NAMES[letter(occupant.code)]}` : "")}
                className={`relative ${tone} outline-none transition-[filter] duration-150 hover:brightness-[1.06] focus-visible:z-[3] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111]`}
              >
                {marks}
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {pieces.map((piece) => (
            <motion.img
              key={piece.id}
              src={`/work/chess/${NAMES[letter(piece.code)]}-${isWhite(piece.code) ? "w" : "b"}.svg`}
              alt=""
              draggable={false}
              className="pointer-events-none absolute size-[12.5%] select-none p-[0.4%]"
              style={{ zIndex: last?.[1] === piece.square ? 2 : 1 }}
              initial={false}
              animate={{ left: `${fileOf(piece.square) * 12.5}%`, top: `${(piece.square >> 3) * 12.5}%`, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            />
          ))}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-[#F3F2EE] px-2.5 py-2 text-left">
      <p className="truncate text-[11px] text-[#8A8A85]">{label}</p>
      <p className="truncate font-mono text-sm font-semibold tabular-nums">{children}</p>
    </div>
  );
}

/** One-line move list that keeps the newest move in view. */
function Ticker({ label, moves }: { label: string; moves: string[] }) {
  const skip = Math.max(0, moves.length - 14);
  return (
    <div className="flex h-9 items-center gap-3 rounded-lg border border-[#E7E5DF] px-2.5 font-mono text-[12px]">
      <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#A5A5A0]">{label}</span>
      <div className="flex min-w-0 flex-1 justify-end overflow-hidden whitespace-nowrap [mask-image:linear-gradient(90deg,transparent,black_18%)]">
        <div className="flex gap-2">
          {moves.slice(skip).map((move, k) => {
            const i = k + skip;
            return (
              <span key={i} className={i === moves.length - 1 ? "rounded bg-[#111] px-1 text-white" : "text-[#55554F]"}>
                {i % 2 === 0 && <span className="text-[#A5A5A0]">{i / 2 + 1}.</span>}
                {move}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── replay: Morphy's Opera Game ───────────────────────── */

// Paul Morphy vs Duke Karl / Count Isouard, Paris 1858
const MOVES = [
  "e2e4", "e7e5", "g1f3", "d7d6", "d2d4", "c8g4", "d4e5", "g4f3", "d1f3", "d6e5",
  "f1c4", "g8f6", "f3b3", "d8e7", "b1c3", "c7c6", "c1g5", "b7b5", "c3b5", "c6b5",
  "c4b5", "b8d7", "e1c1", "a8d8", "d1d7", "d8d7", "h1d1", "e7e6", "b5d7", "f6d7",
  "b3b8", "d7b8", "d1d8",
];
const SAN = [
  "e4", "e5", "Nf3", "d6", "d4", "Bg4", "dxe5", "Bxf3", "Qxf3", "dxe5", "Bc4", "Nf6", "Qb3", "Qe7", "Nc3", "c6", "Bg5", "b5",
  "Nxb5", "cxb5", "Bxb5+", "Nbd7", "O-O-O", "Rd8", "Rxd7", "Rxd7", "Rd1", "Qe6", "Bxd7+", "Nxd7", "Qb8+", "Nxb8", "Rd8#",
];

const index = (name: string) => (8 - +name[1]) * 8 + (name.charCodeAt(0) - 97);

function replay(pieces: PieceView[], move: string): PieceView[] {
  const from = index(move.slice(0, 2));
  const to = index(move.slice(2, 4));
  const mover = pieces.find((piece) => piece.square === from)!;
  let next = pieces.filter((piece) => piece.square !== to).map((piece) => (piece === mover ? { ...piece, square: to } : piece));
  if (letter(mover.code) === "k" && Math.abs(fileOf(from) - fileOf(to)) === 2) {
    const row = (from >> 3) * 8;
    const [rookFrom, rookTo] = fileOf(to) === 2 ? [row, row + 3] : [row + 7, row + 5];
    next = next.map((piece) => (piece.square === rookFrom ? { ...piece, square: rookTo } : piece));
  }
  return next;
}

function Replay({ onPlay }: { onPlay: () => void }) {
  const [pieces, setPieces] = useState(startPieces);
  const [ply, setPly] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });

  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(
      () => {
        if (ply >= MOVES.length) {
          setPieces(startPieces());
          setPly(0);
        } else {
          setPieces((p) => replay(p, MOVES[ply]));
          setPly((n) => n + 1);
        }
      },
      ply >= MOVES.length ? 3200 : 950,
    );
    return () => clearTimeout(id);
  }, [ply, inView]);

  const mate = ply === MOVES.length;
  const lastMove = ply > 0 ? MOVES[ply - 1] : null;

  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      <Board pieces={pieces} last={lastMove ? [index(lastMove.slice(0, 2)), index(lastMove.slice(2, 4))] : null} evalPct={mate ? 100 : evalFromMaterial(pieces)}>
        <AnimatePresence>
          {mate && (
            <motion.div className="absolute inset-0 z-10 flex items-center justify-center bg-black/55 text-2xl font-semibold text-white backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Checkmate. 1–0
            </motion.div>
          )}
        </AnimatePresence>
      </Board>

      <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-end gap-2">
        <div className="grid grid-cols-3 gap-2">
          {/* Native release-build figures from the engine's README. */}
          <Stat label="native speed">59M/s</Stat>
          <Stat label="perft(5)">82 ms</Stat>
          <Stat label="move">{Math.ceil(ply / 2)}<span className="text-[#A5A5A0]"> / 17</span></Stat>
        </div>
        <Ticker label="Morphy · 1858" moves={SAN.slice(0, ply)} />
        <button
          type="button"
          onClick={onPlay}
          className="group flex h-11 items-center justify-between rounded-xl bg-[#111] pl-4 pr-1.5 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99]"
        >
          <span className="flex items-center gap-2.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#FF6A3D] opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-[#FF6A3D]" />
            </span>
            Play the real engine
          </span>
          <span className="rounded-lg bg-white/10 px-2.5 py-1.5 font-mono text-[10px] text-white/70 transition-colors group-hover:bg-[#FF6A3D] group-hover:text-white">Rust → WebAssembly</span>
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── play: the engine itself, in a worker ───────────────────────── */

type Phase = "loading" | "you" | "engine" | "over" | "error";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
/** The engine answers in a few milliseconds early on; hold its reply until the player's piece has landed. */
const MIN_REPLY_MS = 480;

function Play({ onExit }: { onExit: () => void }) {
  const engine = useRef<Engine | null>(null);
  // Bumped whenever the game is replaced, so answers from an abandoned game are dropped.
  const game = useRef(0);
  const seen = useRef<string[]>([]);
  const [pieces, setPieces] = useState(startPieces);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [selected, setSelected] = useState<number | null>(null);
  const [last, setLast] = useState<[number, number] | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [search, setSearch] = useState<{ depth: number; ms: number } | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [bench, setBench] = useState<Perft | "running" | null>(null);

  const begin = useCallback((target: Engine) => {
    const token = ++game.current;
    target.newGame().then(
      (fresh) => {
        if (token !== game.current) return;
        seen.current = [positionKey(fresh.fen)];
        setSnap(fresh);
        setPhase("you");
      },
      () => token === game.current && setPhase("error"),
    );
  }, []);

  useEffect(() => {
    const created = new Engine();
    engine.current = created;
    begin(created);
    // Disposing rejects whatever the worker still owed; those handlers only touch a game that is gone.
    return () => created.dispose();
  }, [begin]);

  const rematch = () => {
    if (!engine.current) return;
    setPieces(startPieces());
    setSnap(null);
    setPhase("loading");
    setSelected(null);
    setLast(null);
    setMoves([]);
    setSearch(null);
    setResult(null);
    begin(engine.current);
  };

  /** Plays one move on the engine's board and mirrors it on screen. Returns the game result, if it ended. */
  const commit = async (move: number, before: Snapshot, token: number) => {
    setLast([fromSq(move), toSq(move)]);
    const after = await engine.current!.move(move);
    if (token !== game.current) return { after, ended: true };
    setPieces((current) => advance(current, move, after));
    setMoves((list) => [...list, san(move, before, after)]);
    setSnap(after);
    seen.current.push(positionKey(after.fen));
    const outcome = judge(after, seen.current);
    if (outcome) {
      setResult(outcome);
      setPhase("over");
    }
    return { after, ended: outcome !== null };
  };

  const play = async (move: number) => {
    if (!snap || !engine.current) return;
    const token = game.current;
    setSelected(null);
    setPhase("engine");
    try {
      const mine = await commit(move, snap, token);
      if (mine.ended) return;

      const started = performance.now();
      const thought = await engine.current.think(6, 160, (row) => token === game.current && setSearch({ depth: row.depth, ms: row.ms }));
      await sleep(MIN_REPLY_MS - (performance.now() - started));
      if (token !== game.current) return;
      setSearch({ depth: thought.depth, ms: thought.ms });

      const reply = await commit(thought.move, mine.after, token);
      if (!reply.ended) setPhase("you");
    } catch {
      if (token === game.current) setPhase("error");
    }
  };

  const onSquare = (square: number) => {
    if (phase !== "you" || !snap) return;
    if (selected !== null) {
      const options = snap.moves.filter((m) => fromSq(m) === selected && toSq(m) === square);
      // A pawn reaching the last rank has four legal moves to the same square; take the queen.
      const pick = options.find((m) => promotionOf(m) === "Q") ?? options[0];
      if (pick !== undefined) return void play(pick);
    }
    const code = snap.squares[square];
    setSelected(code && isWhite(code) && square !== selected ? square : null);
  };

  const runBench = async () => {
    if (!engine.current || bench === "running") return;
    setBench("running");
    try {
      setBench(await engine.current.perft(5));
    } catch {
      setBench(null);
    }
  };

  const targets = new Map<number, boolean>();
  if (snap && selected !== null) for (const m of snap.moves) if (fromSq(m) === selected) targets.set(toSq(m), isCapture(m));
  const inCheck = snap && snap.status !== 0 && snap.status !== 3;
  const checked = inCheck ? pieces.find((piece) => letter(piece.code) === "k" && isWhite(piece.code) === snap.white)?.square : null;
  const mateFor = result?.winner;

  const status =
    phase === "loading" ? "Loading the engine…"
    : phase === "error" ? "The engine couldn’t start in this browser."
    : phase === "engine" ? `Engine searching${search && moves.length % 2 === 1 ? ` · depth ${search.depth}` : "…"}`
    : phase === "over" ? `${result?.title} · ${result?.detail}`
    : snap?.status === 1 ? "Check. Your move."
    : moves.length === 0 ? "You’re white. Pick a piece."
    : "Your move.";

  return (
    <div className="flex h-full flex-col gap-3">
      <Board
        pieces={pieces}
        last={last}
        selected={selected}
        targets={targets}
        check={checked}
        onSquare={onSquare}
        evalPct={mateFor === "white" ? 100 : mateFor === "black" ? 0 : evalFromMaterial(pieces)}
      >
        <AnimatePresence>
          {phase === "over" && result && (
            <motion.div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/60 text-center text-white backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <p className="text-2xl font-semibold">{result.title}</p>
              <p className="text-sm text-white/70">
                {mateFor === "white" ? "You beat it. Well played." : mateFor === "black" ? "The engine takes this one." : result.detail}
              </p>
              <button type="button" onClick={rematch} className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#111] transition-transform hover:scale-[1.04]">
                Rematch
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Board>

      <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-end gap-2">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="depth">{search ? `${search.depth} plies` : "—"}</Stat>
          <Stat label="thought for">{search ? `${search.ms < 10 ? search.ms.toFixed(1) : Math.round(search.ms)} ms` : "—"}</Stat>
          <button
            type="button"
            onClick={runBench}
            disabled={phase === "loading" || phase === "engine" || phase === "error" || bench === "running"}
            title="Count every position five moves deep from the start, in your browser"
            className="rounded-lg outline-none ring-[#FF6A3D] transition-shadow hover:ring-2 focus-visible:ring-2 disabled:pointer-events-none"
          >
            <Stat label="perft(5)">
              {bench === null ? <span className="text-[#FF6A3D]">Run it ▸</span> : bench === "running" ? "counting…" : `${(bench.nodes / bench.ms / 1000).toFixed(1)}M/s`}
            </Stat>
          </button>
        </div>
        <Ticker label="You · Engine" moves={moves} />
        <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E7E5DF] pl-3.5 pr-1.5">
          <span className="relative flex size-2 shrink-0">
            {phase === "engine" && <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#FF6A3D] opacity-70" />}
            <span className={`relative inline-flex size-2 rounded-full ${phase === "engine" || phase === "loading" ? "bg-[#FF6A3D]" : phase === "you" ? "bg-[#00B37E]" : "bg-[#8A8A85]"}`} />
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-medium" aria-live="polite">{status}</p>
          <button type="button" onClick={rematch} aria-label="New game" title="New game" className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#55554F] transition-colors hover:bg-[#F3F2EE] hover:text-[#111]">
            <LuRotateCcw className="size-4" />
          </button>
          <button type="button" onClick={onExit} aria-label="Back to the replay" title="Back to the replay" className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#55554F] transition-colors hover:bg-[#F3F2EE] hover:text-[#111]">
            <LuX className="size-4" />
          </button>
        </div>
        <p className="min-h-[2.25em] font-mono text-[10px] leading-[1.125] text-[#8A8A85]">
          {bench && bench !== "running"
            ? `${bench.nodes.toLocaleString("en-US")} positions in ${Math.round(bench.ms)} ms on your device${bench.nodes === PERFT_5 ? " · correct count ✓" : ""}`
            : "The desktop app’s engine, compiled unmodified to WebAssembly and searching in a Web Worker on your device."}
        </p>
      </div>
    </div>
  );
}

/** The Rust chess engine: a replay of a famous game until the visitor decides to play it. */
export function ChessTile() {
  const [playing, setPlaying] = useState(false);
  return playing ? <Play onExit={() => setPlaying(false)} /> : <Replay onPlay={() => setPlaying(true)} />;
}
