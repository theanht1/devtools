import { useEffect, useState } from 'react';
import { parseTimestamp, formatDate } from '../lib/timestamp';
import { Button, Input } from '../components/ui';

export default function TimestampParser() {
  const [input, setInput] = useState('');
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<Date | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const onInput = (v: string) => {
    setInput(v);
    if (!v.trim()) {
      setParsed(null);
      setError(null);
      return;
    }
    try {
      // numeric → unix ts; otherwise let Date try to parse a date string
      const d = /^-?\d+$/.test(v.trim()) ? parseTimestamp(v) : new Date(v);
      if (Number.isNaN(d.getTime())) throw new Error(`Cannot parse "${v}"`);
      setParsed(d);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setParsed(null);
    }
  };

  const f = parsed ? formatDate(parsed) : null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <Input style={{ flex: 1 }} placeholder="Unix ts (s/ms) or date string…"
          value={input} onChange={(e) => onInput(e.target.value)} />
        <Button onClick={() => onInput(String(Math.floor(now / 1000)))}>Now</Button>
      </div>
      <div className="flex items-center justify-between border-b border-dashed border-border py-0.5"><span>Now (s)</span><strong>{Math.floor(now / 1000)}</strong></div>
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
      {f && (
        <div>
          <div className="flex items-center justify-between border-b border-dashed border-border py-0.5"><span>ISO</span><strong>{f.iso}</strong></div>
          <div className="flex items-center justify-between border-b border-dashed border-border py-0.5"><span>UTC</span><strong>{f.utc}</strong></div>
          <div className="flex items-center justify-between border-b border-dashed border-border py-0.5"><span>Local</span><strong>{f.local}</strong></div>
          <div className="flex items-center justify-between border-b border-dashed border-border py-0.5"><span>Unix (s)</span><strong>{f.unixSeconds}</strong></div>
          <div className="flex items-center justify-between border-b border-dashed border-border py-0.5"><span>Unix (ms)</span><strong>{f.unixMillis}</strong></div>
          <div className="flex items-center justify-between border-b border-dashed border-border py-0.5"><span>Relative</span><strong>{f.relative}</strong></div>
        </div>
      )}
    </div>
  );
}
