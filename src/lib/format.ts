import * as prettier from 'prettier/standalone';
import type { Plugin } from 'prettier';
import * as pluginBabel from 'prettier/plugins/babel';
import * as pluginEstree from 'prettier/plugins/estree';
import * as pluginTs from 'prettier/plugins/typescript';
import * as pluginPostcss from 'prettier/plugins/postcss';
import * as pluginHtml from 'prettier/plugins/html';
import * as pluginMarkdown from 'prettier/plugins/markdown';
import * as pluginYaml from 'prettier/plugins/yaml';
import * as pluginXml from '@prettier/plugin-xml';
import { format as formatSql } from 'sql-formatter';

export type FormatLang =
  | 'javascript' | 'typescript' | 'json' | 'css' | 'scss' | 'less'
  | 'html' | 'markdown' | 'yaml' | 'xml' | 'sql';

export const FORMAT_LANGS: FormatLang[] = [
  'javascript', 'typescript', 'json', 'css', 'scss', 'less',
  'html', 'markdown', 'yaml', 'xml', 'sql',
];

const estree = pluginEstree as unknown as Plugin;

const PRETTIER: Partial<Record<FormatLang, { parser: string; plugins: Plugin[] }>> = {
  javascript: { parser: 'babel', plugins: [pluginBabel, estree] },
  typescript: { parser: 'typescript', plugins: [pluginTs, estree] },
  json: { parser: 'json', plugins: [pluginBabel, estree] },
  css: { parser: 'css', plugins: [pluginPostcss] },
  scss: { parser: 'scss', plugins: [pluginPostcss] },
  less: { parser: 'less', plugins: [pluginPostcss] },
  html: { parser: 'html', plugins: [pluginHtml] },
  markdown: { parser: 'markdown', plugins: [pluginMarkdown] },
  yaml: { parser: 'yaml', plugins: [pluginYaml] },
  xml: { parser: 'xml', plugins: [pluginXml as unknown as Plugin] },
};

export async function formatCode(code: string, lang: FormatLang): Promise<string> {
  if (lang === 'sql') return formatSql(code, { keywordCase: 'upper' });
  const cfg = PRETTIER[lang]!;
  return prettier.format(code, { parser: cfg.parser, plugins: cfg.plugins });
}
