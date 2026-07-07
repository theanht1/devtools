import { useMemo, useState } from 'react';
import { Input, Textarea } from '../components/ui';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');

  const result = useMemo(() => {
    if (!pattern) return { error: null, matches: [] as RegExpMatchArray[] };
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      return { error: null, matches: [...text.matchAll(re)] };
    } catch (e) {
      return { error: (e as Error).message, matches: [] };
    }
  }, [pattern, flags, text]);

  // highlight matches by splitting the text
  const highlighted = useMemo(() => {
    if (result.error || result.matches.length === 0) return null;
    const parts: React.ReactNode[] = [];
    let last = 0;
    result.matches.forEach((m, i) => {
      const idx = m.index ?? 0;
      if (m[0] === '') return; // avoid infinite-ish empty matches noise
      parts.push(text.slice(last, idx), <mark key={i} className="rounded-sm bg-accent/25 text-inherit">{m[0]}</mark>);
      last = idx + m[0].length;
    });
    parts.push(text.slice(last));
    return parts;
  }, [result, text]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <Input
          style={{ flex: 3 }}
          placeholder="pattern"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />
        <Input
          style={{ flex: 1 }}
          placeholder="flags"
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
        />
      </div>
      <Textarea className="min-h-24 grow basis-auto" placeholder="Test string…" value={text} onChange={(e) => setText(e.target.value)} />
      {result.error && <div className="text-xs whitespace-pre-wrap text-danger">{result.error}</div>}
      {!result.error && (
        <div className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all font-mono text-xs">
          {highlighted ?? (pattern ? 'No matches' : '')}
          {result.matches.some((m) => m.length > 1) && (
            <table>
              <tbody>
                {result.matches.map((m, i) => (
                  <tr key={i}>
                    <td>#{i}</td>
                    {[...m].map((g, j) => (
                      <td key={j}>{g}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
