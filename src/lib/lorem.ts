const WORDS =
  `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum`.split(' ');

function word(i: number): string {
  return WORDS[i % WORDS.length];
}

function sentence(seed: number): string {
  const len = 8 + (seed % 7);
  const ws = Array.from({ length: len }, (_, i) => word(seed + i));
  const s = ws.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

export function lorem(count: number, unit: 'words' | 'sentences' | 'paragraphs'): string {
  if (count <= 0) return '';
  if (unit === 'words') {
    const ws = Array.from({ length: count }, (_, i) => word(i));
    return ws.join(' ').replace(/^lorem ipsum/, 'Lorem ipsum');
  }
  if (unit === 'sentences') {
    return Array.from({ length: count }, (_, i) => sentence(i * 5)).join(' ').replace(/^Lorem?/, 'Lorem');
  }
  return Array.from({ length: count }, (_, p) =>
    Array.from({ length: 4 }, (_, i) => sentence(p * 20 + i * 5)).join(' ')
  ).join('\n\n');
}
