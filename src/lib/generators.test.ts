import { lorem } from './lorem';
import { randomString } from './randomString';
import { hashText } from './hash';

describe('lorem', () => {
  it('generates the requested number of words', () => {
    expect(lorem(7, 'words').split(' ')).toHaveLength(7);
  });
  it('starts with Lorem ipsum', () => {
    expect(lorem(5, 'words')).toMatch(/^Lorem ipsum/);
  });
  it('generates paragraphs separated by blank lines', () => {
    expect(lorem(3, 'paragraphs').split('\n\n')).toHaveLength(3);
  });
});

describe('randomString', () => {
  it('respects length and charset', () => {
    const s = randomString(32, { lower: true, upper: false, digits: true, symbols: false });
    expect(s).toHaveLength(32);
    expect(s).toMatch(/^[a-z0-9]+$/);
  });
  it('returns empty string when no charset selected', () => {
    expect(randomString(10, { lower: false, upper: false, digits: false, symbols: false })).toBe('');
  });
});

describe('hashText', () => {
  it('computes SHA-256 of "abc"', async () => {
    expect(await hashText('abc', 'SHA-256')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
  });
  it('computes MD5 of "abc"', async () => {
    expect(await hashText('abc', 'MD5')).toBe('900150983cd24fb0d6963f7d28e17f72');
  });
});
