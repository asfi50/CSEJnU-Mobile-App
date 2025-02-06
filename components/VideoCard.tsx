import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

interface VideoCardProps {
  video: {
    video_id: string;
    title: string;
    description: string;
    thumbnail: string;
    published_at: string;
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const { isDarkMode } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      className={`mb-4 rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}
      onPress={() => Linking.openURL(`https://youtube.com/watch?v=${video.video_id}`)}
    >
      <View className="relative">
        <Image
          source={{ uri: video.thumbnail }}
          className="w-full h-52"
        />
      </View>
      <View className="p-4">
        <Text className={`text-lg font-semibold mb-1 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {video.title}
        </Text>
        <View className="flex-row items-center">
          <Ionicons 
            name="calendar-outline" 
            size={16} 
            color={isDarkMode ? '#9ca3af' : '#4b5563'} 
          />
          <Text className={`ml-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {formatDate(video.published_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
