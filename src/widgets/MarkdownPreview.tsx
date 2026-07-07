import { useMemo, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Textarea } from '../components/ui';

export default function MarkdownPreview() {
  const [md, setMd] = useState('# Hello\n\nType **markdown** here.');
  const html = useMemo(() => DOMPurify.sanitize(marked.parse(md, { async: false })), [md]);

  return (
    <div className="flex h-full min-h-0 flex-row gap-2">
      <Textarea className="min-h-24 min-w-0 flex-1 self-start" value={md} onChange={(e) => setMd(e.target.value)} />
      <div
        className="min-w-0 flex-1 overflow-auto text-[13px] [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-semibold [&_p]:my-1 [&_code]:font-mono [&_code]:text-xs [&_pre]:bg-black/5 dark:[&_pre]:bg-white/10 [&_pre]:p-2 [&_pre]:rounded-md [&_a]:text-accent [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
