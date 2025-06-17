/**
 * Compress and resize images before sending to API
 */

export async function compressImage(base64String: string, maxWidth: number = 1920, quality: number = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress the image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64String;
  });
}

export async function compressMultipleImages(
  images: string[], 
  maxWidth: number = 1920, 
  quality: number = 0.85
): Promise<string[]> {
  const compressionPromises = images.map(image => compressImage(image, maxWidth, quality));
  return Promise.all(compressionPromises);
}

/**
 * Get approximate size of base64 string in MB
 */
export function getBase64Size(base64String: string): number {
  const sizeInBytes = (base64String.length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return Math.round(sizeInMB * 100) / 100;
}

/**
 * Check if total payload size exceeds limit
 */
export function checkPayloadSize(images: string[], maxSizeMB: number = 10): boolean {
  const totalSize = images.reduce((sum, image) => sum + getBase64Size(image), 0);
  return totalSize <= maxSizeMB;
}