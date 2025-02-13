import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from 'expo-router';

interface BlogPost {
  id: number;
  title: { rendered: string };
  featured_media_url?: string;
  date: string;
  categories: Array<{ id: number; name: string }>;
}

interface BlogCarouselProps {
  posts: BlogPost[];
}

export default function BlogCarousel({ posts }: BlogCarouselProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  if (!posts.length) return null;

  return (
    <View className="mb-6">
      <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Recent Posts
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            className={`mr-4 rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            style={{ width: 280 }}
            onPress={() => router.push(`/post/${post.id}`)}
          >
            <Image
              source={{ uri: post.featured_media_url || 'https://picsum.photos/200/100' }}
              className="w-full h-32"
              resizeMode="cover"
            />
            <View className="p-3">
              {post.categories.length > 0 && (
                <View className={`px-2 py-1 rounded-full self-start mb-2 ${
                  isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <Text className={`text-xs ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    {post.categories[0].name}
                  </Text>
                </View>
              )}
              <Text 
                numberOfLines={2}
                className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {post.title.rendered}
              </Text>
              <Text className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date(post.date).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
