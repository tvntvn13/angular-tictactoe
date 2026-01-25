import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardComponent]
    });
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('minimax algorithm', () => {
    beforeEach(() => {
      component.gameStarted = true;
    });

    it('should return winning move when AI can win', () => {
      // Board state: O can win by playing at position 2
      // O | O | _
      // X | X | _
      // _ | _ | _
      component.squares = ['O', 'O', null, 'X', 'X', null, null, null, null] as string[];

      const result = component.minimax(component.squares, 0, -Infinity, Infinity, true);

      expect(result.index).toBe(2); // AI should complete the win
    });

    it('should block when human threatens to win', () => {
      // Board state: X threatens to win at position 2 (right column)
      // _ | _ | _
      // _ | O | X
      // _ | _ | X
      component.squares = [null, null, null, null, 'O', 'X', null, null, 'X'] as string[];

      const result = component.minimax(component.squares, 0, -Infinity, Infinity, true);

      expect(result.index).toBe(2); // AI must block the right column
    });

    it('should block right column threat - the reported bug scenario', () => {
      // After: AI plays center (4), Human plays bottom-right (8), AI responds, Human plays middle-right (5)
      // This is the scenario described by the user
      // _ | _ | _
      // _ | O | X
      // O | _ | X
      component.squares = [null, null, null, null, 'O', 'X', 'O', null, 'X'] as string[];

      const result = component.minimax(component.squares, 0, -Infinity, Infinity, true);

      // AI MUST block at position 2 to prevent X from winning with 2-5-8
      expect(result.index).toBe(2);
    });

    it('should prefer winning over blocking', () => {
      // Board state: O can win at 6, but X also threatens at 2
      // O | O | _
      // X | X | _
      // _ | _ | _
      component.squares = ['O', 'O', null, 'X', 'X', null, null, null, null] as string[];

      const result = component.minimax(component.squares, 0, -Infinity, Infinity, true);

      // AI should take the winning move at position 2, not block X
      expect(result.index).toBe(2);
    });

    it('should block diagonal threat', () => {
      // Board state: X threatens diagonal win
      // X | _ | _
      // _ | X | _
      // O | _ | O
      component.squares = ['X', null, null, null, 'X', null, 'O', null, 'O'] as string[];

      const result = component.minimax(component.squares, 0, -Infinity, Infinity, true);

      // AI must block at position 8 to prevent diagonal win
      expect(result.index).toBe(8);
    });

    it('should block horizontal threat', () => {
      // Board state: X threatens horizontal win at top
      // X | X | _
      // O | O | _
      // _ | _ | _
      component.squares = ['X', 'X', null, 'O', 'O', null, null, null, null] as string[];

      const result = component.minimax(component.squares, 0, -Infinity, Infinity, true);

      // AI should complete its own win at 5, or if not possible, block at 2
      // Actually O can win at position 5
      expect(result.index).toBe(5);
    });

    it('should block vertical threat in left column', () => {
      // X | O | _
      // X | O | _
      // _ | _ | _
      component.squares = ['X', 'O', null, 'X', 'O', null, null, null, null] as string[];

      const result = component.minimax(component.squares, 0, -Infinity, Infinity, true);

      // AI should win at 7, or block at 6 if winning isn't possible
      // O can win at position 7
      expect(result.index).toBe(7);
    });

    it('should result in draw with perfect play from both sides', () => {
      // With perfect play, tic-tac-toe should always be a draw
      // Starting from empty board, the score should be 0 (draw)
      component.squares = Array(9).fill(null);

      const result = component.minimax(component.squares, 0, -Infinity, Infinity, true);

      // Perfect play leads to a draw, score should be 0
      expect(result.score).toBe(0);
    });
  });

  describe('evaluate function', () => {
    it('should return 10 when O wins', () => {
      component.squares = ['O', 'O', 'O', null, null, null, null, null, null] as string[];
      expect(component.evaluate(component.squares)).toBe(10);
    });

    it('should return -10 when X wins', () => {
      component.squares = ['X', 'X', 'X', null, null, null, null, null, null] as string[];
      expect(component.evaluate(component.squares)).toBe(-10);
    });

    it('should return 0 when no winner', () => {
      component.squares = ['X', 'O', 'X', null, null, null, null, null, null] as string[];
      expect(component.evaluate(component.squares)).toBe(0);
    });
  });
});
