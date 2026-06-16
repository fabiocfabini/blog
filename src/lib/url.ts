// Base-aware internal links. Astro serves the whole site under `base`
// (import.meta.env.BASE_URL, e.g. "/blog/"), but does NOT auto-prepend it to
// href attributes — so build every internal link with this helper.
//
//   href()                 -> "/blog/"
//   href('blog')           -> "/blog/blog"
//   href('blog/my-post')   -> "/blog/blog/my-post"
//
// Switching deploy mode (base: '/') needs no changes here.
const base = import.meta.env.BASE_URL;

export function href(path = ''): string {
  const clean = String(path).replace(/^\/+/, '');
  return base.endsWith('/') ? base + clean : `${base}/${clean}`;
}
