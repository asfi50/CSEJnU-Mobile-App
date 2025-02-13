import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from 'expo-router';

interface BlogCardProps {
  post: {
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
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      className={`mb-6 rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}
      onPress={() => router.push(`/post/${post.id}`)}
    >
      <Image
        source={{ 
          uri: post.featured_media_url || 'https://picsum.photos/400/200'
        }}
        className="w-full h-48"
        resizeMode="cover"
      />
      
      {/* Categories */}
      <View className="flex-row px-4 pt-4 gap-2">
        {post.categories.map(category => (
          <View 
            key={category.id} 
            className={`px-2 py-1 rounded-full ${
              isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}
          >
            <Text className={`text-xs ${
              isDarkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              {category.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Title and Excerpt */}
      <View className="p-4">
        <Text className={`text-xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {post.title.rendered}
        </Text>
        <Text 
          className={`mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          numberOfLines={3}
        >
          {post.excerpt.rendered.replace(/<[^>]*>/g, '')}
        </Text>

        {/* Tags */}
        {post.tags.length > 0 && (
          <View className="flex-row mb-4 gap-2">
            {post.tags.map(tag => (
              <Text 
                key={tag.id}
                className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                #{tag.name}
              </Text>
            ))}
          </View>
        )}

        {/* Author and Date */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-700/20">
          <View className="flex-row items-center">
            <Image
              source={{ uri: post.author.avatar_urls['96'] }}
              className="w-6 h-6 rounded-full mr-2"
            />
            <Text className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {post.author.name}
            </Text>
          </View>
          <Text className={`text-sm ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {post.date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
