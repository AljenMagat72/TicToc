export type Mark = "X" | "O";
export type Cell = Mark | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export type Winner = {
  mark: Mark;
  line: readonly [number, number, number];
};

export function emptyBoard(): Cell[] {
  return Array<Cell>(9).fill(null);
}

export function findWinner(board: readonly Cell[]): Winner | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return { mark, line };
    }
  }
  return null;
}

export function isDraw(board: readonly Cell[]): boolean {
  return board.every((cell) => cell !== null) && findWinner(board) === null;
}

export function currentTurn(board: readonly Cell[]): Mark {
  const xs = board.filter((cell) => cell === "X").length;
  const os = board.filter((cell) => cell === "O").length;
  return xs === os ? "X" : "O";
}
