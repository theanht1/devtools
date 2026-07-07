export interface CharsetOpts {
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
}

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
};

export function randomString(length: number, opts: CharsetOpts): string {
  const pool = (Object.keys(SETS) as (keyof typeof SETS)[])
    .filter((k) => opts[k])
    .map((k) => SETS[k])
    .join('');
  if (!pool || length <= 0) return '';
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => pool[b % pool.length]).join('');
}
