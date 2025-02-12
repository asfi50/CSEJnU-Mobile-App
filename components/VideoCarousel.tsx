import { ScrollView, View, Text } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import VideoCard from './VideoCard';

interface Video {
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
}

interface VideoCarouselProps {
  videos: Video[];
}

export default function VideoCarousel({ videos }: VideoCarouselProps) {
  const { isDarkMode } = useTheme();

  if (!videos.length) return null;

  return (
    <View className="mb-6">
      <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Recent Videos
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {videos.map((video) => (
          <View key={video.video_id} style={{ width: 300 }} className="mr-4">
            <VideoCard video={video} compact />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
