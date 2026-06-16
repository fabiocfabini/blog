# Tech stack & deployment

## Decisions
- **Generator: Astro.** Chosen for full control over markup/rendering with no theme
  lock-in, while content collections keep "one Markdown/MDX file = one post." Owner
  writes their own components/layouts/CSS. Interactive JS "islands" can be added later
  only where wanted.
- **Deploy: GitHub Pages**, built and published via a GitHub Actions workflow.
  Custom domain supported later.

## The core contract
**Adding a blog post = creating ONE new content file** (e.g. `src/content/blog/<slug>.md`)
that matches the post template/schema. No other files should need editing for a normal
new post. Any `TASK:` session must preserve this property.

## Implementation notes for the first scaffolding TASK
- Use Astro **content collections** with a typed schema for the front matter in
  `project.md`'s content model.
- Derive reading time from the rendered content (e.g. an Astro/remark reading-time
  integration) — do not store it in front matter.
- Three routes: home (`/`), blog index (`/blog`), post (`/blog/[slug]`).
- Add the GitHub Pages Actions workflow (`astro build` → publish `dist/`); set Astro's
  `site`/`base` config for the Pages URL.

## Alternatives considered (don't re-litigate without reason)
- **Eleventy** — even more flexible but more DIY plumbing; rejected for higher friction.
- **Jekyll** — easiest GH Pages path but theme-shaped + dated toolchain; rejected
  against the owner's "full customization" priority.
- **Deploy:** Cloudflare Pages / Netlify are viable free alternatives (better previews/
  CDN); GitHub Pages chosen for simplicity and the owner's stated preference.
