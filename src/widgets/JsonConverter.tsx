import { useState } from 'react';
import { convert, DATA_FORMATS, type DataFormat } from '../lib/jsonConvert';
import { Button, Select, Textarea } from '../components/ui';

export default function JsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [from, setFrom] = useState<DataFormat>('json');
  const [to, setTo] = useState<DataFormat>('yaml');
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    try {
      setOutput(convert(input, from, to));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col gap-1.5"
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault();
          run();
        }
      }}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <Select value={from} onChange={(e) => setFrom(e.target.value as DataFormat)}>
          {DATA_FORMATS.map((f) => <option key={f}>{f}</option>)}
        </Select>
        <button
          type="button"
          aria-label="Swap conversion direction"
          title="Swap"
          onClick={() => {
            setFrom(to);
            setTo(from);
            setInput(output);
            setOutput(input);
            setError(null);
          }}
          className="rounded-md px-1.5 py-0.5 text-muted transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          →
        </button>
        <Select value={to} onChange={(e) => setTo(e.target.value as DataFormat)}>
          {DATA_FORMATS.map((f) => <option key={f}>{f}</option>)}
        </Select>
        <Button onClick={run} title="⌘⏎">Convert</Button>
        <Button className="px-2 py-0.5 text-xs" onClick={() => navigator.clipboard.writeText(output)}>Copy</Button>
      </div>
      <Textarea className="min-h-24 grow basis-auto" spellCheck={false} placeholder="Input…" value={input} onChange={(e) => setInput(e.target.value)} />
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
      <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all font-mono text-xs m-0">{output}</pre>
    </div>
  );
}
