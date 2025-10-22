/**
 * Centralized data layer with caching
 * Single source of truth for all content fetching
 */

import { getCollection } from 'astro:content';
import type {
  LetterEntry,
  SpeechEntry,
  LectureEntry,
  EssayEntry,
  GardenEntry,
  CollectionEntry_Custom,
  ContentItem,
  ContentType,
  AnyContentEntry,
  AllContentData,
  FilterOptions,
  AdjacentItems,
  FilteredContentResult
} from './types';

/**
 * Build-time cache for collections
 * Astro runs this at build time, so caching is effective
 */
const collectionsCache: {
  letters?: LetterEntry[];
  speeches?: SpeechEntry[];
  lectures?: LectureEntry[];
  essays?: EssayEntry[];
  garden?: GardenEntry[];
  collections?: CollectionEntry_Custom[];
} = {};

/**
 * Get letters collection with caching
 */
export async function getLetters(): Promise<LetterEntry[]> {
  if (!collectionsCache.letters) {
    try {
      collectionsCache.letters = await getCollection('letters');
    } catch (error) {
      console.error('Error loading letters collection:', error);
      throw new Error('Failed to load letters collection');
    }
  }
  return collectionsCache.letters;
}

/**
 * Get speeches collection with caching
 */
export async function getSpeeches(): Promise<SpeechEntry[]> {
  if (!collectionsCache.speeches) {
    try {
      collectionsCache.speeches = await getCollection('speeches');
    } catch (error) {
      console.error('Error loading speeches collection:', error);
      throw new Error('Failed to load speeches collection');
    }
  }
  return collectionsCache.speeches;
}

/**
 * Get lectures collection with caching
 */
export async function getLectures(): Promise<LectureEntry[]> {
  if (!collectionsCache.lectures) {
    try {
      collectionsCache.lectures = await getCollection('lectures');
    } catch (error) {
      console.error('Error loading lectures collection:', error);
      throw new Error('Failed to load lectures collection');
    }
  }
  return collectionsCache.lectures;
}

/**
 * Get essays collection with caching
 */
export async function getEssays(): Promise<EssayEntry[]> {
  if (!collectionsCache.essays) {
    try {
      collectionsCache.essays = await getCollection('essays');
    } catch (error) {
      console.error('Error loading essays collection:', error);
      throw new Error('Failed to load essays collection');
    }
  }
  return collectionsCache.essays;
}

/**
 * Get garden entries with caching
 */
export async function getGardenEntries(): Promise<GardenEntry[]> {
  if (!collectionsCache.garden) {
    try {
      collectionsCache.garden = await getCollection('garden');
    } catch (error) {
      console.error('Error loading garden collection:', error);
      throw new Error('Failed to load garden collection');
    }
  }
  return collectionsCache.garden;
}

/**
 * Get collections metadata with caching
 */
export async function getCollections(): Promise<CollectionEntry_Custom[]> {
  if (!collectionsCache.collections) {
    try {
      collectionsCache.collections = await getCollection('collections');
    } catch (error) {
      console.error('Error loading collections metadata:', error);
      throw new Error('Failed to load collections metadata');
    }
  }
  return collectionsCache.collections;
}

/**
 * Get content by type
 */
export async function getContentByType(type: ContentType): Promise<AnyContentEntry[]> {
  switch (type) {
    case 'letter':
      return getLetters();
    case 'speech':
      return getSpeeches();
    case 'lecture':
      return getLectures();
    case 'essay':
      return getEssays();
    default:
      throw new Error(`Unknown content type: ${type}`);
  }
}

/**
 * Get all content with type information
 * Cached for performance across multiple calls
 */
export async function getAllContentItems(): Promise<ContentItem[]> {
  const [letters, speeches, lectures, essays] = await Promise.all([
    getLetters(),
    getSpeeches(),
    getLectures(),
    getEssays()
  ]);

  return [
    ...letters.map(item => ({ ...item, contentType: 'letter' as ContentType })),
    ...speeches.map(item => ({ ...item, contentType: 'speech' as ContentType })),
    ...lectures.map(item => ({ ...item, contentType: 'lecture' as ContentType })),
    ...essays.map(item => ({ ...item, contentType: 'essay' as ContentType }))
  ];
}

/**
 * Get all content organized by type
 */
export async function getAllContent(): Promise<AllContentData> {
  const [letters, speeches, lectures, essays] = await Promise.all([
    getLetters(),
    getSpeeches(),
    getLectures(),
    getEssays()
  ]);

  const all: ContentItem[] = [
    ...letters.map(item => ({ ...item, contentType: 'letter' as ContentType })),
    ...speeches.map(item => ({ ...item, contentType: 'speech' as ContentType })),
    ...lectures.map(item => ({ ...item, contentType: 'lecture' as ContentType })),
    ...essays.map(item => ({ ...item, contentType: 'essay' as ContentType }))
  ];

  return {
    letters,
    speeches,
    lectures,
    essays,
    all
  };
}

/**
 * Get featured content across all types
 */
export async function getFeaturedItems(limit: number = 6): Promise<ContentItem[]> {
  const allContent = await getAllContentItems();

  return allContent
    .filter(item => item.data.featured)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}

/**
 * Sort content by date (newest first by default)
 */
export function sortByDate<T extends { data: { date: Date } }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  const sorted = [...items].sort((a, b) => {
    const diff = b.data.date.getTime() - a.data.date.getTime();
    return order === 'desc' ? diff : -diff;
  });
  return sorted;
}

/**
 * Sort content by title
 */
