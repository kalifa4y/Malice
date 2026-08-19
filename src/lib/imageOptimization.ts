/**
 * Image Optimization & Compression Engine for Maison Alice
 * Performs client-side high-fidelity compression to WebP/JPEG Data URLs
 * to ensure ultra-fast loading without exceeding storage limits.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  sizeBytes: number;
  originalSizeBytes: number;
  width: number;
  height: number;
  format: string;
  compressionRatio: number; // percentage saved, e.g. 75 (%)
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.85)
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Optimizes an image File or Blob using HTML5 Canvas
 */
export async function optimizeImage(
  file: File | Blob,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    format = 'image/webp'
  } = options;

  const originalSizeBytes = file.size;

  return new Promise((resolve, reject) => {
    // Validate MIME type
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Le fichier sélectionné n\'est pas une image valide.'));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier image.'));
    };

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Impossible de charger l\'image pour optimisation.'));
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Render to offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Contexte Canvas 2D non disponible.'));
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP (with fallback to JPEG if browser doesn't support WebP export)
        let outputDataUrl = canvas.toDataURL(format, quality);
        let actualFormat = format;

        // Verify if browser supported the requested format
        if (format === 'image/webp' && !outputDataUrl.startsWith('data:image/webp')) {
          outputDataUrl = canvas.toDataURL('image/jpeg', quality);
          actualFormat = 'image/jpeg';
        }

        // Calculate approximate size in bytes from Base64
        const base64Length = outputDataUrl.length - (outputDataUrl.indexOf(',') + 1);
        const sizeBytes = Math.round((base64Length * 3) / 4);

        const compressionRatio = originalSizeBytes > 0 
          ? Math.max(0, Math.round(((originalSizeBytes - sizeBytes) / originalSizeBytes) * 100))
          : 0;

        resolve({
          dataUrl: outputDataUrl,
          sizeBytes,
          originalSizeBytes,
          width,
          height,
          format: actualFormat,
          compressionRatio
        });
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes to readable string (e.g., 142 Ko)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Octet';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
