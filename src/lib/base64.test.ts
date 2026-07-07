import { encodeBase64, decodeBase64 } from './base64';

describe('base64', () => {
  it('round-trips unicode', () => {
    const s = 'héllo wörld 🎉';
    expect(decodeBase64(encodeBase64(s, false), false)).toBe(s);
  });
  it('encodes ascii to the expected value', () => {
    expect(encodeBase64('hello', false)).toBe('aGVsbG8=');
  });
  it('url-safe uses - and _ and no padding', () => {
    const out = encodeBase64('subjects?_d', true);
    expect(out).not.toMatch(/[+/=]/);
    expect(decodeBase64(out, true)).toBe('subjects?_d');
  });
  it('throws on invalid base64', () => {
    expect(() => decodeBase64('!!!not-base64!!!', false)).toThrow();
  });
});
