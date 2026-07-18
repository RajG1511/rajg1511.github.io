// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed as a GitHub Pages *user site* (rajg1511.github.io), so base stays '/'.
// If a custom domain is attached later, change `site` here — nothing else.
export default defineConfig({
  site: 'https://rajg1511.github.io',
  output: 'static',
  // Preload pages when their links enter the viewport so clicks feel instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
