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
    console.log(`fetching videos with pageToken: ${pageToken}`);
    const endpoint = `/api/youtube.php${pageToken ? `?pageToken=${pageToken}` : ''}`;
    // return await api.get(endpoint);
    const response = await api.get(endpoint);
    console.log(`youtube response length ${response.length}`);
    return response;
    
    // return blankResponse;
    // const blankResponse: YouTubeResponse = {
    //   videos: [],
    //   pagination: {},
    // };
    // return blankResponse;
  },
};
