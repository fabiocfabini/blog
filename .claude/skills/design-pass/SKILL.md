---
name: design-pass
description: >-
  Design or visually polish any blog page (home, blog index, post page, or a new
  component) to a consistent "Warm Editorial" look. Use whenever the task is to
  make a page look good, lay out a new page, restyle something, or do a visual
  pass. Encodes the design language (type, color, spacing), the per-page layout
  rules, and a build -> screenshot -> critique -> iterate loop so the result is
  actually verified, not just rendered once.
---

# design-pass — make blog pages look good, consistently

The owner is a strong programmer but not a designer. This skill replaces "design
taste" with **fixed decisions + a feedback loop**, so any page comes out
consistent and polished without requiring on-the-spot taste calls.

**This is a TASK-time tool.** It does not invent identity or content — it applies
a design language and a process. Personal copy (name, bio, which socials) comes
from the user.

## How this fires
Use it whenever a task is "make X look nice", "lay out the home/blog/post page",
"restyle", "polish the UI", or "build a new component that needs to look right".

## The non-negotiable process (do not skip the loop)
A page is **not done** when it first renders. Every time:

1. **Build/edit** the Astro layout/component + CSS using the tokens below.
2. **Screenshot it** — invoke the **run** skill to launch the dev server and
   capture the page at desktop **and** mobile widths.
3. **Critique** the screenshot against (a) the reference sites and (b) the QA
   checklist below. Name what's wrong out loud.
4. **Iterate at least once.** Fix the issues, screenshot again. Repeat until the
   checklist passes.

Skipping the screenshot step is the single most common way a "designed" page ends
up looking off. Don't.

## Reference sites (anchor every critique to these)
The chosen direction is **Warm Editorial** — magazine-like, serif headlines, warm
paper background, one accent, content-first, room for photos.
- https://www.sarasoueidan.com — editorial, accessible, beautiful type.
- https://blog.jim-nielsen.com — restrained editorial, strong hierarchy.
- https://leerob.com — for general "clean and fast" polish discipline.

When critiquing, ask: "Does this feel as considered as those? If not, what's the
gap — spacing, type hierarchy, color, or alignment?"

## Design language — Warm Editorial (concrete tokens)
Pin these as CSS custom properties in one global stylesheet so every page shares
them. They are deliberately specific; **they are also easy to tweak** — change the
token, not the components. If the user wants a different feel, adjust here first.

```css
/* Light (default) */
:root {
  --bg:        #FBF8F3;  /* warm paper            */
  --surface:   #FFFFFF;  /* cards / raised areas  */
  --ink:       #211C16;  /* primary text          */
  --muted:     #6F665A;  /* secondary text, meta  */
  --hairline:  #E7DFD2;  /* borders, dividers     */
  --accent:    #B0532C;  /* terracotta — links, emphasis */
  --accent-2:  #3C6B53;  /* pine green — optional, for the sports/outdoors side */

  /* Type — two fonts max: a CONVENTIONAL serif display + clean body */
  --font-display: "Source Serif 4", Georgia, serif;  /* headings, hero       */
  --font-body:    "Inter", system-ui, sans-serif;    /* body, UI, nav        */
  --measure:      65ch;                              /* max reading width    */

  /* Spacing scale (use these, don't free-hand margins) */
  --s1: 4px;  --s2: 8px;  --s3: 12px; --s4: 16px;
  --s5: 24px; --s6: 32px; --s7: 48px; --s8: 64px; --s9: 96px;

  --radius: 8px;
}

/* Dark — same warm family, inverted. Toggled via data-theme on <html>. */
:root[data-theme="dark"] {
  --bg:       #1B1713;  /* warm espresso, not pure black   */
  --surface:  #241F19;
  --ink:      #F1EADD;
  --muted:    #A99D8B;
  --hairline: #38322A;
  --accent:   #D5764C;  /* lifted terracotta for contrast on dark */
  --accent-2: #6BA888;
}
```

Rules of thumb that come with these tokens:
- **Two fonts, period.** Serif (`--font-display`) for headings and the hero line;
  body font everywhere else. Adding a third font breaks the look.
- **One accent does the work.** `--accent` for links/emphasis; `--accent-2` only
  for sports/outdoors content if a second color is genuinely wanted.
- **Reading width is capped** at `--measure`. Long lines are the #1 readability
  killer for a blog.
- **Spacing comes from the scale.** No magic numbers.
- **Type scale** ~1.25 ratio. Body ~18px. Hero headline large and confident
  (serif). Generous line-height for body (~1.6).
