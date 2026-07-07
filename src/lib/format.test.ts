import { formatCode } from './format';

describe('formatCode', () => {
  it('formats javascript', async () => {
    expect(await formatCode('const x={a:1,b:2}', 'javascript')).toBe('const x = { a: 1, b: 2 };\n');
  });
  it('formats json', async () => {
    expect(await formatCode('{"a":1}', 'json')).toBe('{ "a": 1 }\n');
  });
  it('formats sql', async () => {
    expect(await formatCode('select a,b from t where x=1', 'sql')).toContain('SELECT');
  });
  it('formats xml', async () => {
    expect(await formatCode('<a><b>1</b></a>', 'xml')).toContain('<b>');
  });
  it('throws a useful error on bad input', async () => {
    await expect(formatCode('const const', 'javascript')).rejects.toThrow();
  });
});
