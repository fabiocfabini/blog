// @ts-check
import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// DEPLOY (GitHub Pages): edit `site`/`base` here only.
// Current: project site served at https://fabiocfabini.github.io/blog/
// For a user site or custom domain, set `site` and change `base` to '/'.
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  site: 'https://fabiocfabini.github.io',
  base: '/blog',
  markdown: {
    // Derives reading time from rendered content; exposed as
    // `remarkPluginFrontmatter.minutesRead` after render(entry).
    remarkPlugins: [remarkReadingTime],
  },
});
