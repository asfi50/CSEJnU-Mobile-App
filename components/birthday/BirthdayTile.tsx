import React from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Contact } from '@/types/contact';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { getDaysUntilBirthday, formatBirthday } from '@/utils/dateUtils';

interface BirthdayTileProps {
  contact: Contact;
}

export default function BirthdayTile({ contact }: BirthdayTileProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const daysUntil = getDaysUntilBirthday(contact.birthday || '');

  const getStatusColors = () => {
    if (!daysUntil) return ['bg-gray-100', 'text-gray-600'];
    if (daysUntil === 0) return ['bg-red-50', 'text-red-600'];
    if (daysUntil <= 7) return ['bg-emerald-50', 'text-emerald-600'];
    if (daysUntil <= 30) return ['bg-amber-50', 'text-amber-600'];
    return ['bg-blue-50', 'text-blue-600'];
  };

  const [bgColor, textColor] = getStatusColors();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/contact/${encodeURIComponent(contact.email)}`)}
      className={`mb-4 rounded-2xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800/90' : 'bg-white'
      } shadow-lg`}
    >
      <View className={`p-4 ${isDarkMode ? '' : bgColor}`}>
        <View className="flex-row items-center gap-4">
          <View className="relative">
            <Image
              source={contact.photo ? { uri: contact.photo } : require('@/assets/images/icon.png')}
              className="w-16 h-16 rounded-2xl"
            />
            {daysUntil === 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center">
                <Text className="text-white text-xs">🎉</Text>
              </View>
            )}
          </View>

          <View className="flex-1 justify-center">
            <Text 
              numberOfLines={1}
              className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {contact.name}
            </Text>
            
            <View className="flex-row items-center gap-2">
              <View className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700' : bgColor}`}>
                <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : textColor}`}>
                  {formatBirthday((contact.birthday ?? '').split('/').reverse().join('/'))}
                </Text>
              </View>

              {daysUntil !== null && (
                <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : textColor}`}>
                  {daysUntil === 0 ? '• Today!' :
                   daysUntil === 1 ? '• Tomorrow!' :
                   `• ${daysUntil} days`}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
