import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import YAML from 'yaml';
import Papa from 'papaparse';

export type DataFormat = 'json' | 'xml' | 'yaml' | 'csv';
export const DATA_FORMATS: DataFormat[] = ['json', 'xml', 'yaml', 'csv'];

function parse(input: string, from: DataFormat): unknown {
  switch (from) {
    case 'json':
      return JSON.parse(input);
    case 'yaml':
      return YAML.parse(input);
    case 'xml': {
      const valid = XMLValidator.validate(input);
      if (valid !== true) throw new Error(`Invalid XML: ${valid.err.msg}`);
      const obj = new XMLParser().parse(input) as Record<string, unknown>;
      // unwrap the synthetic <root> we add when building
      const keys = Object.keys(obj);
      return keys.length === 1 && keys[0] === 'root' ? obj['root'] : obj;
    }
    case 'csv': {
      const res = Papa.parse<Record<string, string>>(input.trim(), {
        header: true,
        skipEmptyLines: true,
      });
      if (res.errors.length > 0) throw new Error(`Invalid CSV: ${res.errors[0].message}`);
      return res.data;
    }
  }
}

function serialize(value: unknown, to: DataFormat): string {
  switch (to) {
    case 'json':
      return JSON.stringify(value, null, 2);
    case 'yaml':
      return YAML.stringify(value);
    case 'xml': {
      if (Array.isArray(value)) {
        // {root: array} would still emit repeated sibling <root> elements
        throw new Error('Cannot represent a top-level JSON array as XML; wrap it in an object');
      }
      const isPlainObject = value !== null && typeof value === 'object';
      const keys = isPlainObject ? Object.keys(value as object) : [];
      // A value may serve as the document root only if it is a plain non-array
      // object with exactly one key whose value is not an array (an array value
      // would make XMLBuilder emit repeated sibling root elements).
      const canBeRoot =
        isPlainObject &&
        keys.length === 1 &&
        !Array.isArray((value as Record<string, unknown>)[keys[0]]);
      const root = canBeRoot ? value : { root: value };
      return new XMLBuilder({ format: true }).build(root);
    }
    case 'csv': {
      if (!Array.isArray(value) || value.some((r) => typeof r !== 'object' || r === null)) {
        throw new Error('CSV output requires a JSON array of objects');
      }
      return Papa.unparse(value as object[]);
    }
  }
}

export function convert(input: string, from: DataFormat, to: DataFormat): string {
  return serialize(parse(input, from), to);
}
