# Paper Lanterns

A curated digital archive of timeless letters, speeches, essays, and lectures from history's most influential voices. Built with Astro for optimal performance and reading experience.

## Overview

Paper Lanterns preserves and presents historical writings in a clean, distraction-free reading environment. Each piece is carefully transcribed and presented with historical context, making it easy to discover and engage with important works from the past.

## Features

- **Four Content Types**: Letters, speeches, essays, and lectures
- **Rich Metadata**: Author information, historical context, significance notes
- **Advanced Search**: Full-text search across all content
- **Related Content**: Discover connections through author and topic relationships
- **Reading Experience**: Optimized typography, reading time estimates, progress tracking
- **Archive & Collections**: Browse by type, author, or chronologically
- **Responsive Design**: Beautiful on all devices
- **Performance**: Build-time rendering with aggressive caching

## Project Structure

```
/
├── public/                # Static assets
├── src/
│   ├── components/       # Reusable Astro components
│   │   ├── ArticleHeader.astro
│   │   ├── ContentCard.astro
│   │   ├── RelatedContent.astro
│   │   ├── ShareActions.astro
│   │   └── TagList.astro
│   ├── content/          # Content collections (markdown)
│   │   ├── letters/
│   │   ├── speeches/
│   │   ├── essays/
│   │   └── lectures/
│   ├── layouts/          # Page layouts
│   │   └── Layout.astro
│   ├── lib/              # Utilities and data layer
│   │   ├── data-layer.ts    # Centralized data fetching with caching
│   │   └── content.ts       # Content utilities
│   ├── pages/            # Route pages
│   │   ├── api/          # JSON API endpoints
│   │   ├── letter/[...slug].astro
│   │   ├── speech/[...slug].astro
│   │   ├── essay/[...slug].astro
│   │   ├── lecture/[...slug].astro
│   │   ├── archive.astro
│   │   ├── letters.astro
│   │   ├── speeches.astro
│   │   ├── essays.astro
│   │   ├── lectures.astro
│   │   └── index.astro
│   └── styles/           # Global styles
└── ARCHITECTURE.md       # Technical documentation

```

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro check` | Run type checking |

## Development

### Adding Content

1. Create a new markdown file in the appropriate collection folder (`src/content/letters/`, etc.)
2. Add frontmatter following the collection schema (see ARCHITECTURE.md)
3. Write content in markdown
4. The page will be automatically generated at build time

### Data Layer

All data fetching goes through `src/lib/data-layer.ts`, which provides:
- Build-time caching for performance
- Type-safe content access
- Utility functions for sorting, filtering, and navigation

### Components

Reusable components in `src/components/` handle common UI patterns:
- `ArticleHeader`: Title, author, date, reading time with author timeline
- `ContentCard`: Uniform card display for all content types
- `RelatedContent`: Grid of related items by author and tags
- `ShareActions`: Share, copy link, copy text functionality
- `TagList`: Tag display with archive links

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation including:
- Content schema definitions
- Data layer architecture
- Component API reference
- Performance optimizations
- Future enhancements

## License

All historical content in this project is in the public domain. The code is available under the MIT license.

## Contributing

Contributions welcome! Please ensure:
- Historical accuracy of transcriptions
- Proper attribution and source citations
- Adherence to existing content schemas
- Code follows the data layer and component patterns
