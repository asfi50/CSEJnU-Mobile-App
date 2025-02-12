import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { AUTH_URL, wp_url } from "@/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

interface DashboardData {
  stats: {
    blogCount: number;
    videoCount: number;
    contactCount: number;
  };
  recentActivities: Array<{
    type: 'blog' | 'video' | 'contact';
    title: string;
    timestamp: string;
  }>;
}

export default function Index() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { checkTokenExpiration } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: { blogCount: 0, videoCount: 0, contactCount: 0 },
    recentActivities: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (await checkTokenExpiration()) {
        router.replace('/login');
        return;
      }

      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      // Fetch all data in parallel
      const [blogData, youtubeData, contactData] = await Promise.all([
        fetch(`${wp_url}/wp-json/wp/v2/posts?per_page=1`).then(res => ({
          count: parseInt(res.headers.get('X-WP-Total') || '0'),
          recent: res.json()
        })),
        fetch(`${AUTH_URL}/api/youtube.php?token=${token}`).then(res => res.json()),
        fetch(`${AUTH_URL}/api/contacts?token=${token}`).then(res => res.json())
      ]);

      // Compile stats
      const stats = {
        blogCount: blogData.count,
        videoCount: youtubeData.videos?.length || 0,
        contactCount: Array.isArray(contactData) ? contactData.length : 0
      };

      // Compile recent activities
      const recentActivities: Array<{ type: 'blog' | 'video' | 'contact'; title: string; timestamp: string }> = [];
      
      // Add most recent blog post
      if (Array.isArray(await blogData.recent) && (await blogData.recent)[0]) {
        const recentPost = (await blogData.recent)[0];
        recentActivities.push({
          type: 'blog',
          title: recentPost.title.rendered,
          timestamp: new Date(recentPost.date).toLocaleDateString()
        });
      }

      // Add most recent video
      if (youtubeData.videos?.[0]) {
        recentActivities.push({
          type: 'video',
          title: youtubeData.videos[0].title,
          timestamp: new Date(youtubeData.videos[0].published_at).toLocaleDateString()
        });
      }

      setDashboardData({ stats, recentActivities });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: string }) => (
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
          <StatCard 
            title="Blog Posts" 
            value={dashboardData.stats.blogCount} 
            icon="document-text" 
          />
          <StatCard 
            title="Videos" 
            value={dashboardData.stats.videoCount} 
            icon="videocam" 
          />
          <StatCard 
            title="Contacts" 
            value={dashboardData.stats.contactCount} 
            icon="people" 
          />
        </View>

        {/* Recent Activity */}
        <View className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Activity
          </Text>
          {dashboardData.recentActivities.map((activity, index) => (
            <View key={index} className="border-l-2 border-blue-500 pl-4 mb-3">
              <Text className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activity.title}
              </Text>
              <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                {activity.timestamp}
              </Text>
            </View>
          ))}
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
          description={`${dashboardData.stats.videoCount} videos available`}
          icon="logo-youtube"
          route="/youtube"
        />
        <NavigationCard 
          title="Blog Posts" 
          description={`${dashboardData.stats.blogCount} posts published`}
          icon="newspaper"
          route="/blog"
        />
        <NavigationCard 
          title="Contact Directory" 
          description={`${dashboardData.stats.contactCount} contacts available`}
          icon="people"
          route="/contacts"
        />
      </View>
    </ScrollView>
  );
}
