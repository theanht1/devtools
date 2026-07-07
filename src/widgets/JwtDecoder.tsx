import { useMemo, useState } from 'react';
import { decodeJwt } from '../lib/jwt';
import { formatDate } from '../lib/timestamp';
import { Textarea } from '../components/ui';

export default function JwtDecoder() {
  const [token, setToken] = useState('');

  const result = useMemo(() => {
    if (!token.trim()) return null;
    try {
      return { ...decodeJwt(token), error: null };
    } catch (e) {
      return { header: null, payload: null, error: (e as Error).message };
    }
  }, [token]);

  const payload = result?.payload as Record<string, unknown> | null;
  const claims = ['iat', 'exp', 'nbf'].filter((c) => typeof payload?.[c] === 'number');

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <Textarea className="min-h-24 grow basis-auto" placeholder="Paste JWT… (decode only — signature is NOT verified)"
        value={token} onChange={(e) => setToken(e.target.value)} />
      {result?.error && <div className="text-xs whitespace-pre-wrap text-danger">{result.error}</div>}
      {result && !result.error && (
        <div className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all font-mono text-xs">
          <strong>Header</strong>
          <pre className="font-mono text-xs">{JSON.stringify(result.header, null, 2)}</pre>
          <strong>Payload</strong>
          <pre className="font-mono text-xs">{JSON.stringify(result.payload, null, 2)}</pre>
          {claims.map((c) => (
            <div key={c}>
              {c}: {formatDate(new Date((payload![c] as number) * 1000)).local} (
              {formatDate(new Date((payload![c] as number) * 1000)).relative})
            </div>
          ))}
          <div className="text-muted">⚠ Signature not verified</div>
        </div>
      )}
    </div>
  );
}
