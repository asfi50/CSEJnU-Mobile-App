import { api } from './api';
import { wp_url } from '@/config';

export const wordpressService = {
  async getPosts(perPage = 10) {
    return await api.wpGet(`/posts?per_page=${perPage}&_embed`);
  },

  async getPostCount() {
    const response = await fetch(`${wp_url}/wp-json/wp/v2/posts?per_page=1`);
    return parseInt(response.headers.get('X-WP-Total') || '0');
  },
};
