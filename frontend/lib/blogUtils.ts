export type BlogDisplayMode = 'both' | 'image_only' | 'content_only';

export interface ParsedBlog {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  imageAlt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string | Date;
  readTime?: string;
  displayMode: BlogDisplayMode;
  showContent: boolean;
  showImage: boolean;
  isFeatured?: boolean;
  views?: number;
  [key: string]: any;
}

export function parseBlogItem(b: any): ParsedBlog {
  let displayMode: BlogDisplayMode = b?.displayMode || 'both';
  let showContent = b?.showContent !== false;
  let showImage = b?.showImage !== false;

  // Check if metadata encoded in imageAlt (safeguard for older/remote backend schemas)
  if (b?.imageAlt && typeof b.imageAlt === 'string' && b.imageAlt.startsWith('__META__:')) {
    try {
      const parsed = JSON.parse(b.imageAlt.substring(9));
      if (parsed.displayMode) displayMode = parsed.displayMode;
      if (parsed.showContent !== undefined) showContent = Boolean(parsed.showContent);
      if (parsed.showImage !== undefined) showImage = Boolean(parsed.showImage);
    } catch {}
  } else if (b?.imageAlt && typeof b.imageAlt === 'string' && b.imageAlt.startsWith('__MODE__:')) {
    displayMode = b.imageAlt.substring(9) as BlogDisplayMode;
  }

  // Derive explicit booleans based on mode
  if (displayMode === 'image_only') {
    showContent = false;
    showImage = true;
  } else if (displayMode === 'content_only') {
    showContent = true;
    showImage = false;
  }

  // If there is no featured image provided or it is empty
  const hasImage = Boolean(b?.featuredImage && b.featuredImage.trim() !== '');
  if (!hasImage && displayMode === 'both') {
    showImage = false;
  }

  return {
    ...b,
    title: b?.title || '',
    slug: b?.slug || '',
    excerpt: b?.excerpt || '',
    featuredImage: b?.featuredImage || '',
    author: b?.author || 'Dr. Kairavi Yagnik',
    category: b?.category || 'Pregnancy & Childbirth',
    displayMode,
    showContent,
    showImage,
  };
}
