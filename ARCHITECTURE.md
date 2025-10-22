# Paper Lanterns - Architecture Documentation

This document describes the architectural patterns, conventions, and best practices for the Paper Lanterns project.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Type System](#type-system)
3. [Data Layer](#data-layer)
4. [Component Library](#component-library)
5. [Layout System](#layout-system)
6. [Styling System](#styling-system)
7. [Best Practices](#best-practices)
8. [Examples](#examples)

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ArticleHeader.astro
│   ├── Breadcrumb.astro
│   ├── ContentCard.astro
│   ├── Footer.astro
│   ├── Navigation.astro
│   ├── RelatedContent.astro
│   ├── ShareActions.astro
│   ├── StructuredData.astro
│   ├── TagList.astro
│   └── ThemeToggle.astro
├── content/            # Content collections
│   ├── collections/
│   ├── essays/
│   ├── garden/
│   ├── lectures/
│   ├── letters/
│   └── speeches/
├── layouts/            # Page layouts
│   ├── ArticleLayout.astro    # For article pages
│   ├── BaseLayout.astro       # Minimal base layout
│   ├── Layout.astro           # Full-featured layout
│   └── ListingLayout.astro    # For archive/listing pages
├── lib/                # Utilities and business logic
│   ├── constants.ts           # Site-wide constants
│   ├── content.ts             # Content utilities
│   ├── data-layer.ts          # Data fetching with caching
│   ├── types.ts               # TypeScript type definitions
│   └── validation.ts          # API request validation
├── pages/              # Routes
│   ├── api/                   # API endpoints
│   ├── collection/[...slug].astro
│   ├── essay/[...slug].astro
│   ├── lecture/[...slug].astro
│   ├── letter/[...slug].astro
│   ├── speech/[...slug].astro
│   └── ...
└── styles/             # Global styles
    ├── article-content.css    # Shared article styles
    └── utilities.css          # CSS custom properties & utilities
```

---

## Type System

### Overview

The type system provides comprehensive type safety across the application using TypeScript.

**Location**: `src/lib/types.ts`

### Key Types

#### Content Types

```typescript
import type { ContentItem, ContentType } from '../lib/types';

// Content type union
type ContentType = 'letter' | 'speech' | 'lecture' | 'essay';

// Content item with type augmentation
interface ContentItem<T extends AnyContentEntry = AnyContentEntry> {
  contentType: ContentType;
  slug: string;
  data: T['data'];
  body: string;
  // ... more fields
}
```

#### Component Props

```typescript
import type { ArticleHeaderProps, ContentCardProps } from '../lib/types';

// Use in components
const props: ArticleHeaderProps = {
  title: 'My Title',
  author: { name: 'Author Name' },
  date: new Date(),
  readTime: 5,
  category: 'Letter'
};
```

### Type Guards

```typescript
import { isLetter, isSpeech, isContentItem } from '../lib/types';

if (isLetter(item)) {
  // TypeScript knows item is LetterEntry
  console.log(item.data.recipient);
}
```

---

## Content Schemas

### Overview

Content schemas define the structure and validation rules for all content types using Zod.

**Location**: `src/content/config.ts`

### Letter Schema

Letters are personal correspondence with rich metadata.

```typescript
{
  title: string;
  author: {
    name: string;
    birth_year?: number;
    death_year?: number;
    bio?: string;
  };
  recipient: string;
  date: Date;
  context: string;
  location?: string;
  excerpt: string;
  signature?: string;
  source: string;
  collections?: string[];
  tags?: string[];
  featured?: boolean;
  drop_cap_color?: string;  // Default: '#e07a5f'
  about?: {
    context?: string;
    significance?: string;
    author_bio?: string;
    recipient_info?: string;
    links?: Array<{
      title: string;
      url: string;
      description?: string;
    }>;
  };
}
```

**Example**:
```markdown
---
title: "Letter to Albert Einstein"
author:
  name: "Marie Curie"
  birth_year: 1867
  death_year: 1934
recipient: "Albert Einstein"
date: 1911-11-23
context: "Written during the first Solvay Conference"
location: "Brussels, Belgium"
excerpt: "On the nature of radioactivity and quantum theory..."
source: "Einstein Archives"
tags: ["physics", "radioactivity", "quantum theory"]
featured: true
---

Dear Professor Einstein,

I hope this letter finds you well...
```

### Speech Schema

Speeches are public addresses with occasion and video support.

```typescript
{
  title: string;
  author: {
    name: string;
    birth_year?: number;
    death_year?: number;
    bio?: string;
  };
  date: Date;
  context: string;
  location?: string;
  occasion?: string;
  excerpt: string;
  source: string;
  collections?: string[];
  tags?: string[];
  featured?: boolean;
  drop_cap_color?: string;  // Default: '#e07a5f'
  video?: {
    youtube_id: string;
    title: string;
    description?: string;
  };
  about?: {
    context?: string;
    significance?: string;
    author_bio?: string;
    occasion_info?: string;
    links?: Array<{
      title: string;
      url: string;
      description?: string;
    }>;
  };
}
```

### Lecture Schema

Lectures are educational talks with institution and series metadata.

```typescript
{
  title: string;
  author: {
    name: string;
    birth_year?: number;
    death_year?: number;
    bio?: string;
  };
  date: Date;
  context: string;
  location?: string;
  institution?: string;
  series?: string;
  lecture_number?: number;
  excerpt: string;
  source: string;
  collections?: string[];
  tags?: string[];
  featured?: boolean;
  drop_cap_color?: string;  // Default: '#e07a5f'
  about?: {
    context?: string;
    significance?: string;
    author_bio?: string;
    series_info?: string;
    links?: Array<{
      title: string;
      url: string;
      description?: string;
    }>;
  };
}
```

### Essay Schema

Essays are written works with publication metadata.

```typescript
{
  title: string;
  author: {
    name: string;
    birth_year?: number;
    death_year?: number;
    bio?: string;
  };
  date: Date;
  context: string;
  publication?: string;      // Where first published
  journal?: string;          // Journal or magazine name
  essay_collection?: string;  // If part of a book collection
  excerpt: string;
  source: string;
  collections?: string[];
  tags?: string[];
  featured?: boolean;
  drop_cap_color?: string;  // Default: '#e07a5f'
  about?: {
    context?: string;
    significance?: string;
    author_bio?: string;
    publication_info?: string;
    links?: Array<{
      title: string;
      url: string;
      description?: string;
    }>;
  };
}
```

### Garden Schema

Garden entries are shorter-form content (thoughts, links, quotes, notes).

```typescript
{
  title: string;
  type: 'thoughts' | 'links' | 'quotes' | 'notes';
  date: Date;
  content?: string;
  tags?: string[];
  featured?: boolean;
  // For quote type
  attribution?: string;
  author?: string;
  source?: string;
  // For link type
  link?: {
    title?: string;
    url?: string;
    domain?: string;
    preview?: string;
  };
  description?: string;
  excerpt?: string;
  private?: boolean;  // Not displayed publicly
}
```

### Collections Schema

Collections metadata for grouping related content.

```typescript
{
  name: string;
  description: string;
  featured_image?: string;
  color?: string;  // Default: '#d4a574'
}
```

### Common Fields

All main content types (letters, speeches, lectures, essays) share these common fields:

- **title**: Display title
- **author**: Author information with optional birth/death years
- **date**: Publication or writing date
- **context**: Brief historical or situational context
- **excerpt**: Short summary for cards and previews
- **source**: Attribution or source reference
- **collections**: Array of collection slugs this content belongs to
- **tags**: Topical tags for categorization and search
- **featured**: Whether to highlight on homepage
- **drop_cap_color**: Custom color for the drop cap initial letter
- **about**: Extended metadata displayed in "About This [Type]" section

---

## Data Layer

### Overview

Centralized data fetching with build-time caching for optimal performance.

**Location**: `src/lib/data-layer.ts`

### Core Functions

#### Fetching Collections

```typescript
import { getLetters, getSpeeches, getAllContentItems } from '../lib/data-layer';

// Get single collection (cached)
const letters = await getLetters();

// Get all content with type information
const allContent = await getAllContentItems();
```

#### Filtering & Sorting

```typescript
import { filterContent, sortByDate } from '../lib/data-layer';

// Filter by multiple criteria
const filtered = filterContent(allContent, {
  contentType: 'letter',
  author: 'Einstein',
  year: 1905,
  tags: ['physics'],
  sort: 'date',
  order: 'desc'
});

// Sort by date
const sorted = sortByDate(items, 'desc'); // newest first
```

#### Navigation

```typescript
import { getAdjacentItems } from '../lib/data-layer';

const { prev, next } = getAdjacentItems(
  letters,
  currentSlug,
  item => item.slug
);
```

#### Search

```typescript
import { searchContent } from '../lib/data-layer';

const results = searchContent(allContent, 'quantum mechanics');
```

### Caching Strategy

The data layer implements build-time caching with error handling:

```typescript
// Collections are cached at module level
const collectionsCache = {};

export async function getLetters() {
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
```

**Benefits**:
- Reduces redundant `getCollection()` calls
- Faster build times
- Consistent data across pages

---

## Component Library

### ContentCard

Reusable card for displaying content items.

**Location**: `src/components/ContentCard.astro`

**Usage**:
```astro
---
import ContentCard from '../components/ContentCard.astro';
import { getAllContentItems } from '../lib/data-layer';

const items = await getAllContentItems();
---

{items.map(item => (
  <ContentCard
    item={item}
    variant="default"  // or 'featured' | 'compact'
    showExcerpt={true}
  />
))}
```

**Variants**:
- `default` - Standard card with full excerpt
- `featured` - Larger, highlighted card
- `compact` - Smaller card without excerpt

---

### ArticleHeader

Header component for article pages with author timeline.

**Location**: `src/components/ArticleHeader.astro`

**Usage**:
```astro
---
import ArticleHeader from '../components/ArticleHeader.astro';
import { calculateReadingTime } from '../lib/content';

const readTime = calculateReadingTime(letter.body);
---

<ArticleHeader
  title={letter.data.title}
  author={letter.data.author}
  date={letter.data.date}
  location={letter.data.location}
  readTime={readTime}
  category="Letter"
/>
```

---

### RelatedContent

Display grid of related content items.

**Location**: `src/components/RelatedContent.astro`

**Usage**:
```astro
---
import RelatedContent from '../components/RelatedContent.astro';
import { getRelatedContent } from '../lib/content';

const related = getRelatedContent(currentItem, allContent, 4);
---

<RelatedContent
  items={related}
  title="More from this author"
/>
```

---

### ShareActions

Action buttons for sharing and copying content.

**Location**: `src/components/ShareActions.astro`

**Usage**:
```astro
---
import ShareActions from '../components/ShareActions.astro';
---

<ShareActions />
```

**Features**:
- Web Share API with fallback
- Copy link to clipboard
- Copy article text
- Toast notifications with ARIA live region for screen readers
- Full keyboard accessibility

---

### TagList

Display tags with archive links.

**Location**: `src/components/TagList.astro`

**Usage**:
```astro
---
import TagList from '../components/TagList.astro';
---

<TagList
  tags={letter.data.tags}
  variant="default"  // or 'compact'
/>
```

---

## Layout System

### BaseLayout

Minimal layout with essential HTML structure.

**Location**: `src/layouts/BaseLayout.astro`

**When to use**: Simple pages, error pages, custom-styled pages

**Usage**:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Page Title"
  description="Page description"
>
  <!-- Your content -->
</BaseLayout>
```

---

### ArticleLayout

Optimized for long-form content with automatic structured data and navigation.

**Location**: `src/layouts/ArticleLayout.astro`

**When to use**: Letter, speech, essay, lecture detail pages

**Usage**:
```astro
---
import ArticleLayout from '../layouts/ArticleLayout.astro';
---

<ArticleLayout
  title={title}
  description={description}
  author={author.name}
  date={date}
  excerpt={excerpt}
  breadcrumbs={[
    { label: 'Letters', url: '/letters' },
    { label: title }
  ]}
  tags={tags}
>
  <!-- Article content -->
</ArticleLayout>
```

---

### ListingLayout

Optimized for archive and collection pages with grid styles.

**Location**: `src/layouts/ListingLayout.astro`

**When to use**: Archive, category, collection listing pages

**Usage**:
```astro
---
import ListingLayout from '../layouts/ListingLayout.astro';
---

<ListingLayout
  title="All Letters"
  description="Browse our collection of historical letters"
  pageType="archive"
>
  <!-- Grid content -->
</ListingLayout>
```

---

## Styling System

### CSS Custom Properties

Comprehensive design tokens for consistent styling.

**Location**: `src/styles/utilities.css`

#### Usage

```css
/* Card styles */
.my-card {
  padding: var(--card-padding);
  border-radius: var(--card-border-radius);
  border: var(--card-border-width) solid var(--card-border-color);
}

/* Spacing */
.section {
  margin-top: var(--space-xl);
  padding: var(--space-lg);
}

/* Typography */
.heading {
  font-size: var(--text-3xl);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}
```

### Utility Classes

Pre-built classes for rapid development:

```html
<!-- Layout -->
<div class="container flex items-center justify-between gap-md">

<!-- Typography -->
<h1 class="heading-1 text-primary mb-lg">

<!-- Cards -->
<div class="card card--compact card--hover">

<!-- Buttons -->
<button class="btn btn--primary">
```

### Shared Article Styles

Common styles for all article pages.

**Location**: `src/styles/article-content.css`

**Usage**:
```css
/* In component or page */
<style>
  @import '../styles/article-content.css';
</style>
```

---

## Best Practices

### Data Fetching

**✅ DO:**
```typescript
// Use data layer with caching
import { getAllContentItems } from '../lib/data-layer';
const items = await getAllContentItems();
```

**❌ DON'T:**
```typescript
// Direct getCollection() calls (no caching)
const letters = await getCollection('letters');
const speeches = await getCollection('speeches');
```

### Type Safety

**✅ DO:**
```typescript
import type { ContentItem } from '../lib/types';

function processItem(item: ContentItem) {
  // Type-safe access
  return item.data.title;
}
```

**❌ DON'T:**
```typescript
function processItem(item: any) {
  // No type safety
  return item.data.title;
}
```

### Component Reuse

**✅ DO:**
```astro
<!-- Use shared components -->
<ContentCard item={item} variant="featured" />
```

**❌ DON'T:**
```astro
<!-- Duplicate card markup -->
<article class="card">
  <h3>{item.data.title}</h3>
  <!-- ... duplicate code ... -->
</article>
```

### Styling

**✅ DO:**
```css
/* Use CSS custom properties */
.element {
  padding: var(--space-lg);
  color: var(--text-primary);
}

/* Use utility classes */
<div class="flex items-center gap-md">
```

**❌ DON'T:**
```css
/* Hardcoded values */
.element {
  padding: 2rem;
  color: #171717;
}
```

---

## Examples

### Creating a New Content Type Page

```astro
---
// src/pages/poem/[...slug].astro
import { getCollection } from 'astro:content';
import ArticleLayout from '../../layouts/ArticleLayout.astro';
import ArticleHeader from '../../components/ArticleHeader.astro';
import ShareActions from '../../components/ShareActions.astro';
import RelatedContent from '../../components/RelatedContent.astro';
import { calculateReadingTime, getRelatedContent } from '../../lib/content';
import { getAllContentItems } from '../../lib/data-layer';

export async function getStaticPaths() {
  const poems = await getCollection('poems');
  return poems.map(poem => ({
    params: { slug: poem.slug },
    props: poem
  }));
}

const poem = Astro.props;
const { Content } = await poem.render();
const readTime = calculateReadingTime(poem.body);
const allContent = await getAllContentItems();
const related = getRelatedContent({ ...poem, contentType: 'poem' }, allContent, 4);
---

<ArticleLayout
  title={`${poem.data.title} - Paper Lanterns`}
  description={poem.data.excerpt}
  author={poem.data.author.name}
  date={poem.data.date}
  excerpt={poem.data.excerpt}
  breadcrumbs={[
    { label: 'Poems', url: '/poems' },
    { label: poem.data.title }
  ]}
  tags={poem.data.tags}
>
  <main class="reading-container">
    <article class="poem">
      <ArticleHeader
        title={poem.data.title}
        author={poem.data.author}
        date={poem.data.date}
        readTime={readTime}
        category="Poem"
      />

      <div class="poem-content">
        <Content />
      </div>

      <ShareActions />
    </article>

    <RelatedContent items={related} />
  </main>
</ArticleLayout>
```

### Creating a Filtered Listing Page

```astro
---
// src/pages/letters/by-year/[year].astro
import ListingLayout from '../../../layouts/ListingLayout.astro';
import ContentCard from '../../../components/ContentCard.astro';
import { getLetters, filterContent } from '../../../lib/data-layer';

export async function getStaticPaths() {
  const letters = await getLetters();
  const years = [...new Set(letters.map(l => l.data.date.getFullYear()))];

  return years.map(year => ({
    params: { year: year.toString() },
    props: { year }
  }));
}

const { year } = Astro.props;
const letters = await getLetters();
const withType = letters.map(l => ({ ...l, contentType: 'letter' as const }));
const filtered = filterContent(withType, { year });
---

<ListingLayout
  title={`Letters from ${year}`}
  description={`Browse ${filtered.length} letters written in ${year}`}
  pageType="archive"
>
  <div class="listing-container">
    <header class="listing-header">
      <h1 class="listing-title">Letters from {year}</h1>
      <p class="listing-description">
        {filtered.length} letters written in {year}
      </p>
    </header>

    <div class="content-grid">
      {filtered.map(letter => (
        <ContentCard item={letter} />
      ))}
    </div>
  </div>
</ListingLayout>
```

---

## Garden & Collections Features

### Garden

The Garden is a digital space for shorter-form content like thoughts, links, quotes, and notes.

**Location**: `src/content/garden/`

**Content Types**:
- **thoughts**: Personal reflections and observations
- **links**: Curated external resources with previews
- **quotes**: Notable quotations with attribution
- **notes**: Quick reference notes

**Usage Example**:

```markdown
---
title: "On the Nature of Time"
type: "thoughts"
date: 2024-01-15
tags: ["philosophy", "physics"]
featured: false
---

Time is not a river flowing in one direction...
```

```markdown
---
title: "Fascinating Article on Quantum Computing"
type: "links"
date: 2024-01-15
tags: ["technology", "quantum"]
link:
  title: "The Future of Quantum Computing"
  url: "https://example.com/quantum"
  domain: "example.com"
  preview: "A comprehensive look at quantum computing..."
description: "This article provides excellent insights..."
---
```

```markdown
---
title: "Einstein on Imagination"
type: "quotes"
date: 2024-01-15
author: "Albert Einstein"
attribution: "Albert Einstein"
source: "1929 interview"
tags: ["creativity", "science"]
---

"Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world."
```

**Accessing Garden Entries**:

```typescript
import { getGardenEntries } from '../lib/data-layer';

const gardenEntries = await getGardenEntries();

// Filter by type
const thoughts = gardenEntries.filter(entry => entry.data.type === 'thoughts');
const links = gardenEntries.filter(entry => entry.data.type === 'links');

// Exclude private entries
const publicEntries = gardenEntries.filter(entry => !entry.data.private);
```

### Collections

Collections group related content across different types (letters, speeches, essays, lectures).

**Location**: `src/content/collections/`

**Purpose**:
- Thematic grouping (e.g., "Civil Rights Movement", "Scientific Revolution")
- Curated reading paths
- Featured topic pages

**Creating a Collection**:

```markdown
---
name: "The Manhattan Project"
description: "Letters, speeches, and essays related to the development of atomic energy"
featured_image: "/images/collections/manhattan-project.jpg"
color: "#8B4513"
---

This collection brings together correspondence, speeches, and writings from scientists involved in the Manhattan Project...
```

**Accessing Collections**:

```typescript
import { getCollections } from '../lib/data-layer';

const collections = await getCollections();

// Get a specific collection
const collection = collections.find(c => c.slug === 'manhattan-project');
```

**Filtering Content by Collection**:

```typescript
import { getAllContentItems, filterContent } from '../lib/data-layer';

const allContent = await getAllContentItems();

// Get all content in a collection
const collectionContent = filterContent(allContent, {
  collections: ['manhattan-project']
});
```

**Tagging Content with Collections**:

In any letter, speech, essay, or lecture frontmatter:

```markdown
---
title: "Letter to President Roosevelt"
author:
  name: "Albert Einstein"
collections: ["manhattan-project", "world-war-ii"]
tags: ["physics", "policy", "atomic-energy"]
---
```

### Best Practices

**Garden**:
- Keep entries focused and concise
- Use appropriate type for content
- Mark personal notes as `private: true`
- Include relevant tags for discoverability
- For links, include domain and preview for better UX

**Collections**:
- Choose descriptive, specific names
- Write clear descriptions explaining the theme
- Use consistent color schemes across related collections
- Tag content with collections sparingly (1-3 per item)
- Create collection landing pages for featured collections

---

## Migration Guide

### Migrating Existing Pages to New Architecture

1. **Replace direct getCollection() calls**:
   ```typescript
   // Before
   const letters = await getCollection('letters');

   // After
   import { getLetters } from '../lib/data-layer';
   const letters = await getLetters();
   ```

2. **Use typed imports**:
   ```typescript
   // Before
   import type { CollectionEntry } from 'astro:content';

   // After
   import type { ContentItem, LetterEntry } from '../lib/types';
   ```

3. **Replace custom card markup**:
   ```astro
   <!-- Before -->
   <article>
     <h3>{item.data.title}</h3>
     <!-- ... -->
   </article>

   <!-- After -->
   <ContentCard item={item} />
   ```

4. **Use appropriate layout**:
   ```astro
   <!-- Before -->
   <Layout ...>

   <!-- After -->
   <ArticleLayout ...>  <!-- for articles -->
   <ListingLayout ...>  <!-- for archives -->
   ```

---

## Performance Considerations

### Build-Time Caching

All data-layer functions use build-time caching, reducing redundant API calls during static generation.

### CSS Optimization

- Shared styles prevent duplication
- Utility classes are tree-shakeable
- Critical CSS inlined in layouts

### Component Optimization

- Components are pre-rendered at build time
- Minimal client-side JavaScript
- Lazy-loaded scripts when needed

---

## Future Improvements

### Planned Enhancements

1. **Unified Content Template** - Single template for all content types
2. **Client-Side Utilities Module** - Shared client utilities in `src/lib/client-utils.ts`
3. **API Response Utilities** - Standardized API responses in `src/lib/api-utils.ts`
4. **Enhanced Validation** - More comprehensive schemas and sanitization

### Migration Path

These improvements can be added incrementally without disrupting existing functionality.

---

## Contributing

When adding new features:

1. **Use type-safe imports** from `src/lib/types.ts`
2. **Fetch data** through `src/lib/data-layer.ts`
3. **Reuse components** when possible
4. **Follow styling patterns** using CSS custom properties
5. **Add JSDoc comments** for new utilities
6. **Update this documentation** for significant changes

---

## Questions?

For architecture questions or suggestions, please open an issue on GitHub.
