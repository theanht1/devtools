import { useState } from 'react';
import { textStats } from '../lib/textStats';
import { Textarea } from '../components/ui';

export default function WordCounter() {
  const [text, setText] = useState('');
  const s = textStats(text);
  const rows: [string, number][] = [
    ['Characters', s.chars],
    ['Characters (no spaces)', s.charsNoSpaces],
    ['Words', s.words],
    ['Lines', s.lines],
    ['Sentences', s.sentences],
    ['Paragraphs', s.paragraphs],
  ];
  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <Textarea className="min-h-24 grow basis-auto" placeholder="Paste text…" value={text} onChange={(e) => setText(e.target.value)} />
      <div>
        {rows.map(([label, n]) => (
          <div className="flex items-center justify-between border-b border-dashed border-border py-0.5" key={label}>
            <span>{label}</span>
            <strong>{n}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
