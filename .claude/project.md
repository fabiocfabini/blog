# Project: personal blog

## Purpose
A space to share the owner's learning adventures (deep dives into popular
technologies) and sports adventures. Doubles as a **portfolio link in job
applications**, so it should read as polished and personal.

## Audience
Recruiters/hiring managers, plus peers who share the owner's interests.

## Site structure (target)
1. **Home** — short personal intro + links to: the blog, the owner's CV, and chosen
   socials.
2. **Blog index** — lists posts, each with estimated **reading time**, **keywords/
   topics**.
3. **Post page** — renders the post's text, images, and video.

## Content model
- A post is a single content file — or a per-post `<slug>/index.md` folder when it
  carries images — with front matter:
  `title`, `date`, `description`, `tags`/`topics` (keywords), optional `draft`,
  optional `cover` (+ `coverAlt`).
- **Reading time is derived** from content (not authored by hand).
- Posts support text, images, and embedded/hosted video.

## Non-goals (for now)
- No comments, no analytics-heavy tooling, no CMS. Keep it static and simple until a
  concrete need appears.
