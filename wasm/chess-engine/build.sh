#!/usr/bin/env bash
# Rebuilds public/work/chess/engine.wasm: the Rust Chess Engine compiled to WebAssembly,
# which the homepage's chess tile runs in a Web Worker.
#
#   wasm/chess-engine/build.sh
#
# The engine source is fetched at the pinned commit below and compiled unmodified together
# with the bindings in src/lib.rs. Everything is built in a temporary directory; only the
# .wasm file lands in the repo. Requires: rustup target add wasm32-unknown-unknown
set -euo pipefail

ENGINE_REPO="https://github.com/AmineGuitouni/Rust-Chess-Engine"
ENGINE_REV="4b5b2066f2e8e960d4e52d9cef37e4420ef47816"

HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../../public/work/chess/engine.wasm"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

git init -q "$WORK/engine"
git -C "$WORK/engine" fetch -q --depth 1 "$ENGINE_REPO" "$ENGINE_REV"
git -C "$WORK/engine" checkout -q FETCH_HEAD

mkdir -p "$WORK/bindings"
cp -R "$HERE/Cargo.toml" "$HERE/src" "$WORK/bindings/"

# Prefer the rustup toolchain: a Homebrew-installed rustc has no wasm32 standard library,
# and it can shadow rustup's on PATH, so point cargo at the right compiler explicitly.
CARGO=cargo
if command -v rustup >/dev/null 2>&1; then
  CARGO="$(rustup which cargo)"
  export RUSTC="$(rustup which rustc)"
fi
(cd "$WORK/bindings" && "$CARGO" build --release --target wasm32-unknown-unknown)

cp "$WORK/bindings/target/wasm32-unknown-unknown/release/chess_engine_wasm.wasm" "$OUT"
chmod 644 "$OUT"
echo "Wrote $OUT ($(wc -c < "$OUT" | tr -d ' ') bytes) from $ENGINE_REPO@${ENGINE_REV:0:7}"
