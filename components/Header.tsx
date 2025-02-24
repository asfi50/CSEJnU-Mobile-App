import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { wp_url, github_repo } from '@/config';
import * as WebBrowser from 'expo-web-browser';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title, showBack = false }: HeaderProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

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
      
      {pathname === '/blog' && (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(`${wp_url}/post-new`)}
          className={`flex-row items-center px-3 py-2 rounded-lg mr-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
          <Ionicons 
            name="create-outline" 
            size={20} 
            color={isDarkMode ? "#fff" : "#1a1a1a"}
          />
          <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Write Post
          </Text>
        </TouchableOpacity>
      )}
      {pathname === '/achievements' && (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(`${wp_url}/post-new`)}
          className={`flex-row items-center px-3 py-2 rounded-lg mr-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
          <Ionicons 
            name="create-outline" 
            size={20} 
            color={isDarkMode ? "#fff" : "#1a1a1a"}
          />
          <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            New
          </Text>
        </TouchableOpacity>
      )}
      {pathname === '/youtube' && (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(`${wp_url}/youtube-registration`)}
          className={`flex-row items-center px-3 py-2 rounded-lg mr-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
          <Ionicons 
            name="videocam-outline" 
            size={20} 
            color={isDarkMode ? "#fff" : "#1a1a1a"}
          />
          <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Upload Video
          </Text>
        </TouchableOpacity>
      )}
      {pathname === '/about' && (
        <TouchableOpacity
          onPress={() => WebBrowser.openBrowserAsync(`https://github.com/${github_repo}`)}
          className={`flex-row items-center px-3 py-2 rounded-lg mr-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
          <Ionicons 
            name="logo-github" 
            size={20} 
            color={isDarkMode ? "#fff" : "#1a1a1a"}
          />
          <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            View Code
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => router.push('/settings')}
        className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
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
