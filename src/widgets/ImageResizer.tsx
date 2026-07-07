import { useEffect, useState } from 'react';
import { loadImage, transformImage, downloadBlob } from '../lib/imageTools';
import { Button, Input } from '../components/ui';

export default function ImageResizer() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState('image');
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [lock, setLock] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Revoke the current image's object URL on unmount.
  useEffect(() => {
    return () => {
      if (img) URL.revokeObjectURL(img.src);
    };
  }, [img]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const image = await loadImage(file);
      setImg((prev) => {
        if (prev) URL.revokeObjectURL(prev.src);
        return image;
      });
      setName(file.name.replace(/\.[^.]+$/, ''));
      setW(image.naturalWidth);
      setH(image.naturalHeight);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const setWidth = (v: number) => {
    setW(v);
    if (lock && img) setH(Math.round((v / img.naturalWidth) * img.naturalHeight));
  };
  const setHeight = (v: number) => {
    setH(v);
    if (lock && img) setW(Math.round((v / img.naturalHeight) * img.naturalWidth));
  };

  const download = async () => {
    if (!img || w <= 0 || h <= 0) return;
    const blob = await transformImage(img, { width: w, height: h, type: 'image/png' });
    downloadBlob(blob, `${name}-${w}x${h}.png`);
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col gap-1.5"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFile(e.dataTransfer.files[0]);
      }}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <input type="file" className="text-xs" accept="image/png,image/jpeg"
          onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      {img && (
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            <label className="flex items-center gap-1 text-[13px]">W <Input type="number" min={1} style={{ width: 70 }} value={w}
              onChange={(e) => setWidth(Number(e.target.value))} /></label>
            <label className="flex items-center gap-1 text-[13px]">H <Input type="number" min={1} style={{ width: 70 }} value={h}
              onChange={(e) => setHeight(Number(e.target.value))} /></label>
            <label className="flex items-center gap-1 text-[13px]"><input type="checkbox" className="accent-accent" checked={lock} onChange={(e) => setLock(e.target.checked)} /> lock ratio</label>
            <Button onClick={download}>Download PNG</Button>
          </div>
          <img src={img.src} alt="preview" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain' }} />
          <span>{img.naturalWidth}×{img.naturalHeight} → {w}×{h}</span>
        </>
      )}
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
    </div>
  );
}
