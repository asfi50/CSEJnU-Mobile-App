import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

interface VideoCardProps {
  video: {
    id: string;
    snippet: {
      title: string;
      channelTitle: string;
      thumbnails: {
        high: { url: string };
      };
    };
    statistics?: {
      viewCount: string;
    };
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const { isDarkMode } = useTheme();

  const formatViews = (viewCount: string) => {
    const views = parseInt(viewCount);
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  return (
    <TouchableOpacity
      className={`mb-4 rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}
      onPress={() => Linking.openURL(`https://youtube.com/watch?v=${video.id}`)}
    >
      <View className="relative">
        <Image
          source={{ uri: video.snippet.thumbnails.high.url }}
          className="w-full h-52"
        />
      </View>
      <View className="p-4">
        <Text className={`text-lg font-semibold mb-1 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {video.snippet.title}
        </Text>
        <View className="flex-row items-center">
          <Ionicons 
            name="person-circle" 
            size={20} 
            color={isDarkMode ? '#9ca3af' : '#4b5563'} 
          />
          <Text className={`ml-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {video.snippet.channelTitle} • {video.statistics && formatViews(video.statistics.viewCount)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
