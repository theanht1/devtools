import { md5 } from 'js-md5';

export type HashAlgo = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export async function hashText(text: string, algo: HashAlgo): Promise<string> {
  if (algo === 'MD5') return md5(text);
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}
