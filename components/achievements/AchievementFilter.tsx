import { View, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';

interface AchievementFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function AchievementFilter({ searchQuery, onSearchChange }: AchievementFilterProps) {
  const { isDarkMode } = useTheme();

  return (
    <View>
      <View className={`flex-row items-center p-2 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <Ionicons name="search" size={20} color={isDarkMode ? '#666' : '#999'} />
        <TextInput
          className={`flex-1 ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          placeholder="Search achievements..."
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
}