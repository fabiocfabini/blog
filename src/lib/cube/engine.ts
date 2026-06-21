// A 3x3 Rubik's cube model that never drifts.
//
// We track the 26 visible "cubies" (the center of the cube is hidden). Each
// cubie has an integer grid position in {-1,0,1}^3 and an integer 3x3 rotation
// matrix for its orientation. Every move is a 90-degree integer rotation, so the
// state is always exact: replaying the inverse of any sequence returns to a
// bit-for-bit solved cube. That exactness is what lets the background loop apply
// a pattern and then perfectly un-apply it forever.
//
// This module is pure (no DOM) so it can be unit-tested in Node and reused by the
// browser renderer.

export type Vec = [number, number, number];
export type Mat = [Vec, Vec, Vec]; // rows

// Axis index: 0 = x, 1 = y, 2 = z.
export const AXIS_VEC: Mat = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// Integer products like 0 * -1 yield -0; collapse it to 0 so state stays clean.
const nz = (n: number) => (n === 0 ? 0 : n);

export function matVec(m: Mat, v: Vec): Vec {
  return [nz(dot(m[0], v)), nz(dot(m[1], v)), nz(dot(m[2], v))];
}

export function matMul(a: Mat, b: Mat): Mat {
  const out: number[][] = [];
  for (let i = 0; i < 3; i++) {
    out[i] = [];
    for (let j = 0; j < 3; j++) {
      out[i][j] = nz(a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]);
    }
  }
  return out as Mat;
}

const IDENTITY: Mat = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

// Right-handed +90 degree rotation matrices about each axis.
const ROT_POS: Mat[] = [
  [
    [1, 0, 0],
    [0, 0, -1],
    [0, 1, 0],
  ], // about x
  [
    [0, 0, 1],
    [0, 1, 0],
    [-1, 0, 0],
  ], // about y
  [
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ], // about z
];

const transpose = (m: Mat): Mat =>
  [
    [m[0][0], m[1][0], m[2][0]],
    [m[0][1], m[1][1], m[2][1]],
    [m[0][2], m[1][2], m[2][2]],
  ] as Mat;

// 90-degree rotation about `axis`; sign +1 is right-handed, -1 is its inverse.
export function rot90(axis: number, sign: number): Mat {
  return sign >= 0 ? ROT_POS[axis] : transpose(ROT_POS[axis]);
}

// --- Faces & moves ---------------------------------------------------------

export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B' | 'M' | 'E' | 'S';

// axis: which axis the layer turns about. layer: which slice (-1, 0, +1).
// sign: right-handed rotation sign for ONE clockwise (outside view) turn.
export const FACES: Record<Face, { axis: number; layer: number; sign: number }> = {
  R: { axis: 0, layer: 1, sign: -1 },
  L: { axis: 0, layer: -1, sign: 1 },
  U: { axis: 1, layer: 1, sign: -1 },
  D: { axis: 1, layer: -1, sign: 1 },
  F: { axis: 2, layer: 1, sign: -1 },
  B: { axis: 2, layer: -1, sign: 1 },
  M: { axis: 0, layer: 0, sign: 1 }, // follows L
  E: { axis: 1, layer: 0, sign: 1 }, // follows D
  S: { axis: 2, layer: 0, sign: -1 }, // follows F
};

export type Move = { face: Face; amount: 1 | -1 | 2 };

// A wide turn (e.g. "Fw") turns a face together with the middle slice beside it.
// Each face maps to that slice plus whether the slice turns with the face (+1)
// or against it (-1) — a consequence of how M/E/S are defined to follow L/D/F.
const WIDE: Record<string, { slice: Face; dir: 1 | -1 }> = {
  R: { slice: 'M', dir: -1 },
  L: { slice: 'M', dir: 1 },
  U: { slice: 'E', dir: -1 },
  D: { slice: 'E', dir: 1 },
  F: { slice: 'S', dir: 1 },
  B: { slice: 'S', dir: -1 },
};