export function sortByTitle<T extends { data: { title: string } }>(
  items: T[],
  order: 'asc' | 'desc' = 'asc'
): T[] {
  const sorted = [...items].sort((a, b) => {
    const comparison = a.data.title.localeCompare(b.data.title);
    return order === 'asc' ? comparison : -comparison;
  });
  return sorted;
}

/**
 * Sort content by author
 */
export function sortByAuthor<T extends { data: { author: { name: string } } }>(
  items: T[],
  order: 'asc' | 'desc' = 'asc'
): T[] {
  const sorted = [...items].sort((a, b) => {
    const comparison = a.data.author.name.localeCompare(b.data.author.name);
    return order === 'asc' ? comparison : -comparison;
  });
  return sorted;
}

/**
 * Get adjacent content items for prev/next navigation
 */
export function getAdjacentItems<T>(
  items: T[],
  currentSlug: string,
  getSlug: (item: T) => string
): AdjacentItems<T> {
  const currentIndex = items.findIndex(item => getSlug(item) === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? items[currentIndex - 1] : null,
    next: currentIndex < items.length - 1 ? items[currentIndex + 1] : null
  };
}

/**
 * Filter content by options
 */
export function filterContent(
  items: ContentItem[],
  options: FilterOptions = {}
): ContentItem[] {
  let filtered = [...items];

  // Filter by content type
  if (options.contentType && options.contentType !== 'all') {
    filtered = filtered.filter(item => item.contentType === options.contentType);
  }

  // Filter by author
  if (options.author) {
    filtered = filtered.filter(item =>
      item.data.author.name.toLowerCase().includes(options.author!.toLowerCase())
    );
  }

  // Filter by year
  if (options.year) {
    filtered = filtered.filter(item =>
      item.data.date.getFullYear() === options.year
    );
  }

  // Filter by year range
  if (options.yearRange) {
    filtered = filtered.filter(item => {
      const year = item.data.date.getFullYear();
      return year >= options.yearRange!.start && year <= options.yearRange!.end;
    });
  }

  // Filter by tags
  if (options.tags && options.tags.length > 0) {
    filtered = filtered.filter(item =>
      item.data.tags?.some(tag => options.tags!.includes(tag))
    );
  }

  // Filter by collections
  if (options.collections && options.collections.length > 0) {
    filtered = filtered.filter(item =>
      item.data.collections?.some(col => options.collections!.includes(col))
    );
  }

  // Filter by featured
  if (options.featured !== undefined) {
    filtered = filtered.filter(item => item.data.featured === options.featured);
  }

  // Sort results
  if (options.sort) {
    switch (options.sort) {
      case 'date':
        filtered = sortByDate(filtered, options.order);
        break;
      case 'title':
        filtered = sortByTitle(filtered, options.order);
        break;
      case 'author':
        filtered = sortByAuthor(filtered, options.order);
        break;
    }
  }

  return filtered;
}

/**
 * Filter content with pagination
 */
export function filterContentPaginated(
  items: ContentItem[],
  options: FilterOptions & { page?: number; limit?: number } = {}
): FilteredContentResult {
  const filtered = filterContent(items, options);

  const page = options.page || 1;
  const limit = options.limit || 20;
  const offset = (page - 1) * limit;

  const paginated = filtered.slice(offset, offset + limit);

  return {
    items: paginated,
    total: filtered.length,
    hasMore: offset + limit < filtered.length
  };
}

/**
 * Get content by slug
 */
export async function getContentBySlug(
  slug: string,
  type?: ContentType
): Promise<ContentItem | null> {
  const allContent = await getAllContentItems();

  const found = allContent.find(item => {
    if (type) {
      return item.slug === slug && item.contentType === type;
    }
    return item.slug === slug;
  });

  return found || null;
}

/**
 * Search content by query
 */
export function searchContent(
  items: ContentItem[],
  query: string
): ContentItem[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return items;
  }

  return items.filter(item => {
    const titleMatch = item.data.title.toLowerCase().includes(lowerQuery);
    const authorMatch = item.data.author.name.toLowerCase().includes(lowerQuery);
    const excerptMatch = item.data.excerpt.toLowerCase().includes(lowerQuery);
    const bodyMatch = item.body.toLowerCase().includes(lowerQuery);
    const tagsMatch = item.data.tags?.some(tag =>
      tag.toLowerCase().includes(lowerQuery)
    );

    return titleMatch || authorMatch || excerptMatch || bodyMatch || tagsMatch;
  });
}

/**
 * Get unique authors from content
 */
export function getUniqueAuthors(items: ContentItem[]): string[] {
  const authors = new Set(items.map(item => item.data.author.name));
  return Array.from(authors).sort();
}

/**
 * Get unique years from content
 */
export function getUniqueYears(items: ContentItem[]): number[] {
  const years = new Set(items.map(item => item.data.date.getFullYear()));
  return Array.from(years).sort((a, b) => b - a); // Newest first
}

/**
 * Get unique tags from content
 */
export function getUniqueTags(items: ContentItem[]): string[] {
  const tags = new Set<string>();
  items.forEach(item => {
    item.data.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get content count by type
 */
export function getContentCounts(items: ContentItem[]): Record<ContentType, number> {
  return {
    letter: items.filter(i => i.contentType === 'letter').length,
    speech: items.filter(i => i.contentType === 'speech').length,
    lecture: items.filter(i => i.contentType === 'lecture').length,
    essay: items.filter(i => i.contentType === 'essay').length
  };
}

/**
 * Get random content items
 */
export function getRandomItems(
  items: ContentItem[],
  count: number = 5
): ContentItem[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Clear cache (useful for development)
 */
export function clearCache(): void {
  Object.keys(collectionsCache).forEach(key => {
    delete collectionsCache[key as keyof typeof collectionsCache];
  });
}
