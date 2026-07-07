import { lazy } from 'react';
import type { ToolDefinition } from './types';

export const TOOLS: ToolDefinition[] = [
  {
    id: 'regex-tester', title: 'Regex Tester', category: 'text',
    keywords: ['regexp', 'match', 'pattern', 'grep'],
    defaultSize: { w: 5, h: 8 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/RegexTester')),
  },
  {
    id: 'text-diff', title: 'Text Diff Checker', category: 'text',
    keywords: ['diff', 'compare', 'changes'],
    defaultSize: { w: 6, h: 8 }, minSize: { w: 4, h: 5 },
    component: lazy(() => import('../widgets/TextDiff')),
  },
  {
    id: 'word-counter', title: 'Word Counter', category: 'text',
    keywords: ['count', 'characters', 'lines', 'stats'],
    defaultSize: { w: 4, h: 8 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/WordCounter')),
  },
  {
    id: 'generators', title: 'Generators', category: 'text',
    keywords: ['lorem', 'ipsum', 'uuid', 'random', 'string', 'hash', 'md5', 'sha'],
    defaultSize: { w: 4, h: 8 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/Generators')),
  },
  {
    id: 'markdown-preview', title: 'Markdown Preview', category: 'text',
    keywords: ['markdown', 'md', 'render', 'preview'],
    defaultSize: { w: 8, h: 9 }, minSize: { w: 4, h: 5 },
    component: lazy(() => import('../widgets/MarkdownPreview')),
  },
  {
    id: 'html-viewer', title: 'HTML Viewer', category: 'web',
    keywords: ['html', 'preview', 'render'],
    defaultSize: { w: 6, h: 9 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/HtmlViewer')),
  },
  {
    id: 'url-codec', title: 'URL Encoder / Decoder', category: 'web',
    keywords: ['url', 'encode', 'decode', 'percent', 'uri'],
    defaultSize: { w: 4, h: 7 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/UrlCodec')),
  },
  {
    id: 'code-formatter', title: 'Code Formatter', category: 'coding',
    keywords: ['prettier', 'format', 'beautify', 'sql', 'xml'],
    defaultSize: { w: 6, h: 10 }, minSize: { w: 4, h: 6 },
    component: lazy(() => import('../widgets/CodeFormatter')),
  },
  {
    id: 'json-converter', title: 'JSON Converter', category: 'coding',
    keywords: ['json', 'xml', 'yaml', 'csv', 'convert'],
    defaultSize: { w: 6, h: 10 }, minSize: { w: 4, h: 6 },
    component: lazy(() => import('../widgets/JsonConverter')),
  },
  {
    id: 'image-resizer', title: 'Image Resizer', category: 'image',
    keywords: ['image', 'resize', 'scale', 'png', 'jpg'],
    defaultSize: { w: 4, h: 8 }, minSize: { w: 3, h: 6 },
    component: lazy(() => import('../widgets/ImageResizer')),
  },
  {
    id: 'image-converter', title: 'Image Format Converter', category: 'image',
    keywords: ['image', 'convert', 'jpg', 'png', 'jpeg'],
    defaultSize: { w: 4, h: 8 }, minSize: { w: 3, h: 6 },
    component: lazy(() => import('../widgets/ImageConverter')),
  },
  {
    id: 'base64', title: 'Base64 Encoder / Decoder', category: 'utility',
    keywords: ['base64', 'encode', 'decode', 'btoa', 'atob'],
    defaultSize: { w: 4, h: 7 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/Base64Tool')),
  },
  {
    id: 'number-base', title: 'Number Base Converter', category: 'utility',
    keywords: ['binary', 'hex', 'octal', 'decimal', 'radix'],
    defaultSize: { w: 4, h: 6 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/NumberBase')),
  },
  {
    id: 'color-converter', title: 'Color Converter', category: 'utility',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'picker'],
    defaultSize: { w: 4, h: 7 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/ColorConverter')),
  },
  {
    id: 'jwt-decoder', title: 'JWT Decoder', category: 'utility',
    keywords: ['jwt', 'token', 'auth', 'decode'],
    defaultSize: { w: 5, h: 9 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/JwtDecoder')),
  },
  {
    id: 'timestamp-parser', title: 'Unix Timestamp Parser', category: 'utility',
    keywords: ['unix', 'timestamp', 'epoch', 'date', 'time'],
    defaultSize: { w: 5, h: 8 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/TimestampParser')),
  },
  {
    id: 'cron-parser', title: 'Cron Expression Parser', category: 'utility',
    keywords: ['cron', 'schedule', 'crontab'],
    defaultSize: { w: 5, h: 8 }, minSize: { w: 3, h: 5 },
    component: lazy(() => import('../widgets/CronParser')),
  },
];

export function getTool(id: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.id === id);
}
