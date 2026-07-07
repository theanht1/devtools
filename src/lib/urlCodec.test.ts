import { encodeUrl, decodeUrl } from './urlCodec';

describe('urlCodec', () => {
  it('component mode encodes reserved chars', () => {
    expect(encodeUrl('a b&c=d', 'component')).toBe('a%20b%26c%3Dd');
  });
  it('full mode keeps URL structure', () => {
    expect(encodeUrl('https://x.com/a b', 'full')).toBe('https://x.com/a%20b');
  });
  it('decodes back', () => {
    expect(decodeUrl('a%20b%26c', 'component')).toBe('a b&c');
  });
  it('throws on malformed escape', () => {
    expect(() => decodeUrl('%E0%A4%A', 'component')).toThrow();
  });
});
