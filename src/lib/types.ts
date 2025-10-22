/**
 * Comprehensive type definitions for Paper Lanterns
 * Provides type safety across the application
 */

import type { CollectionEntry } from 'astro:content';

/**
 * Content Types
 */
export type ContentType = 'letter' | 'speech' | 'lecture' | 'essay';

/**
 * Collection Entry Types
 */
export type LetterEntry = CollectionEntry<'letters'>;
export type SpeechEntry = CollectionEntry<'speeches'>;
export type LectureEntry = CollectionEntry<'lectures'>;
export type EssayEntry = CollectionEntry<'essays'>;
export type GardenEntry = CollectionEntry<'garden'>;
export type CollectionEntry_Custom = CollectionEntry<'collections'>;

/**
 * Union of all content entries
 */
export type AnyContentEntry = LetterEntry | SpeechEntry | LectureEntry | EssayEntry;

/**
 * Content Item with type augmentation
 */
export interface ContentItem<T extends AnyContentEntry = AnyContentEntry> {
  contentType: ContentType;
  slug: string;
  data: T['data'];
  body: string;
  collection: string;
  id: string;
  render: T['render'];
}

/**
 * Type-safe content item by content type
 */
export type ContentItemWithType<T extends ContentType> =
  T extends 'letter' ? ContentItem<LetterEntry> :
  T extends 'speech' ? ContentItem<SpeechEntry> :
  T extends 'lecture' ? ContentItem<LectureEntry> :
  T extends 'essay' ? ContentItem<EssayEntry> :
  never;

/**
 * Author information
 */
export interface Author {
  name: string;
  birth_year?: number;
  death_year?: number;
  bio?: string;
}

/**
 * About/Context information for content
 */
export interface AboutInfo {
  context?: string;
  significance?: string;
  author_bio?: string;
  recipient_info?: string;
  links?: ResourceLink[];
}

/**
 * External resource link
 */
export interface ResourceLink {
  title: string;
  url: string;
  description?: string;
}

/**
 * Breadcrumb navigation item
 */
export interface BreadcrumbItem {
  label: string;
  url?: string;
}

/**
 * Navigation item
 */
export interface NavigationItem {
  label: string;
  url: string;
  active?: boolean;
  icon?: string;
}

/**
 * Component Props Types
 */

export interface ArticleHeaderProps {
  title: string;
  author: Author;
  date: Date;
  location?: string;
  readTime: number;
  category: string;
}

export interface ArticleContentProps {
  contentType: ContentType;
  dropCapColor?: string;
}

export interface ContentCardProps {
  item: ContentItem;
  variant?: 'default' | 'featured' | 'compact';
  showExcerpt?: boolean;
}

export interface RelatedContentProps {
  items: ContentItem[];
  title?: string;
}

export interface ContentNavigationProps {
  prevItem?: AnyContentEntry | null;
  nextItem?: AnyContentEntry | null;
  contentType: ContentType;
  currentIndex?: number;
  total?: number;
}

export interface TagListProps {
  tags: string[];
  variant?: 'default' | 'compact';
}

export interface AboutSectionProps {
  about: AboutInfo;
  contentData: {
    author: Author;
    recipient?: string;
  };
}

/**
 * API Types
 */

export interface SearchDataItem {
  slug: string;
  contentType: ContentType;
  title: string;
  author: string;
  recipient?: string;
  context: string;
  excerpt: string;
  body: string;
  tags: string[];
  collections: string[];
  date: number;
}

export interface RandomContentItem {
  slug: string;
  collection: ContentType;
  title: string;
  author: string;
  date: string;
}

export interface APIResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    generated?: string;
    [key: string]: any;
  };
  error?: {
    message: string;
    code?: string;
    details?: string[];
  };
}

/**
 * Filter and Sort Types
 */

export type SortOrder = 'asc' | 'desc';
export type SortField = 'date' | 'title' | 'author';

export interface FilterOptions {
  contentType?: ContentType | 'all';
  author?: string;
  year?: number;
  yearRange?: { start: number; end: number };
  tags?: string[];
  collections?: string[];
  featured?: boolean;
  sort?: SortField;
  order?: SortOrder;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

export interface SearchOptions extends FilterOptions, Partial<PaginationOptions> {
  query?: string;
}

/**
 * Data Layer Return Types
 */

export interface AllContentData {
  letters: LetterEntry[];
  speeches: SpeechEntry[];
  lectures: LectureEntry[];
  essays: EssayEntry[];
  all: ContentItem[];
}

export interface FilteredContentResult {
  items: ContentItem[];
  total: number;
  hasMore: boolean;
}

export interface AdjacentItems<T> {
  prev: T | null;
  next: T | null;
}

/**
 * Theme Types
 */

export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  theme: Theme;
  systemPreference: Theme;
  userOverride?: Theme;
}

/**
 * SEO/Meta Types
 */

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}

export interface StructuredDataProps {
  type: 'Article' | 'WebPage' | 'CollectionPage';
  title: string;
  description: string;
  url: string;
  author?: string;
  publishedTime?: string;
  image?: string;
  keywords?: string[];
}

/**
 * Layout Props Types
 */

export interface BaseLayoutProps {
  title: string;
  description?: string;
  robots?: 'index,follow' | 'noindex,nofollow';
}

export interface ArticleLayoutProps extends BaseLayoutProps {
  author: string;
  date: Date;
  excerpt: string;
  breadcrumbs: BreadcrumbItem[];
  tags?: string[];
  image?: string;
}

export interface ListingLayoutProps extends BaseLayoutProps {
  pageType?: 'archive' | 'collection' | 'category';
}

/**
 * Utility Types
 */

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

/**
 * Extract data type from collection entry
 */
export type EntryData<T extends CollectionEntry<any>> = T['data'];

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Content with computed fields
 */
export interface EnrichedContentItem extends ContentItem {
  readTime: number;
  relatedContent?: ContentItem[];
  yearsAgo: number;
  formattedDate: string;
}

/**
 * Route parameter types
 */
export interface ContentRouteParams {
  slug: string;
}

export interface CollectionRouteParams {
  slug: string;
}

/**
 * Client-side utility types
 */

export interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export interface ShareData {
  title: string;
  url: string;
  text?: string;
}

/**
 * Constants type exports
 */

export interface SiteConfig {
  url: string;
  name: string;
  description: string;
  author: string;
  social: {
    twitter: string;
    linkedin: string;
  };
}

export interface TypographyConfig {
  WORDS_PER_MINUTE: number;
  DEFAULT_DROP_CAP_COLOR: string;
  FONT_WEIGHTS: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
  };
}

/**
 * Type guards
 */

export function isLetter(item: AnyContentEntry): item is LetterEntry {
  return item.collection === 'letters';
}

export function isSpeech(item: AnyContentEntry): item is SpeechEntry {
  return item.collection === 'speeches';
}

export function isLecture(item: AnyContentEntry): item is LectureEntry {
  return item.collection === 'lectures';
}

export function isEssay(item: AnyContentEntry): item is EssayEntry {
  return item.collection === 'essays';
}

export function isContentItem(obj: any): obj is ContentItem {
  return (
    obj &&
    typeof obj === 'object' &&
    'contentType' in obj &&
    'slug' in obj &&
    'data' in obj &&
    'body' in obj
  );
}

/**
 * Type assertion helpers
 */

export function asContentType(type: string): ContentType {
  if (type === 'letter' || type === 'speech' || type === 'lecture' || type === 'essay') {
    return type;
  }
  throw new Error(`Invalid content type: ${type}`);
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
