import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState, useCallback } from "react";
import { AUTH_URL } from "@/config";
import VideoCard from "@/components/VideoCard";
import { useAuth } from "@/context/AuthContext";

interface Video {
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
}

interface APIResponse {
  videos: Video[];
  pagination: {
    next_page_token?: string;
    prev_page_token?: string;
  };
}

export default function YouTube() {
  const { isDarkMode } = useTheme();
  const { token } = useAuth();
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
      if (!token) {
        throw new Error('Authentication required');
      }

      if (!pageToken) setLoading(true);
      else setLoadingMore(true);

      const url = `${AUTH_URL}/api/youtube.php?token=${token}${pageToken ? '&pageToken=' + pageToken : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data: APIResponse = await response.json();

      if (!data.videos?.length) {
        throw new Error('No videos found');
      }

      setVideos(prev => pageToken ? [...prev, ...data.videos] : data.videos);
      setNextPageToken(data.pagination.next_page_token || null);
      setHasMore(!!data.pagination.next_page_token);
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

  const loadMore = useCallback(debounce(() => {
    if (!loadingMore && hasMore && nextPageToken && videos.length > 0) {
      console.log('Loading more videos...');
      fetchVideos(nextPageToken);
    }
  }, 500), [loadingMore, hasMore, nextPageToken, videos.length]);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    const threshold = 0.8;
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
      scrollEventThrottle={1000}
      onMomentumScrollEnd={({nativeEvent}) => {
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
          <VideoCard key={video.video_id} video={video} />
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
