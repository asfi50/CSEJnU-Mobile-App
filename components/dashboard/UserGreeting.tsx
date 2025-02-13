import React from 'react';
import { Text, View, TouchableOpacity, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { getTimeBasedGreeting } from "@/utils/dateUtils";

interface UserGreetingProps {
  profile: any;
}

export const UserGreeting = ({ profile }: UserGreetingProps) => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <View className="mb-8 px-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-shrink">
          <View className="flex-row items-center">
            <View className="w-1.5 h-8 bg-blue-500 rounded-full mr-3" />
            <Text className={`text-sm font-medium flex-wrap ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {getTimeBasedGreeting()}
            </Text>
          </View>
          <Text 
            className={`text-3xl font-bold mt-2 flex-wrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            Welcome back, {profile?.name || 'User'}! 👋
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/profile')}
          className="ml-4 flex-shrink-0"
          style={{
            shadowColor: isDarkMode ? '#1F2937' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3
          }}
        >
          {profile?.meta?.photo ? (
            <Image
              source={{ uri: profile.meta.photo }}
              className="w-14 h-14 rounded-2xl border-2 border-blue-500"
            />
          ) : (
            <View className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl items-center justify-center border-2 border-blue-500">
              <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
