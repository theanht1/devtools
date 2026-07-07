export type UrlMode = 'component' | 'full';

export function encodeUrl(text: string, mode: UrlMode): string {
  return mode === 'component' ? encodeURIComponent(text) : encodeURI(text);
}

export function decodeUrl(text: string, mode: UrlMode): string {
  return mode === 'component' ? decodeURIComponent(text) : decodeURI(text);
}
