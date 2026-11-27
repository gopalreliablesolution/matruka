export function buildPinnedMapEmbedUrl(address?: string): string {
  const raw = (address || 'Solaris Cure, VIP Road, Vesu, Surat, Gujarat 395007').trim();
  const cleaned = raw
    .replace(/^\d+[-–]\d+\s*,\s*/i, '')
    .replace(/beside[s]?\s+[^,]+,\s*/i, '')
    .trim();
  // "Solaris Cure, VIP Road, Vesu, Surat" resolves cleanly as a pinned place in Google Maps
  const finalQuery =
    cleaned.toLowerCase().includes('solaris cure') && !cleaned.toLowerCase().includes('vesu')
      ? cleaned.replace(/vip road/i, 'VIP Road, Vesu')
      : cleaned || raw;
  return `https://maps.google.com/maps?q=${encodeURIComponent(finalQuery)}&t=k&z=17&ie=UTF8&output=embed`;
}

export function sanitizeMapEmbedUrl(raw?: string, addressFallback?: string): string {
  const pinnedFallback = buildPinnedMapEmbedUrl(addressFallback);
  if (!raw) return pinnedFallback;
  const str = raw.trim();

  // Only replace empty or leftover Jogi URLs; otherwise respect the exact URL saved in Admin
  if (str.includes('<iframe') || str.includes('src=')) {
    const match = str.match(/src=["']([^"']+)["']/i);
    if (match && match[1] && (match[1].startsWith('http://') || match[1].startsWith('https://'))) {
      if (match[1].toLowerCase().includes('jogi')) {
        return pinnedFallback;
      }
      return match[1];
    }
  }

  if (str.startsWith('https://') || str.startsWith('http://')) {
    if (str.toLowerCase().includes('jogi')) {
      return pinnedFallback;
    }
    return str;
  }

  return pinnedFallback;
}
