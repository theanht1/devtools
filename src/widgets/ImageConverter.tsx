import { useEffect, useState } from 'react';
import { loadImage, transformImage, downloadBlob } from '../lib/imageTools';
import { Button, Select } from '../components/ui';

export default function ImageConverter() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState('image');
  const [target, setTarget] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [quality, setQuality] = useState(0.9);
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
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const download = async () => {
    if (!img) return;
    const blob = await transformImage(img, {
      width: img.naturalWidth,
      height: img.naturalHeight,
      type: target,
      quality: target === 'image/jpeg' ? quality : undefined,
    });
    downloadBlob(blob, `${name}.${target === 'image/png' ? 'png' : 'jpg'}`);
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
      <input type="file" className="text-xs" accept="image/png,image/jpeg" onChange={(e) => onFile(e.target.files?.[0])} />
      <div className="flex flex-wrap items-center gap-1.5">
        <Select value={target} onChange={(e) => setTarget(e.target.value as typeof target)}>
          <option value="image/png">to PNG</option>
          <option value="image/jpeg">to JPG</option>
        </Select>
        {target === 'image/jpeg' && (
          <label className="flex items-center gap-1 text-[13px]">
            quality {quality}
            <input type="range" className="accent-accent" min={0.1} max={1} step={0.05} value={quality}
              onChange={(e) => setQuality(Number(e.target.value))} />
          </label>
        )}
        <Button onClick={download} disabled={!img}>Download</Button>
      </div>
      {img && <img src={img.src} alt="preview" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain' }} />}
      {error && <div className="text-xs whitespace-pre-wrap text-danger">{error}</div>}
    </div>
  );
}
