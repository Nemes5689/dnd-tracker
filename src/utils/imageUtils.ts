// Image processing utilities — for resizing/compressing uploaded battle maps
// to keep them within reasonable localStorage limits.

const MAX_IMAGE_DIMENSION = 1920; // pixels (longest side)
const JPEG_QUALITY = 0.85;

export interface ProcessedImage {
  data_url: string;
  width: number;
  height: number;
  size_bytes: number;
}

/**
 * Read a file, resize if too large, and return as base64 data URL.
 */
export async function processImageFile(file: File): Promise<ProcessedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Read file into image element
  const data_url = await readFileAsDataURL(file);
  const img = await loadImage(data_url);

  const ratio = Math.min(
    MAX_IMAGE_DIMENSION / img.naturalWidth,
    MAX_IMAGE_DIMENSION / img.naturalHeight,
    1 // never upscale
  );

  if (ratio === 1 && file.size < 2_000_000) {
    // Original is fine, return as-is
    return {
      data_url,
      width: img.naturalWidth,
      height: img.naturalHeight,
      size_bytes: data_url.length,
    };
  }

  // Resize via canvas
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * ratio);
  canvas.height = Math.round(img.naturalHeight * ratio);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Convert to JPEG (smaller than PNG for photos/maps)
  const compressed = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

  return {
    data_url: compressed,
    width: canvas.width,
    height: canvas.height,
    size_bytes: compressed.length,
  };
}

/**
 * Process an avatar image — square crop, much smaller (256px max).
 */
export async function processAvatarFile(file: File): Promise<ProcessedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  const data_url = await readFileAsDataURL(file);
  const img = await loadImage(data_url);

  const max_size = 256;
  const size = Math.min(img.naturalWidth, img.naturalHeight, max_size);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Center-crop square
  const src_size = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - src_size) / 2;
  const sy = (img.naturalHeight - src_size) / 2;

  ctx.drawImage(img, sx, sy, src_size, src_size, 0, 0, size, size);
  const compressed = canvas.toDataURL('image/jpeg', 0.85);

  return {
    data_url: compressed,
    width: size,
    height: size,
    size_bytes: compressed.length,
  };
}

/**
 * Process a gallery image — keeps aspect ratio, resizes to max 1200px on
 * the longest side, JPEG-compressed. Bigger than avatar, smaller than
 * battle map.
 */
export async function processGalleryImage(file: File): Promise<ProcessedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  const data_url = await readFileAsDataURL(file);
  const img = await loadImage(data_url);

  const MAX_GALLERY_DIM = 1200;
  const ratio = Math.min(
    MAX_GALLERY_DIM / img.naturalWidth,
    MAX_GALLERY_DIM / img.naturalHeight,
    1
  );

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * ratio);
  canvas.height = Math.round(img.naturalHeight * ratio);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const compressed = canvas.toDataURL('image/jpeg', 0.85);

  return {
    data_url: compressed,
    width: canvas.width,
    height: canvas.height,
    size_bytes: compressed.length,
  };
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Format byte count as human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
