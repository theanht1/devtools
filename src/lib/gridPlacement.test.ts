import { findFreePosition } from './gridPlacement';

describe('findFreePosition', () => {
  it('places in empty grid at origin', () => {
    expect(findFreePosition([], 4, 4)).toEqual({ x: 0, y: 0 });
  });

  it('fills the space next to an existing widget instead of appending below', () => {
    const grid = [{ x: 0, y: 0, w: 4, h: 6 }];
    expect(findFreePosition(grid, 4, 4)).toEqual({ x: 4, y: 0 });
  });

  it('fills a gap between widgets', () => {
    const grid = [
      { x: 0, y: 0, w: 4, h: 4 },
      { x: 8, y: 0, w: 4, h: 4 },
    ];
    expect(findFreePosition(grid, 4, 4)).toEqual({ x: 4, y: 0 });
  });

  it('skips gaps that are too narrow', () => {
    const grid = [
      { x: 0, y: 0, w: 4, h: 4 },
      { x: 6, y: 0, w: 6, h: 4 },
    ];
    // 2-wide gap at x=4 cannot fit w=4 → next free row
    expect(findFreePosition(grid, 4, 4)).toEqual({ x: 0, y: 4 });
  });

  it('falls back below everything when a full row is occupied', () => {
    const grid = [{ x: 0, y: 0, w: 12, h: 5 }];
    expect(findFreePosition(grid, 4, 4)).toEqual({ x: 0, y: 5 });
  });

  it('never exceeds the column count', () => {
    const grid = [{ x: 0, y: 0, w: 10, h: 4 }];
    // w=4 does not fit in the 2 remaining cols
    expect(findFreePosition(grid, 4, 4)).toEqual({ x: 0, y: 4 });
  });
});
