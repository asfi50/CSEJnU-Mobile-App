import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();
  const {logout} = useAuth();
  const router = useRouter();

  const SettingItem = ({ icon, title, onPress, value }: { icon: string; title: string; onPress: () => void; value?: string }) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center p-4 mb-2 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <Ionicons name={icon as any} size={24} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
      <Text className={`flex-1 ml-3 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </Text>
      <View className="flex-row items-center">
        {value && (
          <Text className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
      </View>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    logout();
    router.replace('/login');
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="flex-row items-center px-4 pt-12 pb-3">
        <Text className={`text-2xl font-bold flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 px-5">
        <SettingItem
          icon="person-circle"
          title="My Profile"
          onPress={() => router.push('/profile')}
        />

        <SettingItem
          icon={isDarkMode ? "sunny" : "moon"}
          title="Theme"
          onPress={toggleTheme}
          value={isDarkMode ? "Dark" : "Light"}
        />

        <SettingItem
          icon="information-circle"
          title="About"
          onPress={() => router.push('/about')}
        />

        <SettingItem
          icon="log-out"
          title="Logout"
          onPress={() => handleLogout()}
        />
      </ScrollView>
    </View>
  );
}
