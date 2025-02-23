import { View, Text, TouchableOpacity, Image, Clipboard } from 'react-native';
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
  compact?: boolean;
}

export default function VideoCard({ video, compact }: VideoCardProps) {
  const { isDarkMode } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleLongPress = async () => {
    const videoUrl = `https://youtube.com/watch?v=${video.video_id}`;
    await Clipboard.setString(videoUrl);
  };

  return (
    <TouchableOpacity
      className={`
        ${compact ? 'mb-2' : 'mb-4'}
        rounded-xl
        overflow-hidden
        ${isDarkMode ? 'bg-gray-800/90' : 'bg-white'}
        shadow-lg
      `}
      onPress={() => Linking.openURL(`https://youtube.com/watch?v=${video.video_id}`)}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <View className="relative">
        <Image
          source={{ uri: `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg` }}
          className={`w-full ${compact ? 'h-40' : 'h-52'} object-cover`}
          resizeMode="cover"
        />
        <View className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded">
          <Text className="text-white text-xs font-medium">4:32</Text>
        </View>
        <View className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200" />
      </View>
      <View className="p-4">
        <Text 
          className={`${compact ? 'text-base' : 'text-lg'} font-semibold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {video.title}
        </Text>
        <Text 
          className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {video.description}
        </Text>
        <View className="flex-row items-center space-x-2">
          <View className="flex-row items-center">
            <Ionicons 
              name="calendar-outline" 
              size={14} 
              color={isDarkMode ? '#9ca3af' : '#4b5563'} 
              style={{ marginRight: 4 }}
            />
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatDate(video.published_at)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons 
              name="eye-outline" 
              size={14} 
              color={isDarkMode ? '#9ca3af' : '#4b5563'} 
              style={{ marginRight: 4 }}
            />
            <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              2.5K views
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
