//! WebAssembly bindings for the Rust Chess Engine
//! (https://github.com/AmineGuitouni/Rust-Chess-Engine).
//!
//! The engine's `core` module is compiled in exactly as it is in the desktop app; nothing in
//! it is changed. This file only adds a small C ABI so the portfolio can drive one game from
//! a Web Worker. `build.sh` checks the engine out next to this crate before compiling.
#![allow(dead_code)]

#[path = "../../engine/src-tauri/src/core/mod.rs"]
mod core;

use std::cell::RefCell;

use crate::core::{
    board::{Board, UndoMove},
    bot::Bot,
    moves::{
        Move,
        generator::MoveGenerator,
        perft::{KIWIPETE_FEN, START_FEN, count_moves_for_depth},
        warm_attack_tables,
    },
};

/// The desktop app caps the search at this depth too (commands/search.rs).
const MAX_SEARCH_DEPTH: u32 = 6;
const BUFFER_SIZE: usize = 1024;
const NO_MOVE: u32 = u32::MAX;

struct Session {
    board: Board,
    history: Vec<UndoMove>,
    bot: Bot,
    /// Scratch space shared with JavaScript: moves, the board and FEN text pass through here.
    buffer: Box<[u8; BUFFER_SIZE]>,
}

impl Session {
    fn new() -> Self {
        warm_attack_tables();
        Self {
            board: Board::from_fen(START_FEN),
            history: Vec::new(),
            bot: Bot::new(),
            buffer: Box::new([0; BUFFER_SIZE]),
        }
    }

    fn legal_moves(&self) -> Vec<Move> {
        MoveGenerator::legal_moves(&self.board, self.board.side_to_move())
    }
}

thread_local! {
    static SESSION: RefCell<Option<Session>> = const { RefCell::new(None) };
}

fn with_session<T>(run: impl FnOnce(&mut Session) -> T) -> T {
    SESSION.with(|cell| run(cell.borrow_mut().get_or_insert_with(Session::new)))
}

/// Address of the shared scratch buffer inside the module's linear memory.
#[unsafe(no_mangle)]
pub extern "C" fn engine_buffer() -> *const u8 {
    with_session(|session| session.buffer.as_ptr())
}

#[unsafe(no_mangle)]
pub extern "C" fn engine_new_game() {
    with_session(|session| {
        session.board = Board::from_fen(START_FEN);
        session.history.clear();
    });
}

/// Loads the FEN whose UTF-8 bytes JavaScript wrote into the buffer. Returns 1 on success.
#[unsafe(no_mangle)]
pub extern "C" fn engine_set_fen(length: u32) -> u32 {
    with_session(|session| {
        let length = (length as usize).min(BUFFER_SIZE);
        let Ok(fen) = std::str::from_utf8(&session.buffer[..length]) else {
            return 0;
        };
        match Board::try_from_fen(fen.trim()) {
            Ok(board) => {
                session.board = board;
                session.history.clear();
                1
            }
            Err(_) => 0,
        }
    })
}

/// Writes the 64 squares (a8 first, FEN letters, 0 for empty) into the buffer.
/// Returns 1 when white is to move and 0 when black is.
#[unsafe(no_mangle)]
pub extern "C" fn engine_board() -> u32 {
    with_session(|session| {
        session.buffer[..64].fill(0);
        for index in 0..session.board.pieces().len() {
            let piece = session.board.pieces()[index];
            session.buffer[piece.square() as usize] = piece.to_fen_char() as u8;
        }
        session.board.side_to_move() as u32
    })
}

/// Writes the current position as FEN text into the buffer and returns its length in bytes.
#[unsafe(no_mangle)]
pub extern "C" fn engine_fen() -> u32 {
    with_session(|session| {
        let fen = session.board.to_fen();
        let length = fen.len().min(BUFFER_SIZE);
        session.buffer[..length].copy_from_slice(&fen.as_bytes()[..length]);
        length as u32
    })
}

/// Writes every legal move as a little-endian u16 (the engine's packed format: 6 bits from,
/// 6 bits to, 4 bits flag) into the buffer and returns how many there are.
#[unsafe(no_mangle)]
pub extern "C" fn engine_legal_moves() -> u32 {
    with_session(|session| {
        let moves = session.legal_moves();
        for (index, chess_move) in moves.iter().enumerate() {
            let bytes = chess_move.encoded().to_le_bytes();
            session.buffer[index * 2] = bytes[0];
            session.buffer[index * 2 + 1] = bytes[1];
        }
        moves.len() as u32
    })
}

/// Plays a packed move if it is legal in the current position. Returns 1 when it was played.
#[unsafe(no_mangle)]
pub extern "C" fn engine_make_move(encoded: u32) -> u32 {
    with_session(|session| {
        let Some(chess_move) = session
            .legal_moves()
            .into_iter()
            .find(|candidate| candidate.encoded() as u32 == encoded)
        else {
            return 0;
        };
        let undo = session.board.make_move(&chess_move);
        session.history.push(undo);
        1
    })
}

/// Takes back the last move. Returns 1 when there was one to undo.
#[unsafe(no_mangle)]
pub extern "C" fn engine_undo() -> u32 {
    with_session(|session| match session.history.pop() {
        Some(undo) => {
            session.board.unmake_move(undo);
            1
        }
        None => 0,
    })
}

/// 0 = playing, 1 = check, 2 = checkmate, 3 = stalemate.
#[unsafe(no_mangle)]
pub extern "C" fn engine_status() -> u32 {
    with_session(|session| {
        let in_check = session.board.is_in_check();
        let has_moves = !session.legal_moves().is_empty();
        match (in_check, has_moves) {
            (false, true) => 0,
            (true, true) => 1,
            (true, false) => 2,
            (false, false) => 3,
        }
    })
}

/// Runs the engine's iterative-deepening search to `depth` and returns its packed best move,
/// or `u32::MAX` when the side to move has no legal moves. The transposition table is kept
/// between calls, so deepening one ply at a time from JavaScript reuses earlier work.
#[unsafe(no_mangle)]
pub extern "C" fn engine_search(depth: u32) -> u32 {
    with_session(|session| {
        if session.legal_moves().is_empty() {
            return NO_MOVE;
        }
        let depth = depth.clamp(1, MAX_SEARCH_DEPTH) as u8;
        session.bot.search(&session.board, depth).encoded() as u32
    })
}

/// Counts leaf positions with the engine's own perft, from the starting position
/// (`position` 0) or Kiwipete (`position` 1). Does not touch the game in progress.
#[unsafe(no_mangle)]
pub extern "C" fn engine_perft(position: u32, depth: u32) -> f64 {
    let fen = if position == 1 { KIWIPETE_FEN } else { START_FEN };
    let mut board = Board::from_fen(fen);
    count_moves_for_depth(depth.clamp(1, 6) as u8, &mut board) as f64
}
