import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { github_repo, github_branch } from '@/config';

export default function Gallery() {
  const { isDarkMode } = useTheme();

  const handleContribute = () => {
    Linking.openURL(`https://github.com/${github_repo}/blob/${github_branch}/CONTRIBUTING.md`);
  };

  return (
    <View className={`flex-1 justify-center items-center p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl max-w-md w-full items-center`}>
        <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <Ionicons
            name="images-outline"
            size={40}
            color={isDarkMode ? '#a78bfa' : '#7c3aed'}
          />
        </View>
        <Text className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Gallery
        </Text>
        <Text className={`text-center mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          This feature is coming soon! Help us build it by contributing to the project.
        </Text>
        <TouchableOpacity
          onPress={handleContribute}
          className={`px-6 py-3 rounded-full ${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'}`}
        >
          <Text className="text-white font-semibold">
            Contribute Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}