// Client for the Rust chess engine running in a Web Worker (public/work/chess/engine-worker.js).
// Moves use the engine's own packed format: 6 bits from, 6 bits to, 4 bits flag.

export type Status = 0 | 1 | 2 | 3; // playing, check, checkmate, stalemate

export type Snapshot = {
  /** 64 squares from a8 to h1: the FEN letter's char code, or 0 when empty. */
  squares: number[];
  /** Every legal move for the side to move. */
  moves: number[];
  white: boolean;
  status: Status;
  fen: string;
};

export type DepthRow = { depth: number; move: number; ms: number };
export type Thought = { move: number; depth: number; ms: number };
export type Perft = { nodes: number; ms: number };

type Pending = { resolve: (value: never) => void; reject: (reason: Error) => void; progress?: (row: DepthRow) => void };

export class Engine {
  private worker: Worker;
  private pending = new Map<number, Pending>();
  private seq = 0;

  constructor() {
    this.worker = new Worker("/work/chess/engine-worker.js");
    this.worker.onmessage = ({ data }) => {
      const entry = this.pending.get(data.id);
      if (!entry) return;
      if (data.progress) return entry.progress?.(data.progress);
      this.pending.delete(data.id);
      if (data.error) entry.reject(new Error(data.error));
      else entry.resolve(data.result as never);
    };
    this.worker.onerror = () => this.failAll(new Error("The engine worker failed to start"));
  }

  private call<T>(message: Record<string, unknown>, progress?: (row: DepthRow) => void) {
    return new Promise<T>((resolve, reject) => {
      const id = ++this.seq;
      this.pending.set(id, { resolve: resolve as Pending["resolve"], reject, progress });
      this.worker.postMessage({ id, ...message });
    });
  }

  private failAll(error: Error) {
    this.pending.forEach((entry) => entry.reject(error));
    this.pending.clear();
  }

  newGame = () => this.call<Snapshot>({ type: "new" });
  move = (move: number) => this.call<Snapshot & { ok: boolean }>({ type: "move", move });
  /** Deepens one ply at a time up to `depth`, stopping early once `budget` ms have passed. */
  think = (depth: number, budget: number, progress?: (row: DepthRow) => void) =>
    this.call<Thought>({ type: "think", depth, budget }, progress);
  perft = (depth: number) => this.call<Perft>({ type: "perft", depth });

  dispose() {
    this.worker.terminate();
    this.failAll(new Error("The engine was shut down"));
  }
}

/* ───────────────────────── move helpers ───────────────────────── */

export const fromSq = (move: number) => move & 63;
export const toSq = (move: number) => (move >> 6) & 63;
export const flagOf = (move: number) => move >> 12;

const CASTLE_KING = 1;
const CASTLE_QUEEN = 2;
const EN_PASSANT = 3;
const CAPTURE = 4;
// Flags 5–8 promote to Q, R, B, N; 10–13 do the same while capturing.
const PROMOTIONS = "QRBN";

export const fileOf = (square: number) => square % 8;
export const rankOf = (square: number) => 8 - (square >> 3);
export const squareName = (square: number) => "abcdefgh"[fileOf(square)] + rankOf(square);
export const isCapture = (move: number) => {
  const flag = flagOf(move);
  return flag === EN_PASSANT || flag === CAPTURE || flag >= 10;
};
/** "Q", "R", "B" or "N" when the move promotes, otherwise null. */
export const promotionOf = (move: number) => {
  const flag = flagOf(move);
  if (flag >= 5 && flag <= 8) return PROMOTIONS[flag - 5];
  if (flag >= 10 && flag <= 13) return PROMOTIONS[flag - 10];
  return null;
};

