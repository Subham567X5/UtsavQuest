/// <reference types="vite/client" />

/**
 * Uploads an image file to ImgBB and returns the direct image URL.
 * Uses the VITE_IMGBB_KEY environment variable.
 */
export async function uploadImageToImgBB(file: File): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }

  // Limit file size to 10MB to prevent timeouts/errors
  const MAX_SIZE_MB = 10;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size must be less than ${MAX_SIZE_MB}MB.`);
  }

  const apiKey = (import.meta as any).env.VITE_IMGBB_KEY || '2e45ad3e3d1e41e3a53b8b1bcf00b9ea';
  if (!apiKey) {
    throw new Error('ImgBB API key is missing. Please configure VITE_IMGBB_KEY.');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errResponse = await response.json().catch(() => ({}));
      throw new Error(errResponse.error?.message || `Upload failed (Status ${response.status})`);
    }

    const data = await response.json();
    if (data.success && data.data && data.data.url) {
      return data.data.url; // Direct image URL
    } else {
      throw new Error('Unexpected API response structure.');
    }
  } catch (error: any) {
    console.error('ImgBB Upload Error:', error);
    throw new Error(error.message || 'Network error occurred during upload. Please check your internet connection.');
  }
}