- **Motion is subtle or absent.** A gentle fade/slide on load and clean hover
  states (underline on links) — nothing bouncy.

## Dark theme (first-class — both themes must work)
The site ships **light + dark**, user-selectable. This is a design rule, not an
afterthought, so it's specified here and applied on every page.
- **Every color comes from the tokens above — never hardcode a hex in a component.**
  Switching theme = swapping the token block, nothing else. This is what makes dark
  mode "free" and consistent across pages.
- **Default to the OS preference** (`prefers-color-scheme`) on first visit, then let
  a toggle override it, persisted (e.g. `localStorage`).
- Apply the choice as `data-theme="dark"` on `<html>`. Include a tiny inline `<head>`
  script that sets it **before first paint** to avoid a flash of the wrong theme.
- The toggle lives in the nav (footer is fine too). Give it an accessible label and a
  clear sun/moon icon.
- The dark accent is **lifted** on purpose so links stay legible on the dark bg —
  verify contrast in BOTH themes (see QA).

## Per-page layout rules (the owner's requirements, baked in)

### Home — single, non-scrolling viewport
- Fits in **100vh** on a normal laptop/desktop: a `min-height: 100vh` flex column.
- Top: small wordmark (name) + minimal nav (Blog, CV).
- Center: large serif **hero line** — who they are in 1–2 lines — plus one short
  supporting sentence. This is the "present who I am" moment.
- Bottom: **footer pinned to the bottom of the viewport** with social + CV links.
  Start with **GitHub only**, but build the links from a small **data list** (one
  entry = label + url + icon) so adding LinkedIn/Strava later is a one-line change,
  not a layout edit.
- **Accessibility guardrail:** "non-scroll" is for typical screens only. On short
  or zoomed/small viewports, content must **never be clipped** — allow it to
  scroll rather than hide. Test at 360px wide and 200% zoom.

### Blog index (/blog) — searchable card list
- Heading + a **filter bar**: free-text search by **title**, **tag** chips to
  filter, and a **sort** control (newest / shortest reading time).
- Filtering/search is a small client-side island (Astro). Keep it the only JS on
  the page; it must degrade to a full list if JS is off.
- Each post = a **card** with: contextual **thumbnail image**, serif title,
  description, **reading time**, and tag chips.

### Post page (/blog/[slug]) — ToC left, content center
- **Sticky table of contents on the left**, auto-generated from the post's `h2`/`h3`
  headings, with the current section highlighted on scroll.
- **Centered content column** capped at `--measure`.
- A **contextual hero image at the top** of every post, plus title, date, reading
  time, tags.
- Style the full prose kit: headings, links, blockquotes, lists, code blocks,
  images (with captions), and an optional full-bleed image treatment.
- **Narrow screens:** the left ToC collapses into a top "Contents" accordion (or
  hides) — content stays single-column and readable.

## Content contract this implies
- Every post needs a contextual image, so the content-collection schema gains a
  `cover` field (image + alt). The hero (post) and thumbnail (index) both read it.
- Reading time stays **derived**, never hand-authored (see stack.md).
- **Preserve the core contract:** a new post is still ONE content file. All design
  lives in layouts/components/CSS — never require editing per-post files beyond
  front matter.

## QA checklist (the page must pass before you call it done)
- [ ] Contrast meets WCAG AA in BOTH themes (ink/muted/accent on bg).
- [ ] Theme toggle works, persists, and there's no flash of the wrong theme on load.
- [ ] Looks right at 360px, 768px, and 1280px — screenshot all three.
- [ ] Reading width capped at `--measure`; line-height generous.
- [ ] Spacing uses the scale; alignment is consistent (things line up).
- [ ] Visible keyboard focus states on every link/control.
- [ ] Fonts have a fallback in the stack; no flash of invisible text.
- [ ] Images have `alt`, are sized/optimized, and don't cause layout shift.
- [ ] Home fits one viewport on laptop AND degrades to scroll when cramped.
- [ ] No console errors; page is fast (it's a portfolio — speed = credibility).

## Constraints (from the project grounding)
- **Astro**, no theme lock-in. Plain Astro components + scoped/global CSS. Minimal
  JS islands, only where needed (index filter, ToC scroll-spy).
- **Accessibility and performance are part of the design**, not extras — the site
  is a portfolio for an engineer who should "walk the talk".
- **Light + dark themes are both in scope** (see "Dark theme" above). Every color
  comes from a token, so both themes stay consistent with no extra per-page work.
