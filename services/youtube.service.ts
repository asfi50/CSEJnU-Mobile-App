import { api } from "./api";
import {
  cacheVideos,
  getCachedVideos,
  shouldRefetchVideos,
} from "@/utils/cachePostVideo";

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
    try {
      // Fetch fresh data
      console.log(`fetching videos with pageToken: ${pageToken}`);
      const endpoint = `/api/youtube.php${
        pageToken ? `?pageToken=${pageToken}` : ""
      }`;
      const response = await api.get(endpoint);
      console.log(`youtube response length ${response.length}`);

      // Always cache the latest results for the first page
      if (!pageToken) {
        await cacheVideos(response.videos);
      }

      return response;
    } catch (error) {
      console.error("Error fetching videos:", error);
      // Fallback to cache if network request fails
      if (!pageToken) {
        const cachedVideos = await getCachedVideos();
        if (cachedVideos.length > 0) {
          console.log("Falling back to cached videos");
          return {
            videos: cachedVideos,
            pagination: {},
          };
        }
      }
      return {
        videos: [],
        pagination: {},
      };
    }
  },
};
