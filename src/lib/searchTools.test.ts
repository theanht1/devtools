import { matchesQuery } from './searchTools';

describe('matchesQuery', () => {
  it('matches multi-word queries case-insensitively', () => {
    expect(matchesQuery('Regex Tester regexp match pattern', 'reg TEST')).toBe(true);
    expect(matchesQuery('Regex Tester regexp match pattern', 'regex json')).toBe(false);
  });
  it('empty or whitespace query matches everything', () => {
    expect(matchesQuery('anything', '')).toBe(true);
    expect(matchesQuery('anything', '   ')).toBe(true);
  });
});
