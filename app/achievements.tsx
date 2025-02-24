import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import Reanimated, {
  FadeIn,
  SlideInRight,
  ZoomIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState, useCallback } from "react";
import BlogCard from "@/components/blog/BlogCard";
import Header from "@/components/Header";
import { wordpressService } from "@/services/wordpress.service";
import { WPPost } from "@/types/blog";
import { achievement_category_id } from "@/config";
import AchievementFilter from "@/components/achievements/AchievementFilter";

const ReanimatedView = Reanimated.createAnimatedComponent(View);
const AnimatedGradient = Reanimated.createAnimatedComponent(LinearGradient);

export default function Achievements() {
  const { isDarkMode } = useTheme();
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = useCallback(async (pageNum: number, refresh = false) => {
    try {
      if (refresh) setLoading(true);
      else if (pageNum > 1) setLoadingMore(true);

      const newPosts = await wordpressService.getPosts(
        10,
        pageNum,
        achievement_category_id
      );

      setHasMore(newPosts.length === 10);
      setPosts((prev) => (refresh ? newPosts : [...prev, ...newPosts]));
      setError("");
    } catch (err) {
      setError("Failed to load achievements");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      setPage((prev) => {
        const nextPage = prev + 1;
        fetchPosts(nextPage, false);
        return nextPage;
      });
    }
  }, [loadingMore, hasMore, loading, fetchPosts]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchPosts(1, true);
  }, [fetchPosts]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.rendered.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.rendered.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHeader = () => (
    <View className="mb-6">
      <AchievementFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AnimatedGradient
        entering={ZoomIn.duration(500)}
        colors={
          isDarkMode
            ? ["#251500", "#452800", "#251500"]
            : ["#fff7ed", "#ffedd5", "#fed7aa"]
        }
        className="mt-4 p-6 rounded-2xl"
      >
        <ReanimatedView
          entering={SlideInRight.delay(200)}
          className="flex-row items-center justify-between mb-4"
        >
          <View>
            <Text
              className={`text-2xl font-bold ${
                isDarkMode ? "text-amber-300" : "text-amber-800"
              }`}
            >
              Hall of Fame
            </Text>
            <Text
              className={`mt-1 ${
                isDarkMode ? "text-amber-200/70" : "text-amber-700/70"
              }`}
            >
              Our Pride, Our Legacy
            </Text>
          </View>
          <Text className="text-4xl">🏆</Text>
        </ReanimatedView>
      </AnimatedGradient>
    </View>
  );

  if (loading) {
    return (
      <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Header title="Achievements" showBack />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#fff" : "#000"}
          />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Header title="Achievements" showBack />
        <View className="flex-1 justify-center items-center p-4">
          <Text
            className={`text-lg mb-4 ${
              isDarkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            {error}
          </Text>
          <Text
            className={`text-base ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
            onPress={handleRefresh}
          >
            Tap to retry
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Header title="Achievements" showBack />
      <FlatList
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={renderHeader()}
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ReanimatedView
            entering={FadeIn.delay(index * 100).springify()}
            className="mb-4"
          >
            <BlogCard
              post={item}
              customStyle={`border border-amber-200/20 shadow-lg
                ${isDarkMode ? "bg-amber-900/10" : "bg-white"}`}
            />
          </ReanimatedView>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDarkMode ? "#fff" : "#000"}
          />
        }
        ListFooterComponent={
          <View className="py-4">
            {loadingMore && (
              <ActivityIndicator
                size="small"
                color={isDarkMode ? "#fff" : "#000"}
              />
            )}
            {!hasMore && posts.length > 0 && (
              <View className="py-8 items-center border-t border-gray-700/20">
                <Text
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  — You've reached the end —
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="py-8 items-center">
            <Text
              className={`text-base ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No achievements found
            </Text>
          </View>
        }
      />
    </View>
  );
}
