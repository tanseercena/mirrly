// Realtime try-on models take the garment as a Blob/File (or URL) — not a
// files-API id. This converts any storefront-accessible image URL into a
// flat-background JPEG blob sized for a fast setImage upload (Decart
// recommends >=512px on a plain background; we cap the long edge at 1024px).

const MAX_EDGE = 1024;

export async function garmentBlobFromUrl(url: string): Promise<Blob | null> {
  try {
    const img = await loadImage(url);
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return null;

    const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Flatten onto white — transparent PNGs render black in JPEG output.
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  } catch {
    // CORS-blocked, broken URL, decode failure… the session degrades to
    // prompt-only rather than blocking the try-on.
    return null;
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Shopify CDN and our own /storage paths both send permissive CORS
    // headers; required so the canvas stays untainted for toBlob().
    img.crossOrigin = 'anonymous';
    // A stalled download must not block connectEngine (the modal would sit
    // in 'connecting' forever) — degrade to prompt-only after 10s.
    const timer = setTimeout(() => reject(new Error('garment image timed out')), 10_000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error('garment image failed to load'));
    };
    img.src = url;
  });
}
