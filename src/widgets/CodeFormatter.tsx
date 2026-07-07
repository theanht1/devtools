import { useState } from 'react';
import { formatCode, FORMAT_LANGS, type FormatLang } from '../lib/format';
import { Button, Select, Textarea } from '../components/ui';

export default function CodeFormatter() {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState<FormatLang>('javascript');
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    try {
      setCode(await formatCode(code, lang));
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
        <Select value={lang} onChange={(e) => setLang(e.target.value as FormatLang)}>
          {FORMAT_LANGS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </Select>
        <Button onClick={run} title="⌘⏎">Format</Button>
        <Button className="px-2 py-0.5 text-xs" onClick={() => navigator.clipboard.writeText(code)}>Copy</Button>
      </div>
      <Textarea
        className="min-h-24 grow basis-auto"
        spellCheck={false}
        placeholder="Paste code…"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
    </div>
  );
}
