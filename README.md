# Personal Blog

A static blog built with [Astro](https://astro.build). This README covers the
**content-creation workflow** — the handful of commands you use to write a post
and see it locally.

> Requires **Node 22+**. If a command complains your Node is too old, run
> `nvm use 24` first, then retry.

## Setup (once)

Install dependencies. You only do this the first time, or after the dependency
list changes:

```bash
npm install
```

## Writing a post

**Adding a post = creating ONE Markdown file.** Nothing else needs editing.

1. Create a file in `src/content/blog/` — the filename becomes the URL.
   Example: `src/content/blog/my-first-trip.md`

2. Start it with this front matter, then write the post in Markdown below it:

   ```markdown
   ---
   title: "Your post title"
   date: 2026-06-16
   description: "One or two sentences shown on the blog index."
   tags: ["topic-one", "topic-two"]
   draft: false
   ---

   Write your post here in plain Markdown.
   ```

   - `draft: true` hides the post from the published site but still shows it
     while you're previewing locally.
   - **Reading time is calculated automatically** — never type it by hand.

3. Preview it (see next section).

## See it locally while you write

```bash
npm run dev
```

Open **http://localhost:4321/blog/** in your browser and click **Blog** to find
your post. The page refreshes automatically every time you save. Press
**Ctrl + C** in the terminal to stop the server.

## Check the final build (optional)

These produce and preview the exact files that get published. You usually don't
need them — they're for double-checking before deploy.

```bash
npm run build      # builds the finished site into the dist/ folder
npm run preview    # serves that built site at http://localhost:4321/blog/
```

## Command reference

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (first time / after changes). |
| `npm run dev` | Live preview while writing — auto-refreshes. **Use this most.** |
| `npm run build` | Build the final static site into `dist/`. |
| `npm run preview` | View the built `dist/` site locally. |

Stop any running server with **Ctrl + C**.
