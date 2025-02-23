import { api } from "./api";
import { wp_url } from "@/config";
import { WPPost } from "@/types/blog";
import { decode } from "html-entities";
import {
  cachePosts,
  getCachedPosts,
  shouldRefetchPosts,
} from "@/utils/cachePostVideo";

const formatPost = (post: any): WPPost => ({
  id: post.id,
  title: { rendered: decode(post.title.rendered) },
  excerpt: { rendered: decode(post.excerpt.rendered) },
  date: post.date,
  featured_media_url: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  link: post.link,
  categories: post._embedded?.["wp:term"]?.[0] || [],
  tags: (post._embedded?.["wp:term"]?.[1] || []).slice(0, 3),
  author: post._embedded?.["author"]?.[0] || {
    name: "Unknown",
    avatar_urls: {
      "96": "https://www.gravatar.com/avatar/00000000000000000000000000000000",
    },
  },
});

export const wordpressService = {
  async getPosts(perPage = 10, page = 1) {
    try {
      // Fetch fresh data
      console.log(`fetching posts page ${page}, perPage ${perPage}`);
      const response = await api.wpGet(
        `/posts?per_page=${perPage}&page=${page}&_embed&orderby=date&order=desc`
      );
      console.log("post response count", response.length);

      const formattedPosts = response.map(formatPost);

      // Cache first page results
      if (page === 1) {
        await cachePosts(formattedPosts);
      }

      return formattedPosts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Fallback to cache if network request fails
      if (page === 1) {
        const cachedPosts = await getCachedPosts();
        if (cachedPosts.length > 0) {
          console.log("Falling back to cached posts");
          return cachedPosts;
        }
      }
      return [];
    }
  },

  async getPostCount() {
    try {
      const response = await fetch(`${wp_url}/wp-json/wp/v2/posts?per_page=1`);
      return parseInt(response.headers.get("X-WP-Total") || "0");
    } catch (error) {
      console.error("Error fetching post count:", error);
      const cachedPosts = await getCachedPosts();
      return cachedPosts.length;
    }
  },
};
