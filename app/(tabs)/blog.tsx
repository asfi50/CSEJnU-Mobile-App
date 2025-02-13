import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import Reanimated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState, useCallback } from "react";
import { wp_url } from "@/config";
import { decode } from 'html-entities';
import BlogCard from "@/components/blog/BlogCard";
import BlogFilter from "@/components/blog/BlogFilter";
import debounce from 'lodash/debounce';

interface WPPost {
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

const ReanimatedView = Reanimated.createAnimatedComponent(View);

export default function Blog() {
  interface FilterOptions {
    search: string;
    selectedCategories: number[];
    selectedTags: number[];
    selectedAuthors: number[];
    dateFrom?: Date;
    dateTo?: Date;
  }

  const { isDarkMode } = useTheme();
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<WPPost[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: '',
    selectedCategories: [],
    selectedTags: [],
    selectedAuthors: [],
    dateFrom: undefined,
    dateTo: undefined
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoadingMoreDebounced, setIsLoadingMoreDebounced] = useState(false);

  useEffect(() => {
    fetchPosts(page);
  }, []); // We'll handle pagination separately, not through this effect

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const [categoriesRes, tagsRes, authorsRes] = await Promise.all([
        fetch(`${wp_url}/wp-json/wp/v2/categories`),
        fetch(`${wp_url}/wp-json/wp/v2/tags`),
        fetch(`${wp_url}/wp-json/wp/v2/users`)
      ]);

      const [categoriesData, tagsData, authorsData] = await Promise.all([
        categoriesRes.json(),
        tagsRes.json(),
        authorsRes.json()
      ]);

      setCategories(categoriesData);
      setTags(tagsData);
      setAuthors(authorsData);
    } catch (err) {
      console.error('Failed to fetch terms:', err);
    }
  };

  const fetchPosts = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      console.log('Fetching page:', pageNum); // Debug log

      let url = `${wp_url}/wp-json/wp/v2/posts?per_page=10&page=${pageNum}&_embed`;
      
      // Add only category, tag, and author filters to URL
      if (filterOptions.selectedCategories.length) {
        url += `&categories=${filterOptions.selectedCategories.join(',')}`;
      }
      if (filterOptions.selectedTags.length) {
        url += `&tags=${filterOptions.selectedTags.join(',')}`;
      }
      if (filterOptions.selectedAuthors.length) {
        url += `&author=${filterOptions.selectedAuthors.join(',')}`;
      }

      const response = await fetch(url);
      
      // Check if we've reached the end
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');
      console.log('Total pages:', totalPages); // Debug log
      
      const data = await response.json();
      console.log(`Fetched ${data.length} posts for page ${pageNum}`); // Debug log

      setHasMore(pageNum < totalPages);

      const formattedPosts = data.map((post: any) => ({
        id: post.id,
        title: { rendered: decode(post.title.rendered) },
        excerpt: { rendered: decode(post.excerpt.rendered) },
        date: new Date(post.date).toLocaleDateString(),
        featured_media_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        link: post.link,
        categories: post._embedded?.['wp:term']?.[0] || [],
        tags: (post._embedded?.['wp:term']?.[1] || []).slice(0, 3),
        author: post._embedded?.['author']?.[0] || {
          name: 'Unknown',
          avatar_urls: { '96': 'https://www.gravatar.com/avatar/00000000000000000000000000000000' }
        }
      }));
      
      setPosts(prev => pageNum === 1 ? formattedPosts : [...prev, ...formattedPosts]);
    } catch (err) {
      console.error('Blog fetch error:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const debouncedLoadMore = useCallback(
    debounce(async () => {
      if (loadingMore || !hasMore || isLoadingMoreDebounced) return;

      try {
        setIsLoadingMoreDebounced(true);
        setLoadingMore(true);
        const nextPage = page + 1;
        await fetchPosts(nextPage);
        setPage(nextPage);
      } catch (err) {
        console.error('Load more error:', err);
      } finally {
        setLoadingMore(false);
        setIsLoadingMoreDebounced(false);
      }
    }, 1000),
    [loadingMore, hasMore, page, isLoadingMoreDebounced]
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedLoadMore.cancel();
    };
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore && !isLoadingMoreDebounced) {
      debouncedLoadMore();
    }
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    const paddingToBottom = 300; // Load when 300px from bottom
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1); // Reset pagination
    await fetchPosts(1);
    setRefreshing(false);
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(1);
  }, [filterOptions]);

  // Add effect for local search
  useEffect(() => {
    const filtered = posts.filter(post => 
      post.title.rendered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.rendered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const renderItem = ({ item: post, index }: { item: WPPost, index: number }) => (
    <ReanimatedView
      entering={FadeIn.delay(index * 100).springify()}
      className="mb-4"
    >
      <BlogCard post={post} />
    </ReanimatedView>
  );

  const ListEmptyComponent = () => (
    <View className="py-8 items-center">
      <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No posts available
      </Text>
    </View>
  );

  const ListFooterComponent = () => (
    <View className="py-4">
      {loadingMore && (
        <View className="py-2 my-2">
          <ActivityIndicator size="small" color={isDarkMode ? '#fff' : '#000'} />
          <Text className={`text-center text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading more posts...
          </Text>
        </View>
      )}
      {!hasMore && posts.length > 0 && (
        <View className="py-8 items-center border-t border-gray-700/20">
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            — You've reached the end —
          </Text>
        </View>
      )}
    </View>
  );

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
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <BlogFilter
        options={{ ...filterOptions, search: searchQuery }}
        onOptionsChange={(newOptions) => {
          // Handle search separately from other filters
          if (newOptions.search !== searchQuery) {
            setSearchQuery(newOptions.search);
          } else {
            setFilterOptions({
              ...filterOptions, // Keep existing state
              search: searchQuery, // Maintain search state
              selectedCategories: newOptions.selectedCategories,
              selectedTags: newOptions.selectedTags,
              selectedAuthors: newOptions.selectedAuthors,
              dateFrom: newOptions.dateFrom,
              dateTo: newOptions.dateTo
            });
          }
        }}
        categories={categories}
        tags={tags}
        authors={authors}
      />
      <FlatList
        data={searchQuery ? filteredPosts : posts}
        renderItem={renderItem}
        keyExtractor={post => post.id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={7}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDarkMode ? '#fff' : '#000'}
            colors={[isDarkMode ? '#fff' : '#000']}
          />
        }
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
