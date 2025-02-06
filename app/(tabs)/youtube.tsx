import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';

export default function YouTube() {
  const { isDarkMode } = useTheme();

  const videos = [
    {
      id: 1,
      title: "React Native Tutorial",
      channel: "Code Master",
      views: "125K views",
      duration: "12:34",
    },
    // Add more videos as needed
  ];

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="p-4">
        {videos.map((video) => (
          <TouchableOpacity
            key={video.id}
            className={`mb-4 rounded-xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}
          >
            <View className="relative">
              <Image
                source={{ uri: 'https://picsum.photos/400/225' }}
                className="w-full h-52"
              />
              <View className="absolute bottom-2 right-2 bg-black/75 px-2 py-1 rounded">
                <Text className="text-white text-sm">{video.duration}</Text>
              </View>
            </View>
            <View className="p-4">
              <Text className={`text-lg font-semibold mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {video.title}
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
                  {video.channel} • {video.views}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
