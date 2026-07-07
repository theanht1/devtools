import { useState } from 'react';
import { parseColor, rgbToHex, rgbToHsl, formatRgb, formatHsl, type Rgb } from '../lib/colors';
import { Button, Input } from '../components/ui';

export default function ColorConverter() {
  const [rgb, setRgb] = useState<Rgb>({ r: 37, g: 99, b: 235 });
  const [text, setText] = useState<{ hex: string; rgb: string; hsl: string }>({
    hex: '#2563eb', rgb: 'rgb(37, 99, 235)', hsl: formatHsl(rgbToHsl({ r: 37, g: 99, b: 235 })),
  });
  const [error, setError] = useState<string | null>(null);

  const apply = (c: Rgb) => {
    setRgb(c);
    setText({ hex: rgbToHex(c), rgb: formatRgb(c), hsl: formatHsl(rgbToHsl(c)) });
    setError(null);
  };

  const onText = (key: 'hex' | 'rgb' | 'hsl', v: string) => {
    setText({ ...text, [key]: v });
    const c = parseColor(v);
    if (c) {
      setRgb(c);
      const next = { hex: rgbToHex(c), rgb: formatRgb(c), hsl: formatHsl(rgbToHsl(c)) };
      setText({ ...next, [key]: v }); // keep what the user is typing
      setError(null);
    } else {
      setError(`Cannot parse "${v}"`);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <input type="color" className="h-7 w-9 cursor-pointer rounded-md border border-border bg-transparent" value={rgbToHex(rgb)}
          onChange={(e) => apply(parseColor(e.target.value)!)} />
        <div className="h-7 w-12 rounded-md border border-border" style={{ background: rgbToHex(rgb) }} />
      </div>
      {(['hex', 'rgb', 'hsl'] as const).map((k) => (
        <label key={k} className="flex flex-wrap items-center gap-1.5">
          <span style={{ width: 32 }}>{k}</span>
          <Input className="font-mono" style={{ flex: 1 }} value={text[k]}
            onChange={(e) => onText(k, e.target.value)} />
          <Button className="px-2 py-0.5 text-xs" onClick={() => navigator.clipboard.writeText(text[k])}>Copy</Button>
        </label>
      ))}
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
    </div>
  );
}
