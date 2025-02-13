import { api } from './api';

export interface Video {
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
}

export interface YouTubeResponse {
  videos: Video[];
  pagination: {
    next_page_token?: string;
    prev_page_token?: string;
  };
}

export const youtubeService = {
  async getVideos(pageToken?: string): Promise<YouTubeResponse> {
    const endpoint = `/api/youtube.php${pageToken ? `?pageToken=${pageToken}` : ''}`;
    return await api.get(endpoint);
  },
};
