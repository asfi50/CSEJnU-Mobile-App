import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { UserGreeting } from '@/components/dashboard/UserGreeting';
import { MenuGrid } from '@/components/dashboard/MenuGrid';
import { Feed } from '@/components/dashboard/Feed';

export default function Index() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { checkTokenExpiration, token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      if (await checkTokenExpiration()) {
        router.replace('/login');
        return;
      }
      const response = await authService.verifyToken(token!);
      if(response.valid) {
        setProfile(response.payload);
      }
      else {
        logout();
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Text className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <View className="p-5">
        <UserGreeting profile={profile} />
        <MenuGrid />
        </View>
        <Feed />
      </View>
    </ScrollView>
  );
}