/** Standard algebraic notation. Pass the position after the move to get the + or # suffix. */
export function san(move: number, before: Snapshot, after?: Snapshot) {
  const flag = flagOf(move);
  const from = fromSq(move);
  const to = toSq(move);
  let text: string;

  if (flag === CASTLE_KING) text = "O-O";
  else if (flag === CASTLE_QUEEN) text = "O-O-O";
  else {
    const piece = String.fromCharCode(before.squares[from]).toUpperCase();
    const takes = isCapture(move) ? "x" : "";
    if (piece === "P") {
      const promotion = promotionOf(move);
      text = (takes ? squareName(from)[0] + "x" : "") + squareName(to) + (promotion ? `=${promotion}` : "");
    } else {
      // Another piece of the same kind that could reach the same square needs telling apart.
      const rivals = before.moves.filter((m) => m !== move && toSq(m) === to && before.squares[fromSq(m)] === before.squares[from]);
      let origin = "";
      if (rivals.length) {
        const sharesFile = rivals.some((m) => fileOf(fromSq(m)) === fileOf(from));
        const sharesRank = rivals.some((m) => rankOf(fromSq(m)) === rankOf(from));
        const name = squareName(from);
        origin = !sharesFile ? name[0] : !sharesRank ? name[1] : name;
      }
      text = piece + origin + takes + squareName(to);
    }
  }

  if (after?.status === 2) return text + "#";
  if (after?.status === 1) return text + "+";
  return text;
}

/* ───────────────────────── pieces on screen ───────────────────────── */

/** A piece with an identity that survives moves, so it can glide instead of teleporting. */
export type PieceView = { id: string; code: number; square: number };

export const piecesFrom = (snapshot: Snapshot): PieceView[] =>
  snapshot.squares.flatMap((code, square) => (code ? [{ id: `${code}:${square}`, code, square }] : []));

/** Applies a move to the on-screen pieces, keeping their ids. */
export function advance(pieces: PieceView[], move: number, after: Snapshot): PieceView[] {
  const flag = flagOf(move);
  const from = fromSq(move);
  const to = toSq(move);
  // En passant captures the pawn beside the mover, not the one on the target square.
  const captured = flag === EN_PASSANT ? (from >> 3) * 8 + fileOf(to) : to;

  const next = pieces
    .filter((piece) => piece.square !== captured || piece.square === from)
    .map((piece) => {
      if (piece.square === from) return { ...piece, square: to, code: after.squares[to] };
      const rank = from >> 3;
      if (flag === CASTLE_KING && piece.square === rank * 8 + 7) return { ...piece, square: rank * 8 + 5 };
      if (flag === CASTLE_QUEEN && piece.square === rank * 8) return { ...piece, square: rank * 8 + 3 };
      return piece;
    });

  // Fall back to a fresh read of the board if the bookkeeping above ever disagrees with the engine.
  const matches = next.length === after.squares.filter(Boolean).length && next.every((piece) => after.squares[piece.square] === piece.code);
  return matches ? next : piecesFrom(after);
}

/* ───────────────────────── game result ───────────────────────── */

export type Result = { title: string; detail: string; winner?: "white" | "black" } | null;

/** Position identity for repetition: placement, side to move, castling rights and en passant square. */
export const positionKey = (fen: string) => fen.split(" ").slice(0, 4).join(" ");

export function judge(after: Snapshot, seen: string[]): Result {
  if (after.status === 2) return { title: "Checkmate", detail: after.white ? "Black wins" : "White wins", winner: after.white ? "black" : "white" };
  if (after.status === 3) return { title: "Stalemate", detail: "Draw" };

  const key = positionKey(after.fen);
  if (seen.filter((k) => k === key).length >= 3) return { title: "Draw", detail: "Threefold repetition" };
  if (Number(after.fen.split(" ")[4]) >= 100) return { title: "Draw", detail: "Fifty-move rule" };

  const left = after.squares.filter(Boolean).map((code) => String.fromCharCode(code).toLowerCase());
  const others = left.filter((p) => p !== "k");
  if (others.length === 0 || (others.length === 1 && "bn".includes(others[0]))) return { title: "Draw", detail: "Insufficient material" };
  return null;
}
