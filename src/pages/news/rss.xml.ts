import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts } from "@/lib/content";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts("news");
  return rss({
    title: "AI Colleagues — News",
    description:
      "Product updates, releases, and delivery highlights from AI Colleagues.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.summary,
      link: `/news/${post.slug}/`,
      categories: post.data.tags,
    })),
  });
}
