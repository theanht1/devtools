function b64urlDecode(part: string): string {
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, '=');
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function decodeJwt(token: string): { header: unknown; payload: unknown } {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('A JWT must have 3 dot-separated parts');
  return {
    header: JSON.parse(b64urlDecode(parts[0])),
    payload: JSON.parse(b64urlDecode(parts[1])),
  };
}
