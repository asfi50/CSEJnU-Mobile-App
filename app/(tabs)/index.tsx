import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const StatCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
    <View className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex-1 mx-1`}>
      <Ionicons name={icon as any} size={24} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
      <Text className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </Text>
      <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
        {title}
      </Text>
    </View>
  );

  const NavigationCard = ({ title, description, icon, route }: { title: string; description: string; icon: string; route: string }) => (
    <TouchableOpacity 
      onPress={() => router.push(route as any)}
      className={`p-4 rounded-xl mb-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex-row items-center`}
    >
      <View className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
        <Ionicons name={icon as any} size={24} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
      </View>
      <View className="flex-1 ml-4">
        <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </Text>
        <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
    </TouchableOpacity>
  );

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="p-5">
        {/* Header */}
        <View className="mb-6">
          <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </Text>
          <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Welcome back to CSE JnU
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row mb-6">
          <StatCard title="Blog Posts" value="24" icon="document-text" />
          <StatCard title="Videos" value="12" icon="videocam" />
          <StatCard title="Contacts" value="156" icon="people" />
        </View>

        {/* Recent Activity */}
        <View className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Activity
          </Text>
          <View className="border-l-2 border-blue-500 pl-4">
            <Text className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>New blog post published</Text>
            <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>2 hours ago</Text>
          </View>
        </View>

        {/* Navigation Cards */}
        <NavigationCard 
          title="My Profile" 
          description="View and edit your profile"
          icon="person"
          route="/profile"
        />
        <NavigationCard 
          title="YouTube Content" 
          description="Watch latest videos"
          icon="logo-youtube"
          route="/youtube"
        />
        <NavigationCard 
          title="Blog Posts" 
          description="Read recent articles"
          icon="newspaper"
          route="/blog"
        />
        <NavigationCard 
          title="Contact Directory" 
          description="Browse contacts"
          icon="people"
          route="/contacts"
        />
      </View>
    </ScrollView>
  );
}
