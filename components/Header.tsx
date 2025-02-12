import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title, showBack = false }: HeaderProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <View className={`flex-row items-center px-4 pt-12 pb-3 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {showBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-2"
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? '#ffffff' : '#000000'} 
          />
        </TouchableOpacity>
      )}
      <Text 
        numberOfLines={1} 
        className={`text-lg font-semibold flex-1 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        {title}
      </Text>
      
      <TouchableOpacity
        onPress={() => router.push('/settings')}
        className={`p-2 rounded-full ml-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
      >
        <Ionicons 
          name="settings-outline" 
          size={20} 
          color={isDarkMode ? "#fff" : "#1a1a1a"}
        />
      </TouchableOpacity>
    </View>
  );
}
