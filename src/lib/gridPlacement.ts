export interface GridRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * First-fit placement: scan rows top-to-bottom, columns left-to-right, and
 * return the first position where a w×h widget fits without overlapping.
 * Falls back to a new row below everything.
 */
export function findFreePosition(grid: GridRect[], w: number, h: number, cols = 12): { x: number; y: number } {
  const maxY = grid.reduce((m, g) => Math.max(m, g.y + g.h), 0);
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x + w <= cols; x++) {
      const collides = grid.some(
        (g) => x < g.x + g.w && g.x < x + w && y < g.y + g.h && g.y < y + h
      );
      if (!collides) return { x, y };
    }
  }
  return { x: 0, y: maxY };
}
