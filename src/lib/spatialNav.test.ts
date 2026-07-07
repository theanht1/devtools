import { findNeighbor, type Rect } from './spatialNav';

// ┌ a(0,0 4x4) ┬ b(4,0 4x4) ┐
// └ c(0,4 4x4) ┴ d(4,4 4x4) ┘
const grid: Rect[] = [
  { i: 'a', x: 0, y: 0, w: 4, h: 4 },
  { i: 'b', x: 4, y: 0, w: 4, h: 4 },
  { i: 'c', x: 0, y: 4, w: 4, h: 4 },
  { i: 'd', x: 4, y: 4, w: 4, h: 4 },
];

describe('findNeighbor', () => {
  it('moves right/left/down/up to adjacent widgets', () => {
    expect(findNeighbor('a', grid, 'right')).toBe('b');
    expect(findNeighbor('b', grid, 'left')).toBe('a');
    expect(findNeighbor('a', grid, 'down')).toBe('c');
    expect(findNeighbor('c', grid, 'up')).toBe('a');
  });

  it('prefers aligned widgets over diagonal ones', () => {
    expect(findNeighbor('a', grid, 'right')).toBe('b'); // not d
  });

  it('returns null at edges and for unknown ids', () => {
    expect(findNeighbor('a', grid, 'left')).toBeNull();
    expect(findNeighbor('a', grid, 'up')).toBeNull();
    expect(findNeighbor('zzz', grid, 'right')).toBeNull();
  });

  it('falls back to first widget when fromId is null-ish target list', () => {
    expect(findNeighbor('a', [grid[0]], 'right')).toBeNull();
  });
});
