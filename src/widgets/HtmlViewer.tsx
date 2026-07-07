import { useState } from 'react';
import { Textarea } from '../components/ui';

export default function HtmlViewer() {
  const [html, setHtml] = useState('<h1>Hello</h1>');
  const [allowScripts, setAllowScripts] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <Textarea className="min-h-24 grow basis-auto" value={html} onChange={(e) => setHtml(e.target.value)} />
      <label className="flex items-center gap-1 text-[13px]">
        <input type="checkbox" className="accent-accent" checked={allowScripts} onChange={(e) => setAllowScripts(e.target.checked)} />
        allow scripts (sandboxed)
      </label>
      <iframe
        title="HTML preview"
        className="min-h-0 flex-1 rounded-md border border-border bg-white"
        sandbox={allowScripts ? 'allow-scripts' : ''}
        srcDoc={html}
      />
    </div>
  );
}
