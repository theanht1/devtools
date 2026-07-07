export function matchesQuery(hay: string, query: string): boolean {
  const h = hay.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((p) => p !== '')
    .every((part) => h.includes(part));
}
