import { api } from './api';
import { wp_url } from '@/config';
import { WPPost } from '@/types/blog';
import { decode } from 'html-entities';

const formatPost = (post: any): WPPost => ({
  id: post.id,
  title: { rendered: decode(post.title.rendered) },
  excerpt: { rendered: decode(post.excerpt.rendered) },
  date: post.date,
  featured_media_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
  link: post.link,
  categories: post._embedded?.['wp:term']?.[0] || [],
  tags: (post._embedded?.['wp:term']?.[1] || []).slice(0, 3),
  author: post._embedded?.['author']?.[0] || {
    name: 'Unknown',
    avatar_urls: { '96': 'https://www.gravatar.com/avatar/00000000000000000000000000000000' }
  }
});

export const wordpressService = {
  async getPosts(perPage = 10, page = 1) {
    const response = await api.wpGet(`/posts?per_page=${perPage}&page=${page}&_embed&orderby=date&order=desc`);
    return response.map(formatPost);
  },

  async getPostCount() {
    const response = await fetch(`${wp_url}/wp-json/wp/v2/posts?per_page=1`);
    return parseInt(response.headers.get('X-WP-Total') || '0');
  },
};
