import { useState } from 'react';
import { encodeBase64, decodeBase64 } from '../lib/base64';
import { Textarea } from '../components/ui';

export default function Base64Tool() {
  const [plain, setPlain] = useState('');
  const [encoded, setEncoded] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPlain = (v: string) => {
    setPlain(v);
    setEncoded(encodeBase64(v, urlSafe));
    setError(null);
  };
  const onEncoded = (v: string) => {
    setEncoded(v);
    try {
      setPlain(decodeBase64(v, urlSafe));
      setError(null);
    } catch {
      setError('Invalid base64 input');
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <label className="flex items-center gap-1 text-[13px]">
        <input type="checkbox" className="accent-accent" checked={urlSafe}
          onChange={(e) => { setUrlSafe(e.target.checked); setEncoded(encodeBase64(plain, e.target.checked)); setError(null); }} />
        URL-safe
      </label>
      <Textarea className="min-h-16 grow basis-auto" placeholder="Plain text" value={plain} onChange={(e) => onPlain(e.target.value)} />
      <Textarea className="min-h-16 grow basis-auto" placeholder="Base64" value={encoded} onChange={(e) => onEncoded(e.target.value)} />
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
    </div>
  );
}
