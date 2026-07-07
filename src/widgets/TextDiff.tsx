import { useMemo, useState } from 'react';
import { diffLines, diffWords } from 'diff';
import { Textarea } from '../components/ui';

export default function TextDiff() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [mode, setMode] = useState<'lines' | 'words'>('lines');

  const parts = useMemo(
    () => (mode === 'lines' ? diffLines(a, b) : diffWords(a, b)),
    [a, b, mode]
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <div className="flex flex-none flex-wrap items-stretch gap-1.5">
        <Textarea className="min-h-24 flex-1" placeholder="Original" value={a} onChange={(e) => setA(e.target.value)} />
        <Textarea className="min-h-24 flex-1" placeholder="Changed" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <label className="flex items-center gap-1 text-[13px]">
          <input type="radio" className="accent-accent" checked={mode === 'lines'} onChange={() => setMode('lines')} /> lines
        </label>
        <label className="flex items-center gap-1 text-[13px]">
          <input type="radio" className="accent-accent" checked={mode === 'words'} onChange={() => setMode('words')} /> words
        </label>
      </div>
      <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all font-mono text-xs m-0">
        {parts.map((p, i) => (
          <span
            key={i}
            style={{
              background: p.added ? 'rgba(34,197,94,.25)' : p.removed ? 'rgba(239,68,68,.25)' : undefined,
              textDecoration: p.removed ? 'line-through' : undefined,
            }}
          >
            {p.value}
          </span>
        ))}
      </pre>
    </div>
  );
}
