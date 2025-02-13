import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, RefreshControl, Animated } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import VideoCard from "@/components/video/VideoCard";
import BlogCard from "@/components/blog/BlogCard";
import { youtubeService, Video } from "@/services/youtube.service";
import { wordpressService } from "@/services/wordpress.service";
import { WPPost } from "@/types/blog";
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { withSpring, withTiming, FadeIn } from 'react-native-reanimated';
import debounce from 'lodash/debounce';

interface FeedItem {
  type: 'video' | 'blog';
  date: string;
  data: Video | WPPost;
  id: string;
  timestamp: number; // Add timestamp for uniqueness
}

const ReanimatedView = Reanimated.createAnimatedComponent(View);

export const Feed = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMoreDebounced, setIsLoadingMoreDebounced] = useState(false);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    const paddingToBottom = 300; // Load when 300px from bottom
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const fetchInitialFeed = async () => {
    try {
      setLoading(true);
      setError('');
      setPage(1);
      const [videoResponse, blogPosts] = await Promise.all([
        youtubeService.getVideos(),
        wordpressService.getPosts(10, 1)
      ]);

      const videos: FeedItem[] = (videoResponse?.videos || []).map(video => ({
        type: 'video',
        date: video.published_at,
        data: video,
        id: `video-${video.video_id}-${Date.now()}`, // Add timestamp to ensure uniqueness
        timestamp: Date.now()
      }));

    //   @ts-ignore
      const posts: FeedItem[] = blogPosts.map(post => ({
        type: 'blog',
        date: post.date,
        data: post,
        id: `blog-${post.id}-${Date.now()}`, // Add timestamp to ensure uniqueness
        timestamp: Date.now()
      }));

      const combined = [...videos, ...posts].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setFeedItems(combined);
      setNextPageToken(videoResponse?.pagination?.next_page_token || null);
      setHasMore(combined.length >= 10); // Set hasMore based on initial load
    } catch (err) {
      setError('Unable to load feed');
      console.error('Feed fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedLoadMore = useCallback(
    debounce(async () => {
      if (loadingMore || !hasMore || isLoadingMoreDebounced) return;

      try {
        setIsLoadingMoreDebounced(true);
        setLoadingMore(true);
        const nextPage = page + 1;
        console.log('Loading more feed items, page:', nextPage); // Debug log

        const [videoResponse, blogPosts] = await Promise.all([
          nextPageToken ? youtubeService.getVideos(nextPageToken) : Promise.resolve(null),
          wordpressService.getPosts(10, nextPage)
        ]);

        const newVideos: FeedItem[] = (videoResponse?.videos || []).map(video => ({
          type: 'video',
          date: video.published_at,
          data: video,
          id: `video-${video.video_id}-${Date.now()}`,
          timestamp: Date.now()
        }));

        // @ts-ignore
        const newPosts: FeedItem[] = blogPosts.map(post => ({
          type: 'blog',
          date: post.date,
          data: post,
          id: `blog-${post.id}-${Date.now()}`,
          timestamp: Date.now()
        }));

        const newItems = [...newVideos, ...newPosts].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (newItems.length > 0) {
          setFeedItems(prev => {
            // Filter out duplicates based on id
            const existing = new Set(prev.map(item => {
              const data = item.data as any;
              return data.id || data.video_id;
            }));
            
            const uniqueNewItems = newItems.filter(item => {
              const data = item.data as any;
              return !existing.has(data.id || data.video_id);
            });

            const merged = [...prev, ...uniqueNewItems];
            return merged.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          });
          
          setPage(nextPage);
          setNextPageToken(videoResponse?.pagination?.next_page_token || null);
          setHasMore(newItems.length >= 5);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Load more error:', err);
      } finally {
        setLoadingMore(false);
        setIsLoadingMoreDebounced(false);
      }
    }, 500), // Reduced debounce time from 1000ms to 500ms
    [loadingMore, hasMore, page, nextPageToken, isLoadingMoreDebounced]
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedLoadMore.cancel();
    };
  }, []);

  // Replace the existing loadMore with debouncedLoadMore
  const loadMore = () => {
    if (!loadingMore && hasMore && !isLoadingMoreDebounced) {
      debouncedLoadMore();
    }
  };

  useEffect(() => {
    fetchInitialFeed();
  }, []);

  const LoadingIndicator = () => (
    <View className="py-2 my-2">
      <ActivityIndicator size="small" color={isDarkMode ? '#fff' : '#000'} />
      <Text className={`text-center text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Loading more content...
      </Text>
    </View>
  );

  const renderItem = ({ item, index }: { item: FeedItem; index: number }) => (
    <ReanimatedView
      entering={FadeIn.delay(index * 100).springify()}
      className="mb-4"
    >
      {item.type === 'video' ? (
        <VideoCard video={item.data as Video} />
      ) : (
        <BlogCard post={item.data as WPPost} />
      )}
      <View className={`absolute top-2 right-2 px-2 py-1 rounded-full ${
        isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
      }`}>
        <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
    </ReanimatedView>
  );

  const ListHeader = () => (
    <View className={`py-4 mb-2 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Latest Updates
      </Text>
      <LinearGradient
        colors={[isDarkMode ? '#4F46E5' : '#3B82F6', isDarkMode ? '#7C3AED' : '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="h-1 w-16 rounded-full mt-2"
      />
    </View>
  );

  const ListEmptyComponent = () => (
    <View className="py-8 items-center">
      <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No updates available
      </Text>
    </View>
  );

  const ListFooter = () => (
    <View className="py-4">
      {loadingMore ? (
        <LoadingIndicator />
      ) : !hasMore && feedItems.length > 0 ? (
        <Text className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          — You've caught up —
        </Text>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <View className="mt-4 p-4">
        <ListHeader />
        <View className="py-8">
          <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={feedItems}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooter}
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)) {
          loadMore();
        }
      }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      scrollEventThrottle={400}
      maxToRenderPerBatch={5}
      windowSize={10}
      initialNumToRender={10}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchInitialFeed}
          tintColor={isDarkMode ? '#fff' : '#000'}
        />
      }
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};
