import { useState } from 'react';
import { lorem } from '../lib/lorem';
import { randomString, type CharsetOpts } from '../lib/randomString';
import { hashText, type HashAlgo } from '../lib/hash';
import { randomNumbers } from '../lib/randomNumber';
import { Button, Input, Select, Textarea } from '../components/ui';

type Tab = 'lorem' | 'random' | 'uuid' | 'hash' | 'number';

function CopyButton({ text }: { text: string }) {
  return (
    <Button className="px-2 py-0.5 text-xs" disabled={!text} onClick={() => navigator.clipboard.writeText(text)}>
      Copy
    </Button>
  );
}

const MAX_RANDOM_LENGTH = 16384;

export default function Generators() {
  const [tab, setTab] = useState<Tab>('uuid');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loremCount, setLoremCount] = useState(3);
  const [loremUnit, setLoremUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [len, setLen] = useState(24);
  const [charsets, setCharsets] = useState<CharsetOpts>({ lower: true, upper: true, digits: true, symbols: false });
  const [uuidCount, setUuidCount] = useState(1);
  const [hashInput, setHashInput] = useState('');
  const [algo, setAlgo] = useState<HashAlgo>('SHA-256');
  const [numMin, setNumMin] = useState(1);
  const [numMax, setNumMax] = useState(100);
  const [numCount, setNumCount] = useState(1);

  const generate = async () => {
    try {
      if (tab === 'lorem') setOutput(lorem(loremCount, loremUnit));
      else if (tab === 'random') setOutput(randomString(Math.min(len, MAX_RANDOM_LENGTH), charsets));
      else if (tab === 'uuid')
        setOutput(Array.from({ length: uuidCount }, () => crypto.randomUUID()).join('\n'));
      else if (tab === 'number') setOutput(randomNumbers(numMin, numMax, numCount).join('\n'));
      else setOutput(await hashText(hashInput, algo));
      setError('');
    } catch (e) {
      setError((e as Error).message || 'Failed to generate.');
    }
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col gap-1.5"
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault();
          generate();
        }
      }}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {(['uuid', 'random', 'lorem', 'hash', 'number'] as Tab[]).map((t) => (
          <Button
            key={t}
            onClick={() => { setTab(t); setOutput(''); setError(''); }}
            aria-pressed={t === tab}
            className={t === tab ? 'bg-accent/10 text-accent border-accent/40' : undefined}
          >
            {t}
          </Button>
        ))}
      </div>
      {tab === 'lorem' && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Input type="number" min={1} style={{ width: 60 }} value={loremCount}
            onChange={(e) => setLoremCount(Number(e.target.value))} />
          <Select value={loremUnit} onChange={(e) => setLoremUnit(e.target.value as typeof loremUnit)}>
            <option>words</option><option>sentences</option><option>paragraphs</option>
          </Select>
        </div>
      )}
      {tab === 'random' && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Input type="number" min={1} max={MAX_RANDOM_LENGTH} style={{ width: 60 }} value={len}
            onChange={(e) => setLen(Math.min(Number(e.target.value), MAX_RANDOM_LENGTH))} />
          {(Object.keys(charsets) as (keyof CharsetOpts)[]).map((k) => (
            <label key={k} className="flex items-center gap-1 text-[13px]">
              <input type="checkbox" className="accent-accent" checked={charsets[k]}
                onChange={(e) => setCharsets({ ...charsets, [k]: e.target.checked })} /> {k}
            </label>
          ))}
        </div>
      )}
      {tab === 'uuid' && (
        <div className="flex flex-wrap items-center gap-1.5">
          <label className="flex items-center gap-1 text-[13px]">Count <Input type="number" min={1} max={100} style={{ width: 60 }} value={uuidCount}
            onChange={(e) => setUuidCount(Number(e.target.value))} /></label>
        </div>
      )}
      {tab === 'hash' && (
        <>
          <Textarea className="min-h-24 grow basis-auto" placeholder="Text to hash…" value={hashInput} onChange={(e) => setHashInput(e.target.value)} />
          <div className="flex flex-wrap items-center gap-1.5">
            <Select value={algo} onChange={(e) => setAlgo(e.target.value as HashAlgo)}>
              <option>MD5</option><option>SHA-1</option><option>SHA-256</option><option>SHA-512</option>
            </Select>
          </div>
        </>
      )}
      {tab === 'number' && (
        <div className="flex flex-wrap items-center gap-1.5">
          <label className="flex items-center gap-1 text-[13px]">Min
            <Input type="number" className="w-20" value={numMin} onChange={(e) => setNumMin(Number(e.target.value))} aria-label="Min" />
          </label>
          <label className="flex items-center gap-1 text-[13px]">Max
            <Input type="number" className="w-20" value={numMax} onChange={(e) => setNumMax(Number(e.target.value))} aria-label="Max" />
          </label>
          <label className="flex items-center gap-1 text-[13px]">Count
            <Input type="number" className="w-20" min={1} max={1000} value={numCount} onChange={(e) => setNumCount(Number(e.target.value))} aria-label="Count" />
          </label>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        <Button onClick={generate} title="⌘⏎">Generate</Button>
        <CopyButton text={output} />
      </div>
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
      <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all font-mono text-xs m-0">{output}</pre>
    </div>
  );
}
