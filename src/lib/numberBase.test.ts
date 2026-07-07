import { convertNumber } from './numberBase';

describe('convertNumber', () => {
  it('converts decimal 255', () => {
    expect(convertNumber('255', 10)).toEqual({ bin: '11111111', oct: '377', dec: '255', hex: 'ff' });
  });
  it('converts hex input', () => {
    expect(convertNumber('FF', 16).dec).toBe('255');
  });
  it('handles values beyond Number.MAX_SAFE_INTEGER', () => {
    expect(convertNumber('18446744073709551615', 10).hex).toBe('ffffffffffffffff');
  });
  it('throws on invalid digits for the base', () => {
    expect(() => convertNumber('129', 8)).toThrow();
    expect(() => convertNumber('xyz', 16)).toThrow();
    expect(() => convertNumber('', 10)).toThrow();
  });
});
