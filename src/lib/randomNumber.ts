export function randomNumbers(min: number, max: number, count: number): number[] {
  const lo = Math.trunc(min);
  const hi = Math.trunc(max);
  if (lo > hi) throw new Error('Min must be less than or equal to max');
  const n = Math.min(Math.max(Math.trunc(count) || 1, 1), 1000);
  const range = hi - lo + 1;
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  return Array.from(buf, (v) => lo + (v % range));
}
