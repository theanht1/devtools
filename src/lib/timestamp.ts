export function parseTimestamp(input: string): Date {
  const v = input.trim();
  if (!/^-?\d+$/.test(v)) throw new Error(`"${input}" is not a unix timestamp`);
  const n = Number(v);
  // >= 1e12 (or <= -1e12) means it's already milliseconds
  return new Date(Math.abs(n) >= 1e12 ? n : n * 1000);
}

export function formatDate(d: Date) {
  const ms = d.getTime();
  if (Number.isNaN(ms)) throw new Error('Invalid date');
  const diffSec = Math.round((ms - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
  const abs = Math.abs(diffSec);
  const relative =
    abs < 60 ? rtf.format(diffSec, 'second')
    : abs < 3600 ? rtf.format(Math.round(diffSec / 60), 'minute')
    : abs < 86400 ? rtf.format(Math.round(diffSec / 3600), 'hour')
    : rtf.format(Math.round(diffSec / 86400), 'day');
  return {
    iso: d.toISOString(),
    utc: d.toUTCString(),
    local: d.toLocaleString(),
    unixSeconds: Math.floor(ms / 1000),
    unixMillis: ms,
    relative,
  };
}
