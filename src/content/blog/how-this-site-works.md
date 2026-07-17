---
title: How this site works
date: 2026-07-16
summary: The stack behind this site — Astro, Markdown content collections, one animated SVG, and a GitHub Actions deploy — and why each piece earned its spot.
tags: [meta, astro, static-sites]
draft: false
---

This site is a static Astro build deployed to GitHub Pages. No CMS, no database, no
client-side framework, no trackers. Here's what's actually in it.

## The stack

- **Astro** with static output. Every page is HTML at build time. The only JavaScript
  is one small script for the cursor ring and scroll reveals; everything else is CSS.
- **Markdown content collections** with typed schemas. Projects live in
  `src/content/projects/`, posts in `src/content/blog/`. Frontmatter is validated at
  build time with Zod, so a typo'd date fails the build instead of shipping.
- **Plain CSS** with custom properties. Six color tokens, three typefaces, one
  `global.css`. No Tailwind — for a site this size, a framework would be more
  configuration than CSS.
- **Self-hosted fonts** (Bricolage Grotesque, Atkinson Hyperlegible, IBM Plex Mono) as
  woff2 with `font-display: swap` and size-adjusted fallbacks, so text doesn't jump
  when the fonts land.

## Publishing workflow

The whole requirement was: adding a post must be nothing more than dropping a Markdown
file and pushing.

```bash
cp _templates/post.md src/content/blog/my-post.md
# write it, set draft: false
git add . && git commit -m "post" && git push
```

A GitHub Actions workflow builds on every push to `main` and deploys to Pages. Posts
with `draft: true` build locally but are filtered out of production and the RSS feed.

## The look

Dark forest green, because it's my favorite color, with a single leaf-green accent and
IBM Plex Mono for the small annotations — dates, stack tags, reading times. Six color
tokens total, defined once in `global.css`; changing the site's whole mood is a
seven-line edit.

That's the whole system. The best part is what isn't here: nothing to update, renew,
or patch — just Markdown files and a build.
