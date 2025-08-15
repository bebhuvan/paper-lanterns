import { defineCollection, z } from 'astro:content';

const letters = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.object({
      name: z.string(),
      birth_year: z.number().optional(),
      death_year: z.number().optional(),
      bio: z.string().optional(),
    }),
    recipient: z.string(),
    date: z.coerce.date(),
    context: z.string(),
    location: z.string().optional(),
    excerpt: z.string(),
    signature: z.string().optional(),
    source: z.string(),
    collections: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    drop_cap_color: z.string().default('#e07a5f'),
    about: z.object({
      context: z.string().optional(),
      significance: z.string().optional(),
      author_bio: z.string().optional(),
      recipient_info: z.string().optional(),
      links: z.array(z.object({
        title: z.string(),
        url: z.string().url(),
        description: z.string().optional(),
      })).default([]),
    }).optional(),
  }),
});

const speeches = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.object({
      name: z.string(),
      birth_year: z.number().optional(),
      death_year: z.number().optional(),
      bio: z.string().optional(),
    }),
    date: z.coerce.date(),
    context: z.string(),
    location: z.string().optional(),
    occasion: z.string().optional(),
    excerpt: z.string(),
    source: z.string(),
    collections: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    drop_cap_color: z.string().default('#e07a5f'),
    video: z.object({
      youtube_id: z.string(),
      title: z.string(),
      description: z.string().optional(),
    }).optional(),
    about: z.object({
      context: z.string().optional(),
      significance: z.string().optional(),
      author_bio: z.string().optional(),
      occasion_info: z.string().optional(),
      links: z.array(z.object({
        title: z.string(),
        url: z.string().url(),
        description: z.string().optional(),
      })).default([]),
    }).optional(),
  }),
});

const lectures = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.object({
      name: z.string(),
      birth_year: z.number().optional(),
      death_year: z.number().optional(),
      bio: z.string().optional(),
    }),
    date: z.coerce.date(),
    context: z.string(),
    location: z.string().optional(),
    institution: z.string().optional(),
    series: z.string().optional(),
    lecture_number: z.number().optional(),
    excerpt: z.string(),
    source: z.string(),
    collections: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    drop_cap_color: z.string().default('#e07a5f'),
    about: z.object({
      context: z.string().optional(),
      significance: z.string().optional(),
      author_bio: z.string().optional(),
      series_info: z.string().optional(),
      links: z.array(z.object({
        title: z.string(),
        url: z.string().url(),
        description: z.string().optional(),
      })).default([]),
    }).optional(),
  }),
});

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.object({
      name: z.string(),
      birth_year: z.number().optional(),
      death_year: z.number().optional(),
      bio: z.string().optional(),
    }),
    date: z.coerce.date(),
    context: z.string(),
    publication: z.string().optional(), // Where it was first published
    journal: z.string().optional(), // Journal or magazine name
    essay_collection: z.string().optional(), // If part of a book collection
    excerpt: z.string(),
    source: z.string(),
    collections: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    drop_cap_color: z.string().default('#e07a5f'),
    about: z.object({
      context: z.string().optional(),
      significance: z.string().optional(),
      author_bio: z.string().optional(),
      publication_info: z.string().optional(),
      links: z.array(z.object({
        title: z.string(),
        url: z.string().url(),
        description: z.string().optional(),
      })).default([]),
    }).optional(),
  }),
});

const collectionsContent = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    featured_image: z.string().optional(),
    color: z.string().default('#d4a574'),
  }),
});

const garden = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['thoughts', 'links', 'quotes', 'notes']),
    date: z.coerce.date(),
    content: z.string().optional(), // Make content optional since some posts might be just links or quotes
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    // For quote type posts
    attribution: z.string().optional(),
    author: z.string().optional(),
    source: z.string().optional(),
    // For link type posts - all fields optional to prevent build failures
    link: z.object({
      title: z.string().optional(),
      url: z.string().url().optional(),
      domain: z.string().optional(),
      preview: z.string().optional(),
    }).optional(),
    // Additional fields for flexibility
    description: z.string().optional(),
    excerpt: z.string().optional(),
    // For private notes (not displayed publicly)
    private: z.boolean().default(false),
  }),
});

// Define letters_backup as a collection but mark it as draft/ignored
// This prevents the deprecation warning about auto-generated collections
const lettersBackup = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Minimal schema just to satisfy the collection requirement
    // These files are backups and not used in the site
    draft: z.boolean().default(true),
  }).passthrough(), // Allow additional fields without validation
});

export const collections = {
  letters,
  speeches,
  lectures,
  essays,
  collections: collectionsContent,
  garden,
  letters_backup: lettersBackup,
};