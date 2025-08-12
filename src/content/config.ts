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
  collections: collectionsContent,
  letters_backup: lettersBackup,
};