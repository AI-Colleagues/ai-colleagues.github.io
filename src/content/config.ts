import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("AI Colleagues Team"),
    category: z.string().default("Engineering"),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const news = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    source: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
  news,
};
