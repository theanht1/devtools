import { parseTimestamp, formatDate } from './timestamp';

describe('parseTimestamp', () => {
  it('auto-detects seconds', () => {
    expect(parseTimestamp('1700000000').getTime()).toBe(1700000000000);
  });
  it('auto-detects milliseconds', () => {
    expect(parseTimestamp('1700000000000').getTime()).toBe(1700000000000);
  });
  it('throws on non-numeric input', () => {
    expect(() => parseTimestamp('yesterday')).toThrow();
  });
});

describe('formatDate', () => {
  it('formats a known instant', () => {
    const f = formatDate(new Date(1700000000000));
    expect(f.iso).toBe('2023-11-14T22:13:20.000Z');
    expect(f.unixSeconds).toBe(1700000000);
    expect(f.relative).toMatch(/ago/);
  });
});
