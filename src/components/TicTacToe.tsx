"use client";

import { useState } from "react";
import {
  currentTurn,
  emptyBoard,
  findWinner,
  isDraw,
  type Cell,
  type Mark,
} from "@/lib/game";

type Scores = Record<Mark | "draws", number>;

const STARTING_SCORES: Scores = { X: 0, O: 0, draws: 0 };

const PLAYERS: Record<Mark, { name: string; icon: string; tone: "x" | "o" }> = {
  X: { name: "Cat", icon: "🐱", tone: "x" },
  O: { name: "Dog", icon: "🐶", tone: "o" },
};

export function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [scores, setScores] = useState<Scores>(STARTING_SCORES);

  const winner = findWinner(board);
  const draw = isDraw(board);
  const turn = currentTurn(board);
  const finished = Boolean(winner) || draw;
  const winningCells = new Set<number>(winner?.line ?? []);

  function play(index: number) {
    if (board[index] || finished) return;

    const next = board.slice();
    next[index] = turn;
    setBoard(next);

    const result = findWinner(next);
    if (result) {
      setScores((current) => ({
        ...current,
        [result.mark]: current[result.mark] + 1,
      }));
      return;
    }

    if (isDraw(next)) {
      setScores((current) => ({ ...current, draws: current.draws + 1 }));
    }
  }

  function newGame() {
    setBoard(emptyBoard());
  }

  function resetScores() {
    setScores(STARTING_SCORES);
    setBoard(emptyBoard());
  }

  return (
    <section className="game" aria-label="Tic-tac-toe">
      <header className="heading">
        <h1>Cat vs Dog</h1>
        <p>Three in a row wins.</p>
      </header>

      <div className="scores" aria-label="Score">
        <Score mark="X" value={scores.X} active={!finished && turn === "X"} />
        <div className="score draws">
          <strong>{scores.draws}</strong>
          <span>Draws</span>
        </div>
        <Score mark="O" value={scores.O} active={!finished && turn === "O"} />
      </div>

      <p className="status" role="status" aria-live="polite">
        {winner ? (
          <>
            <PlayerTag mark={winner.mark} /> wins!
          </>
        ) : draw ? (
          "It's a draw"
        ) : (
          <>
            <PlayerTag mark={turn} />
            &apos;s turn
          </>
        )}
      </p>

      <div className="board">
        {board.map((cell, index) => {
          const row = Math.floor(index / 3) + 1;
          const column = (index % 3) + 1;
          const taken = cell !== null;
          return (
            <button
              key={index}
              type="button"
              className={[
                "cell",
                cell ? PLAYERS[cell].tone : "",
                winningCells.has(index) ? "win" : "",
                !taken && !finished ? "empty" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              data-preview={PLAYERS[turn].icon}
              aria-label={
                taken
                  ? `Row ${row}, column ${column}, ${PLAYERS[cell].name}`
                  : `Place ${PLAYERS[turn].name} in row ${row}, column ${column}`
              }
              disabled={taken || finished}
              onClick={() => play(index)}
            >
              {cell ? (
                <span className="mark" aria-hidden="true">
                  {PLAYERS[cell].icon}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="actions">
        <button type="button" className="primary" onClick={newGame}>
          <span className="btn-icon" aria-hidden="true">
            ▶
          </span>
          New game
        </button>
        <button type="button" className="ghost" onClick={resetScores}>
          <span className="btn-icon" aria-hidden="true">
            ↺
          </span>
          Reset scores
        </button>
      </div>
    </section>
  );
}

function Score({
  mark,
  value,
  active,
}: {
  mark: Mark;
  value: number;
  active: boolean;
}) {
  const player = PLAYERS[mark];
  return (
    <div className={`score ${player.tone}${active ? " active" : ""}`}>
      <span className="score-icon" aria-hidden="true">
        {player.icon}
      </span>
      <strong>{value}</strong>
      <span>{player.name}</span>
    </div>
  );
}

function PlayerTag({ mark }: { mark: Mark }) {
  const player = PLAYERS[mark];
  return (
    <span className={`tag ${player.tone}`}>
      <span aria-hidden="true">{player.icon}</span> {player.name}
    </span>
  );
}
