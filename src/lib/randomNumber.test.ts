import { randomNumbers } from './randomNumber';

describe('randomNumbers', () => {
  it('stays within the inclusive range', () => {
    const out = randomNumbers(5, 7, 200);
    expect(out).toHaveLength(200);
    expect(out.every((n) => n >= 5 && n <= 7)).toBe(true);
    expect(new Set(out).size).toBeGreaterThan(1); // hits more than one value
  });

  it('handles a single-value range', () => {
    expect(randomNumbers(4, 4, 3)).toEqual([4, 4, 4]);
  });

  it('clamps count to [1, 1000]', () => {
    expect(randomNumbers(0, 9, 0)).toHaveLength(1);
    expect(randomNumbers(0, 9, 5000)).toHaveLength(1000);
  });

  it('throws when min > max', () => {
    expect(() => randomNumbers(10, 1, 1)).toThrow(/min/i);
  });
});
