import { useState } from 'react';
import { encodeUrl, decodeUrl, type UrlMode } from '../lib/urlCodec';
import { Textarea } from '../components/ui';

export default function UrlCodec() {
  const [decoded, setDecoded] = useState('');
  const [encoded, setEncoded] = useState('');
  const [mode, setMode] = useState<UrlMode>('component');
  const [error, setError] = useState<string | null>(null);

  const onDecodedChange = (v: string) => {
    setDecoded(v);
    setError(null);
    setEncoded(encodeUrl(v, mode));
  };
  const onEncodedChange = (v: string) => {
    setEncoded(v);
    try {
      setDecoded(decodeUrl(v, mode));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <label className="flex items-center gap-1 text-[13px]"><input type="radio" className="accent-accent" checked={mode === 'component'} onChange={() => setMode('component')} /> component</label>
        <label className="flex items-center gap-1 text-[13px]"><input type="radio" className="accent-accent" checked={mode === 'full'} onChange={() => setMode('full')} /> full URL</label>
      </div>
      <Textarea className="min-h-16 grow basis-auto" placeholder="Decoded" value={decoded} onChange={(e) => onDecodedChange(e.target.value)} />
      <Textarea className="min-h-16 grow basis-auto" placeholder="Encoded" value={encoded} onChange={(e) => onEncodedChange(e.target.value)} />
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
    </div>
  );
}
