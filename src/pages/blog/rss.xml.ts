import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts } from "@/lib/content";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts("blog");
  return rss({
    title: "AI Colleagues — Blog",
    description:
      "Engineering notes and implementation practices from AI Colleagues.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.summary,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,
    })),
  });
}
