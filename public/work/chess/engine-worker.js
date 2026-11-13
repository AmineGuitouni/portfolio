// Runs the Rust chess engine (engine.wasm, built by wasm/chess-engine/build.sh) off the main
// thread. One worker holds one game; every request is answered with the same `id`.
let engine;

const ready = (async () => {
  const response = await fetch(new URL("engine.wasm", self.location.href));
  const { instance } = await WebAssembly.instantiate(await response.arrayBuffer(), {});
  engine = instance.exports;
})();

// The buffer view is rebuilt on every use: growing wasm memory detaches older views.
const buffer = () => new Uint8Array(engine.memory.buffer, engine.engine_buffer(), 1024);

function snapshot() {
  const white = engine.engine_board() === 1;
  const squares = Array.from(buffer().subarray(0, 64));
  const count = engine.engine_legal_moves();
  const bytes = buffer();
  const moves = [];
  for (let i = 0; i < count; i++) moves.push(bytes[i * 2] | (bytes[i * 2 + 1] << 8));
  const fen = new TextDecoder().decode(buffer().subarray(0, engine.engine_fen()));
  return { squares, moves, white, status: engine.engine_status(), fen };
}

const handlers = {
  new() {
    engine.engine_new_game();
    return snapshot();
  },
  move({ move }) {
    const ok = engine.engine_make_move(move) === 1;
    return { ...snapshot(), ok };
  },
  // Iterative deepening, one ply at a time, so each depth can be reported as it finishes.
  // It stops early once `budget` ms have passed, since each extra ply costs several times more.
  think({ depth, budget }, progress) {
    const started = performance.now();
    let move = -1;
    let reached = 0;
    for (let d = 1; d <= depth; d++) {
      move = engine.engine_search(d);
      reached = d;
      const ms = performance.now() - started;
      progress({ depth: d, move, ms });
      if (ms > budget) break;
    }
    return { move, depth: reached, ms: performance.now() - started };
  },
  perft({ depth }) {
    const started = performance.now();
    const nodes = engine.engine_perft(0, depth);
    return { nodes, ms: performance.now() - started };
  },
};

self.onmessage = async ({ data }) => {
  const { id, type } = data;
  try {
    await ready;
    const result = handlers[type](data, (progress) => self.postMessage({ id, progress }));
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({ id, error: String(error) });
  }
};
