import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  squares: string[] = [];
  xIsNext: boolean = false;
  winner: string = '';
  loser: string = '';
  showWinner: 1 | 0 = 0;
  easyMode = false;
  tie = false;
  gameOver = false;

  constructor() {}

  ngOnInit(): void {
    this.newGame();
    this.showWinner = 0;
  }

  toggleMode(event: MouseEvent) {
    event.preventDefault();
    this.easyMode = !this.easyMode;
  }

  newGame() {
    this.squares = Array(9).fill(null);
    this.winner = 'TEMP';
    this.showWinner = 0;
    this.xIsNext = true;
    this.tie = false;
    this.gameOver = false;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number) {
    if (!this.squares[idx] && !this.gameOver) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
      this.winner = this.calculateWinner();
      if (this.gameOver) return;
      if (!this.xIsNext) {
        if (this.easyMode) return this.randomMove(this.squares);
        const bestMove = this.minimax(
          this.squares,
          0,
          -Infinity,
          Infinity,
          true,
        );
        this.squares[bestMove.index] = this.player;
        this.xIsNext = !this.xIsNext;
      }
      this.winner = this.calculateWinner();
      if (!this.isMovesLeft(this.squares)) this.tie = true;
    }
    this.winner = this.calculateWinner();
  }

  randomMove(board: string[]) {
    if (!this.isMovesLeft(board)) {
      this.winner = this.calculateWinner();
      return;
    }
    while (this.isMovesLeft(board) && !this.gameOver) {
      const randomIndex = Math.round(Math.random() * 8);
      if (!board[randomIndex]) {
        this.squares[randomIndex] = this.player;
        this.xIsNext = !this.xIsNext;
        this.winner = this.calculateWinner();
        if (!this.isMovesLeft(this.squares)) {
          this.tie = true;
          this.gameOver = true;
        }
        break;
      }
    }
  }

  isMovesLeft(board: string[]): boolean {
    return board.some((square) => !square);
  }

  calculateWinner(): string {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] && this.squares[a] == this.squares[b] &&
        this.squares[a] == this.squares[c]
      ) {
        this.showWinner = 1;
        this.gameOver = true;
        return this.squares[a];
      }
    }
    if (!this.isMovesLeft(this.squares)) {
      this.tie = true;
      this.gameOver = true;
    }
    return '';
  }

  evaluate(board: string[]): number {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        if (board[a] == 'O') {
          return 10;
        } else if (board[a] === 'X') {
          return -10;
        }
      }
    }
    return 0;
  }

  minimax(
    board: string[],
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    //eslint-disable-next-line
  ): any {
    if (!this.isMovesLeft(board)) {
      const score = this.evaluate(board);
      return { score, index: -1 };
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = -1;

      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = 'O';
          const { score } = this.minimax(board, depth + 1, alpha, beta, false);
          board[i] = '';

          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }

          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) {
            break;
          }
        }
      }
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = -1;

      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = 'X';
          const { score } = this.minimax(board, depth + 1, alpha, beta, true);
          board[i] = '';

          if (score < bestScore) {
            bestScore = score;
            bestMove = i;
          }

          beta = Math.min(beta, bestScore);
          if (beta <= alpha) {
            break;
          }
        }
      }
      return { score: bestScore, index: bestMove };
    }
  }
}
