import { textStats } from './textStats';

describe('textStats', () => {
  it('counts an ordinary paragraph', () => {
    const s = textStats('Hello world. This is fine!\n\nNew paragraph here?');
    expect(s.words).toBe(8);
    expect(s.sentences).toBe(3);
    expect(s.paragraphs).toBe(2);
    expect(s.lines).toBe(3);
  });

  it('handles empty input', () => {
    expect(textStats('')).toEqual({
      chars: 0, charsNoSpaces: 0, words: 0, lines: 0, sentences: 0, paragraphs: 0,
    });
  });
});
