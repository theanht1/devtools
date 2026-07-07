export function encodeBase64(text: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  const b64 = btoa(bin);
  return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64;
}

export function decodeBase64(b64: string, urlSafe: boolean): string {
  let s = urlSafe ? b64.replace(/-/g, '+').replace(/_/g, '/') : b64;
  s = s.padEnd(Math.ceil(s.length / 4) * 4, '=');
  const bin = atob(s); // throws DOMException on invalid input
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
