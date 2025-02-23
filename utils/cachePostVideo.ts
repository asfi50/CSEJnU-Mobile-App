import AsyncStorage from '@react-native-async-storage/async-storage';
import { WPPost } from '@/types/blog';
import { Video } from '@/services/youtube.service';

const VIDEOS_KEY = 'cached_videos';
const VIDEOS_LAST_FETCH_KEY = 'videos_last_fetch';
const POSTS_CACHE_KEY = 'cached_posts';
const POSTS_LAST_FETCH_KEY = 'posts_last_fetch';

// Cache duration in milliseconds
const CACHE_DURATION = {
  POSTS: 60 * 60 * 1000, // 1 hour
  VIDEOS: 2 * 60 * 60 * 1000, // 2 hours
};

// Posts caching functions
export const cachePosts = async (posts: WPPost[]) => {
  try {
    await AsyncStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(posts));
    await AsyncStorage.setItem(POSTS_LAST_FETCH_KEY, Date.now().toString());
  } catch (e) {
    console.error('Error caching posts:', e);
  }
};

export const getCachedPosts = async (): Promise<WPPost[]> => {
  try {
    const posts = await AsyncStorage.getItem(POSTS_CACHE_KEY);
    return posts ? JSON.parse(posts) : [];
  } catch (e) {
    console.error('Error getting cached posts:', e);
    return [];
  }
};

export const shouldRefetchPosts = async (): Promise<boolean> => {
  try {
    const lastFetch = await AsyncStorage.getItem(POSTS_LAST_FETCH_KEY);
    if (!lastFetch) return true;

    const lastFetchDate = new Date(parseInt(lastFetch));
    const now = new Date();
    
    return now.getTime() - lastFetchDate.getTime() > CACHE_DURATION.POSTS;
  } catch (e) {
    console.error('Error checking posts cache:', e);
    return true;
  }
};

// Videos caching functions
export const cacheVideos = async (videos: Video[]) => {
  try {
    await AsyncStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
    await AsyncStorage.setItem(VIDEOS_LAST_FETCH_KEY, Date.now().toString());
  } catch (e) {
    console.error('Error caching videos:', e);
  }
};

export const getCachedVideos = async (): Promise<Video[]> => {
  try {
    const videos = await AsyncStorage.getItem(VIDEOS_KEY);
    return videos ? JSON.parse(videos) : [];
  } catch (e) {
    console.error('Error getting cached videos:', e);
    return [];
  }
};

export const shouldRefetchVideos = async (): Promise<boolean> => {
  try {
    const lastFetch = await AsyncStorage.getItem(VIDEOS_LAST_FETCH_KEY);
    if (!lastFetch) return true;

    const lastFetchDate = new Date(parseInt(lastFetch));
    const now = new Date();
    
    return now.getTime() - lastFetchDate.getTime() > CACHE_DURATION.VIDEOS;
  } catch (e) {
    console.error('Error checking videos cache:', e);
    return true;
  }
};

// Cache cleanup function
export const clearCache = async () => {
  try {
    await AsyncStorage.multiRemove([
      VIDEOS_KEY,
      VIDEOS_LAST_FETCH_KEY,
      POSTS_CACHE_KEY,
      POSTS_LAST_FETCH_KEY
    ]);
  } catch (e) {
    console.error('Error clearing cache:', e);
  }
};