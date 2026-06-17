---
title: "Hello, world — and how this blog works"
date: 2026-06-16
description: "A reference post showing the template: text, images, code, and video. Kept as a draft so it never deploys — read it locally with npm run dev."
tags: ["meta", "astro"]
draft: true   # local-only reference: hidden from the deployed site, visible in `npm run dev`
# Optional hero image (co-located in this folder, gets optimized):
# cover: ./cover.jpg
# coverAlt: "Short description of the cover image"
---

Welcome! This is a sample post. To publish a new one, add **either** a single
Markdown file `src/content/blog/<slug>.md` **or** — if the post has its own images —
a folder `src/content/blog/<slug>/index.md` with the images beside it. Nothing else
needs editing: the slug comes from the filename (or folder name), and the front
matter above drives everything on the page and the blog index.

The table of contents on the left is generated automatically from your `##`/`###`
headings, and the reading time is computed from the content — you never type either
by hand.

## Text

Write in plain Markdown: **bold**, _italic_, [links](https://astro.build), lists,
and `inline code`. Headings like the one above show up automatically (and become the
ToC entries).

## Images

Three ways to add an image, best first:

- **Co-locate it** in this post's folder and reference it relatively — Astro
  optimizes it (resizes, modern formats, lazy-loads):

  ```md
  ![A trail at dawn](./trail.jpg)
  ```

- **A hero cover** goes in the front matter (also co-located, also optimized). It
  shows at the top of the post and as the thumbnail on the blog index:

  ```yaml
  cover: ./cover.jpg
  coverAlt: "Short description of the cover image"
  ```

- **Unprocessed or fixed-URL files** go in `public/` (referenced from the site
  root); remote URLs work too:

  ![A placeholder banner](https://placehold.co/800x300)

## Video

Hosted video (e.g. YouTube) embeds with plain HTML right inside Markdown:

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/aqz-KE-bpKQ"
  title="Video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen></iframe>

## Drafts & visibility

This post sets `draft: true` in its front matter. Draft posts are **hidden from the
deployed site** (the production build skips them — no page, not in the index) but
still **show up in local `npm run dev`**. That's how this tutorial stays around for
you without ever being published; it's also how you keep a work-in-progress post out
of sight. Set `draft: false` (or remove the line) when you're ready to publish.
