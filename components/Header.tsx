import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Header({ title }: { title?: string }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <View className={`
      flex-row items-center justify-between px-4 py-3
      ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
      border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
    `}>
      <Text className={`text-lg font-semibold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {title || 'Dashboard'}
      </Text>
      
      <View className="flex-row items-center space-x-4">
        <TouchableOpacity
          onPress={toggleTheme}
          className={`p-2 rounded-full ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <Ionicons 
            name={isDarkMode ? "sunny" : "moon"} 
            size={20} 
            color={isDarkMode ? "#fff" : "#1a1a1a"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/profile')}
          className={`p-2 rounded-full ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <Ionicons 
            name="person-circle-outline" 
            size={20} 
            color={isDarkMode ? "#fff" : "#1a1a1a"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
