export interface TextStats {
  chars: number;
  charsNoSpaces: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
}

export function textStats(text: string): TextStats {
  if (text === '') {
    return { chars: 0, charsNoSpaces: 0, words: 0, lines: 0, sentences: 0, paragraphs: 0 };
  }
  const words = text.match(/\S+/g) ?? [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim() !== '');
  return {
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    words: words.length,
    lines: text.split('\n').length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
  };
}
