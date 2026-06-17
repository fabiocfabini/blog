import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The blog collection. A post is EITHER:
//   • a flat file:           src/content/blog/<slug>.md          (quick, text-only)
//   • a co-located folder:   src/content/blog/<slug>/index.md    (keeps images with the post)
// Either way the slug is <slug>, and adding a post needs no other file edits.
const blog = defineCollection({
  loader: glob({
    pattern: ['*.md', '*/index.md'],
    base: './src/content/blog',
    // slug = filename (flat) or folder name (co-located): strip a trailing /index and .md
    generateId: ({ entry }) => entry.replace(/(?:\/index)?\.md$/, ''),
  }),
  // `image()` optimizes a cover co-located with the post (e.g. cover: ./foo.jpg).
  // Optional: posts without one fall back to a generated gradient banner.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().default(''),
    }),
});

export const collections = { blog };
