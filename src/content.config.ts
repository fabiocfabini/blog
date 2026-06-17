import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The blog collection: ONE Markdown file in src/content/blog/ = ONE post.
// Keep files flat (no subfolders) so a post's slug is just its filename.
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
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
