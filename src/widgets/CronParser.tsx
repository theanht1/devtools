import { useMemo, useState } from 'react';
import { parseExpression } from 'cron-parser';
import cronstrue from 'cronstrue';
import { Input } from '../components/ui';

export default function CronParser() {
  const [expr, setExpr] = useState('*/15 * * * *');

  const result = useMemo(() => {
    if (!expr.trim()) return null;
    try {
      const human = cronstrue.toString(expr);
      const it = parseExpression(expr);
      const next = Array.from({ length: 5 }, () => it.next().toDate());
      return { human, next, error: null };
    } catch (e) {
      return { human: '', next: [], error: String((e as Error).message ?? e) };
    }
  }, [expr]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <Input className="font-mono" placeholder="*/15 * * * *"
        value={expr} onChange={(e) => setExpr(e.target.value)} />
      {result?.error && <div className="text-xs whitespace-pre-wrap text-danger">{result.error}</div>}
      {result && !result.error && (
        <>
          <div>{result.human}</div>
          <strong>Next 5 runs</strong>
          <div className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all font-mono text-xs">
            {result.next.map((d, i) => (
              <div key={i}>{d.toLocaleString()}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
