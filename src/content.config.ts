// Typed schemas for the two content collections. Adding a .md file + push is the
// entire publishing workflow; `draft: true` builds locally but never ships.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    dates: z.string(), // human-readable range, e.g. "Dec 2025 – present"
    stack: z.array(z.string()),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99), // sort key: lower = earlier on the page
    draft: z.boolean().default(false),
  }),
});

// the cooking feed: keep it simple — picture, macros, ingredients, steps
const cooks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cooks' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string(),
    macros: z.object({
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    }),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects, cooks };
