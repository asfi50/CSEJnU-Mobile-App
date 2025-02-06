export interface WPPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  featured_media_url?: string;
  link: string;
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
  author: {
    name: string;
    avatar_urls: { [key: string]: string };
  };
}