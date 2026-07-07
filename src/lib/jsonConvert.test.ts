import { convert } from './jsonConvert';

describe('convert', () => {
  it('json -> yaml -> json round trip', () => {
    const json = '{"name":"dev","tags":["a","b"],"n":3}';
    const yaml = convert(json, 'json', 'yaml');
    expect(yaml).toContain('name: dev');
    expect(JSON.parse(convert(yaml, 'yaml', 'json'))).toEqual(JSON.parse(json));
  });

  it('json -> xml -> json round trip (values become strings in xml)', () => {
    const xml = convert('{"user":{"name":"dev"}}', 'json', 'xml');
    expect(xml).toContain('<name>dev</name>');
    expect(JSON.parse(convert(xml, 'xml', 'json'))).toEqual({ user: { name: 'dev' } });
  });

  it('json array -> csv -> json round trip', () => {
    const json = '[{"a":"1","b":"x"},{"a":"2","b":"y"}]';
    const csv = convert(json, 'json', 'csv');
    expect(csv.split('\n')[0].trim()).toBe('a,b');
    expect(JSON.parse(convert(csv, 'csv', 'json'))).toEqual(JSON.parse(json));
  });

  it('throws on invalid json', () => {
    expect(() => convert('{oops', 'json', 'yaml')).toThrow();
  });

  it('throws when csv target is not an array of objects', () => {
    expect(() => convert('{"a":1}', 'json', 'csv')).toThrow(/array/i);
  });

  it('throws when converting a top-level json array to xml', () => {
    expect(() => convert('[{"a":"1"}]', 'json', 'xml')).toThrow(/array/i);
  });

  it('single-key object with array value -> xml wraps in root and round-trips', () => {
    // non-numeric strings: fast-xml-parser would coerce "1"/"2" back to numbers
    const original = { items: [{ x: 'a' }, { x: 'b' }] };
    const xml = convert(JSON.stringify(original), 'json', 'xml');
    expect(JSON.parse(convert(xml, 'xml', 'json'))).toEqual(original);
  });
});