// Parse standard notation: "U R' F2 M2 E2 S2 Fw Rw'" -> Move[]. A wide move
// expands into the face turn followed by its slice turn.
export function parseMoves(notation: string): Move[] {
  const tokens = notation.trim().split(/\s+/).filter(Boolean);
  const moves: Move[] = [];
  for (const tok of tokens) {
    const face = tok[0] as Face;
    if (!(face in FACES)) throw new Error(`Unknown move: "${tok}"`);
    let mod = tok.slice(1);
    const wide = mod[0] === 'w';
    if (wide) mod = mod.slice(1);
    const amount: Move['amount'] = mod === "'" ? -1 : mod === '2' ? 2 : 1;
    if (mod && mod !== "'" && mod !== '2') throw new Error(`Bad modifier: "${tok}"`);
    moves.push({ face, amount });
    if (wide) {
      const w = WIDE[face];
      if (!w) throw new Error(`Cannot widen: "${tok}"`);
      moves.push({ face: w.slice, amount: amount === 2 ? 2 : ((amount * w.dir) as Move['amount']) });
    }
  }
  return moves;
}

// Reverse a sequence so the cube returns to where it started: play it backwards
// and invert each turn (quarter turns flip direction, half turns are their own).
export function invert(moves: Move[]): Move[] {
  return moves
    .slice()
    .reverse()
    .map((m) => ({ face: m.face, amount: (m.amount === 2 ? 2 : -m.amount) as Move['amount'] }));
}

// --- Cubies ----------------------------------------------------------------

export type FaceColor = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
export type Sticker = { dir: Vec; color: FaceColor }; // dir is the cubie-local face

export interface Cubie {
  position: Vec;
  orientation: Mat;
  stickers: Sticker[];
}

const DIRS: Vec[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

// Which face color points along a given world direction in the solved cube.
function colorForDir(d: Vec): FaceColor {
  if (d[0] === 1) return 'R';
  if (d[0] === -1) return 'L';
  if (d[1] === 1) return 'U';
  if (d[1] === -1) return 'D';
  if (d[2] === 1) return 'F';
  return 'B';
}

const eq = (a: Vec, b: Vec) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

// The axis a unit direction points along, and its sign (+1/-1).
const dirAxis = (d: Vec) => (d[0] !== 0 ? 0 : d[1] !== 0 ? 1 : 2);
const dirSign = (d: Vec) => d[dirAxis(d)];

export function makeSolved(): Cubie[] {
  const cubies: Cubie[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue; // hidden core
        const position: Vec = [x, y, z];
        // A sticker sits on each exterior face of this cubie (the faces whose
        // direction matches where the cubie touches the cube's surface). Its
        // color is glued on for life, stored in the cubie's local frame.
        const stickers: Sticker[] = DIRS.filter(
          (d) => position[dirAxis(d)] === dirSign(d),
        ).map((d) => ({ dir: d.slice() as Vec, color: colorForDir(d) }));
        cubies.push({ position, orientation: IDENTITY.map((r) => r.slice()) as Mat, stickers });
      }
    }
  }
  return cubies;
}

// Apply one move in place. We rotate every cubie in the selected layer, updating
// both its grid position and its orientation by the same integer rotation.
export function applyMove(cubies: Cubie[], move: Move): void {
  const { axis, layer, sign } = FACES[move.face];
  const m = rot90(axis, sign);
  const times = move.amount === 2 ? 2 : move.amount === -1 ? 3 : 1;
  for (let t = 0; t < times; t++) {
    for (const cubie of cubies) {
      if (cubie.position[axis] !== layer) continue;
      cubie.position = matVec(m, cubie.position);
      cubie.orientation = matMul(m, cubie.orientation);
    }
  }
}

export function applyMoves(cubies: Cubie[], moves: Move[]): void {
  for (const move of moves) applyMove(cubies, move);
}

// True when every face shows a single color (the visible definition of solved).
export function isSolved(cubies: Cubie[]): boolean {
  for (const D of DIRS) {
    const axis = dirAxis(D);
    const sign = dirSign(D);
    let color: FaceColor | null = null;
    for (const cubie of cubies) {
      if (cubie.position[axis] !== sign) continue;
      const sticker = cubie.stickers.find((s) => eq(matVec(cubie.orientation, s.dir), D));
      if (!sticker) continue;
      if (color === null) color = sticker.color;
      else if (color !== sticker.color) return false;
    }
  }
  return true;
}
