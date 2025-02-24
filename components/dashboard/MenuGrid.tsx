import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { wp_url } from '@/config';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  color: string;
}

const menuItems: MenuItem[] = [
  { title: 'Achievements', icon: 'trophy', route: '/achievements', color: '#FFA500' },
  { title: 'Questions', icon: 'help-circle', route: '/questions', color: '#FF6B6B' },
  { title: 'Website', icon: 'globe', route: wp_url, color: '#4ECDC4' },
  { title: 'Facebook', icon: 'logo-facebook', route: 'https://www.facebook.com/groups/156209764450123', color: '#1877F2' },
  { title: 'Birthdays', icon: 'gift', route: '/birthdays', color: '#FFD93D' },
  { title: 'Blood Groups', icon: 'water', route: '/blood', color: '#FF6B6B' },
  { title: 'Gallery', icon: 'images', route: '/gallery', color: '#6C5CE7' },
  { title: 'Events', icon: 'calendar', route: '/events', color: '#A8E6CF' },
  { title: 'Members', icon: 'people', route: '/contacts', color: '#FF8B94' },
  { title: 'Resources', icon: 'folder', route: '/resources', color: '#B83B5E' },
  { title: 'Settings', icon: 'settings', route: '/settings', color: '#6C5CE7' },
];

export const MenuGrid = () => {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = isExpanded ? menuItems : menuItems.slice(0, 8);
  const partialItems = menuItems.slice(8, 12); // Show full third row (4 items)
  
  const MenuItem = ({ item, isPartial = false }: { item: MenuItem, isPartial?: boolean }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.route.startsWith('http')) {
          Linking.openURL(item.route);
        } else {
          router.push(item.route as any);
        }
      }}
      className="items-center justify-center w-1/4 p-2"
      style={{ opacity: isPartial ? 0.3 : 1 }}
    >
      <View 
        className={`w-14 h-14 rounded-full items-center justify-center ${
          isDarkMode ? 'border border-gray-700' : ''
        }`}
        style={{ backgroundColor: `${item.color}${isDarkMode ? '15' : '20'}` }}
      >
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={isDarkMode ? `${item.color}CC` : item.color} 
        />
      </View>
      {!isPartial && (
        <Text 
          className={`text-xs text-center mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View 
      className={`rounded-xl p-4 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white'}`}
      style={{
        shadowColor: isDarkMode ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3
      }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Access
        </Text>
        <TouchableOpacity 
          onPress={() => setIsExpanded(!isExpanded)}
          className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}
        >
          <Text className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {isExpanded ? 'Show Less' : 'Show All'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap">
        {visibleItems.map((item) => (
          <MenuItem key={item.title} item={item} />
        ))}
      </View>

      {!isExpanded && partialItems.length > 0 && (
        <View className="relative">
          <View className="flex-row flex-wrap" style={{ height: 35 }}>
            {partialItems.map((item) => (
              <MenuItem key={item.title} item={item} isPartial />
            ))}
          </View>
          <LinearGradient
            colors={[
              isDarkMode ? 'rgba(31, 41, 55, 0)' : 'rgba(255, 255, 255, 0)',
              isDarkMode ? 'rgba(31, 41, 55, 1)' : 'rgba(255, 255, 255, 1)'
            ]}
            className="absolute bottom-0 left-0 right-0 h-[35px]"
            style={{ opacity: 0.95 }}
            pointerEvents="none"
          />
        </View>
      )}
    </View>
  );
};
