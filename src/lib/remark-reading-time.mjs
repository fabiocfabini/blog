import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Remark plugin: compute reading time from the rendered Markdown content and
 * stash it on the post's frontmatter as `minutesRead` (e.g. "3 min read").
 * Read it back in pages via the `remarkPluginFrontmatter` returned by render().
 */
export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
