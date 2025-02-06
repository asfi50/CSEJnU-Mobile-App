import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState, useCallback } from "react";
import { YOUTUBE_API_KEY, CHANNEL_ID } from "@/config";
import VideoCard from "@/components/VideoCard";

interface Video {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    resourceId?: {
      videoId: string;
    };
    thumbnails: {
      high: { url: string };
    };
  };
  statistics?: {
    viewCount: string;
  };
}

export default function YouTube() {
  const { isDarkMode } = useTheme();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async (pageToken?: string) => {
    try {
      if (!pageToken) setLoading(true);
      else setLoadingMore(true);

      console.log('Fetching videos with token:', pageToken); // Debug log

      // First, get channel's uploads playlist ID
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
      );
      const channelData = await channelResponse.json();
      console.log('Channel data:', channelData); // Debug log

      if (!channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads) {
        throw new Error('Channel or uploads playlist not found');
      }

      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

      // Get videos from playlist
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}${pageToken ? '&pageToken=' + pageToken : ''}`;
      console.log('Fetching playlist:', playlistUrl); // Debug log

      const videosResponse = await fetch(playlistUrl);
      const videosData = await videosResponse.json();
      console.log('Videos data:', videosData); // Debug log

      if (!videosData.items?.length) {
        throw new Error('No videos found');
      }

      // Get video statistics
      const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId);
      const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`;
      const statsResponse = await fetch(statsUrl);
      const statsData = await statsResponse.json();
      console.log('Stats data:', statsData); // Debug log

      // Merge video data with statistics
      const videosWithStats = videosData.items.map((video: any) => {
        const stats = statsData.items?.find((stat: any) => 
          stat.id === video.snippet.resourceId.videoId
        );
        return {
          id: video.snippet.resourceId.videoId,
          snippet: {
            ...video.snippet,
            channelTitle: video.snippet.channelTitle || 'Unknown Channel'
          },
          statistics: stats?.statistics || { viewCount: '0' }
        };
      });

      console.log('Processed videos:', videosWithStats); // Debug log
      setVideos(prev => pageToken ? [...prev, ...videosWithStats] : videosWithStats);
      setNextPageToken(videosData.nextPageToken || null);
      setHasMore(!!videosData.nextPageToken);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVideos();
    setRefreshing(false);
  };

  // Add debounce utility
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Improve loadMore function
  const loadMore = useCallback(debounce(() => {
    if (!loadingMore && hasMore && nextPageToken && videos.length > 0) {
      console.log('Loading more videos...');
      fetchVideos(nextPageToken);
    }
  }, 500), [loadingMore, hasMore, nextPageToken, videos.length]);

  // Improve scroll threshold calculation
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    const threshold = 0.8; // Load when 80% scrolled
    return (layoutMeasurement.height + contentOffset.y) / contentSize.height > threshold;
  };

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Text className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)) {
          loadMore();
        }
      }}
      scrollEventThrottle={1000} // Reduced from 400 to prevent too frequent checks
      onMomentumScrollEnd={({nativeEvent}) => { // Add momentum scroll handler
        if (isCloseToBottom(nativeEvent)) {
          loadMore();
        }
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={isDarkMode ? '#fff' : '#000'}
          colors={[isDarkMode ? '#fff' : '#000']}
        />
      }
    >
      <View className="p-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
        
        {loadingMore && (
          <View className="py-4">
            <ActivityIndicator size="small" color={isDarkMode ? '#fff' : '#000'} />
          </View>
        )}

        {!hasMore && videos.length > 0 && (
          <View className="py-8 items-center border-t border-gray-700/20">
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              — You've reached the end —
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
