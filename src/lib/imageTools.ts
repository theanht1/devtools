export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image — is it a valid jpg/png?'));
    };
    img.src = url;
  });
}

export function transformImage(
  img: HTMLImageElement,
  opts: { width: number; height: number; type: 'image/png' | 'image/jpeg'; quality?: number }
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = opts.width;
  canvas.height = opts.height;
  const ctx = canvas.getContext('2d')!;
  if (opts.type === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'; // jpeg has no alpha; avoid black background
    ctx.fillRect(0, 0, opts.width, opts.height);
  }
  ctx.drawImage(img, 0, 0, opts.width, opts.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Conversion failed'))),
      opts.type,
      opts.quality
    )
  );
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revocation: some browsers dispatch the download asynchronously.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
