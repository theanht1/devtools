export interface Rect {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Direction = 'left' | 'right' | 'up' | 'down';

export function findNeighbor(fromId: string, all: Rect[], dir: Direction): string | null {
  const from = all.find((r) => r.i === fromId);
  if (!from) return null;
  const cx = from.x + from.w / 2;
  const cy = from.y + from.h / 2;

  let best: string | null = null;
  let bestDist = Infinity;
  for (const r of all) {
    if (r.i === from.i) continue;
    const dx = r.x + r.w / 2 - cx;
    const dy = r.y + r.h / 2 - cy;
    const inDirection =
      dir === 'left' ? dx < 0 : dir === 'right' ? dx > 0 : dir === 'up' ? dy < 0 : dy > 0;
    if (!inDirection) continue;
    // Perpendicular offset is weighted so aligned neighbors beat diagonal ones.
    const dist =
      dir === 'left' || dir === 'right'
        ? Math.abs(dx) + Math.abs(dy) * 3
        : Math.abs(dy) + Math.abs(dx) * 3;
    if (dist < bestDist) {
      bestDist = dist;
      best = r.i;
    }
  }
  return best;
}
