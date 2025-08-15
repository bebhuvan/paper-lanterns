# Content Templates

This directory contains templates for creating new content in the Paper Lanterns project.

## How to Use Templates

1. **Copy the appropriate template** to the correct content directory:
   - Essays: `src/content/essays/`
   - Speeches: `src/content/speeches/`
   - Letters: `src/content/letters/`
   - Lectures: `src/content/lectures/`

2. **Rename the file** using the naming convention: `author-title-year.md`
   - Example: `tagore-nationalism-west-1917.md`

3. **Fill in all the fields** in the frontmatter:
   - Replace placeholder text with actual content
   - Ensure dates are in YYYY-MM-DD format
   - Add appropriate tags and collections
   - Include proper source attribution and links

## Required Fields

### All Content Types
- `title`: The title of the content
- `author`: Author information (name, birth/death years, bio)
- `date`: Publication or delivery date
- `context`: Brief description with source attribution
- `source`: Original source reference
- `tags`: Array of relevant tags
- `about`: Complete about section with context, significance, author bio, and links

### Content-Specific Fields
- **Speeches**: `location`, `occasion`, `video` (optional)
- **Letters**: `recipient`, `signature` (optional)
- **Essays**: `source_url` for direct links

## About Section

Every piece of content should include a comprehensive `about` section with:

- **context**: Historical background and circumstances
- **significance**: Why this content matters
- **author_bio**: Detailed biographical information
- **links**: Array of relevant external resources (Wikisource, Wikipedia, etc.)

## Source Attribution

Always include proper source attribution:
- Link to Wikisource when available
- Include original publication details
- Verify content is in the public domain
- Add Wikipedia links for biographical context

## Example

See existing content files for reference:
- `src/content/essays/tagore-striving-swaraj-1925.md`
- `src/content/speeches/nehru-tryst-destiny-1947.md`
- `src/content/letters/gandhi-hitler-1939.md`