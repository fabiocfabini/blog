import { describe, it, expect } from 'vitest';
import {
  makeSolved,
  applyMoves,
  parseMoves,
  invert,
  isSolved,
  PATTERNS,
} from './engine';

describe('cube engine', () => {
  it('starts solved with 26 cubies and 54 stickers', () => {
    const cube = makeSolved();
    expect(cube).toHaveLength(26);
    expect(cube.reduce((n, c) => n + c.stickers.length, 0)).toBe(54);
    expect(isSolved(cube)).toBe(true);
  });

  it('a single turn unsolves, and its inverse re-solves', () => {
    const cube = makeSolved();
    const moves = parseMoves('R');
    applyMoves(cube, moves);
    expect(isSolved(cube)).toBe(false);
    applyMoves(cube, invert(moves));
    expect(isSolved(cube)).toBe(true);
    expect(cube).toEqual(makeSolved()); // bit-for-bit, no drift
  });

  it('four identical quarter turns return to solved', () => {
    const cube = makeSolved();
    applyMoves(cube, parseMoves('U U U U'));
    expect(cube).toEqual(makeSolved());
  });

  it('every pattern is non-trivial and exactly reversible', () => {
    for (const { name, notation } of PATTERNS) {
      const cube = makeSolved();
      const moves = parseMoves(notation);
      applyMoves(cube, moves);
      expect(isSolved(cube), `${name} should scramble the cube`).toBe(false);
      applyMoves(cube, invert(moves));
      expect(cube, `${name} should reverse cleanly`).toEqual(makeSolved());
    }
  });

  it('the all-180 patterns are their own inverse', () => {
    for (const notation of ['M2 E2 S2', 'R2 L2 U2 D2 F2 B2']) {
      const cube = makeSolved();
      const moves = parseMoves(notation);
      applyMoves(cube, moves);
      applyMoves(cube, moves); // applied twice
      expect(cube).toEqual(makeSolved());
    }
  });

  it('rejects bad notation', () => {
    expect(() => parseMoves('R X')).toThrow();
    expect(() => parseMoves("R3")).toThrow();
  });
});
