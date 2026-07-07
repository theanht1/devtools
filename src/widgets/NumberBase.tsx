import { useState } from 'react';
import { convertNumber } from '../lib/numberBase';
import { Input } from '../components/ui';

const BASES = [
  { base: 2 as const, label: 'Binary', key: 'bin' as const },
  { base: 8 as const, label: 'Octal', key: 'oct' as const },
  { base: 10 as const, label: 'Decimal', key: 'dec' as const },
  { base: 16 as const, label: 'Hex', key: 'hex' as const },
];

export default function NumberBase() {
  const [values, setValues] = useState({ bin: '', oct: '', dec: '', hex: '' });
  const [error, setError] = useState<string | null>(null);

  const onChange = (base: 2 | 8 | 10 | 16, v: string) => {
    const key = BASES.find((b) => b.base === base)!.key;
    if (v.trim() === '') {
      setValues({ bin: '', oct: '', dec: '', hex: '' });
      setError(null);
      return;
    }
    try {
      setValues(convertNumber(v, base));
      setError(null);
    } catch (e) {
      setValues({ ...values, [key]: v });
      setError((e as Error).message);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      {BASES.map(({ base, label, key }) => (
        <label key={base} className="flex flex-wrap items-center gap-1.5">
          <span style={{ width: 60 }}>{label}</span>
          <Input className="font-mono" style={{ flex: 1 }} value={values[key]}
            onChange={(e) => onChange(base, e.target.value)} />
        </label>
      ))}
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
    </div>
  );
}
