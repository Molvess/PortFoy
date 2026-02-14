/**
 * YouTube watch/short URL'sini embed URL'sine çevirir.
 * Zaten embed URL'si ise aynen döndürür.
 *
 * Desteklenen formatlar:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID  (olduğu gibi döner)
 *  - https://www.youtube.com/shorts/VIDEO_ID
 */
export function getYouTubeEmbedUrl(url: string): string {
  // Zaten embed ise
  if (url.includes('/embed/')) return url;

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^?&#]+)/,
    /(?:youtu\.be\/)([^?&#]+)/,
    /(?:youtube\.com\/shorts\/)([^?&#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
  }

  // Tanınmayan URL — olduğu gibi döndür
  return url;
}

/**
 * YouTube URL'sinden video ID'sini çıkarır (thumbnail için).
 */
export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&#]+)/
  );
  return match?.[1] ?? null;
}
