import { getCollection } from 'astro:content';
import type { ContentItem, ContentType } from './types';

/**
 * Fetches all content across all collections
 * @returns Object containing all content organized by type
 */
export async function getAllContent() {
  const [letters, speeches, lectures, essays] = await Promise.all([
    getCollection('letters'),
    getCollection('speeches'),
    getCollection('lectures'),
    getCollection('essays')
  ]);

  return {
    letters,
    speeches,
    lectures,
    essays,
    all: [
      ...letters.map(item => ({ ...item, contentType: 'letter' as ContentType })),
      ...speeches.map(item => ({ ...item, contentType: 'speech' as ContentType })),
      ...lectures.map(item => ({ ...item, contentType: 'lecture' as ContentType })),
      ...essays.map(item => ({ ...item, contentType: 'essay' as ContentType }))
    ]
  };
}

/**
 * Fetches content by specific type
 */
export async function getContentByType(type: ContentType) {
  switch (type) {
    case 'letter':
      return getCollection('letters');
    case 'speech':
      return getCollection('speeches');
    case 'lecture':
      return getCollection('lectures');
    case 'essay':
      return getCollection('essays');
  }
}

/**
 * Calculate reading time in minutes
 * @param text - Content text
 * @param wordsPerMinute - Reading speed (default: 200)
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Get featured content with limit
 */
export function getFeaturedContent(items: ContentItem[], limit: number = 6): ContentItem[] {
  return items
    .filter(item => item.data.featured)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}

/**
 * Get related content by author
 */
export function getRelatedByAuthor(
  currentItem: ContentItem,
  allContent: ContentItem[],
  limit: number = 3
): ContentItem[] {
  return allContent
    .filter(item =>
      item.slug !== currentItem.slug &&
      item.data.author.name === currentItem.data.author.name
    )
    .slice(0, limit);
}

/**
 * Get related content by tags
 */
export function getRelatedByTags(
  currentItem: ContentItem,
  allContent: ContentItem[],
  limit: number = 3
): ContentItem[] {
  return allContent
    .filter(item => {
      if (item.slug === currentItem.slug) return false;
      if (item.data.author.name === currentItem.data.author.name) return false;

      const commonTags = item.data.tags.filter(tag =>
        currentItem.data.tags.includes(tag)
      ).length;

      return commonTags > 0;
    })
    .sort((a, b) => {
      const aCommon = a.data.tags.filter(tag => currentItem.data.tags.includes(tag)).length;
      const bCommon = b.data.tags.filter(tag => currentItem.data.tags.includes(tag)).length;
      return bCommon - aCommon;
    })
    .slice(0, limit);
}

/**
 * Get related content (combines author and tags)
 */
export function getRelatedContent(
  currentItem: ContentItem,
  allContent: ContentItem[],
  limit: number = 4
): ContentItem[] {
  const byAuthor = getRelatedByAuthor(currentItem, allContent, 3);
  const byTags = getRelatedByTags(currentItem, allContent, 3);

  return [...byAuthor, ...byTags].slice(0, limit);
}

/**
 * Format content for route paths
 */
export function getContentRoute(contentType: ContentType, slug: string): string {
  return `/${contentType}/${slug}`;
}
