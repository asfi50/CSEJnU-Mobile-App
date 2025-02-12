import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Contact } from '@/types/contact';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { getDaysUntilBirthday, formatBirthday } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';

interface BirthdayTileProps {
  contact: Contact;
}

export default function BirthdayTile({ contact }: BirthdayTileProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const daysUntil = contact.birthday ? getDaysUntilBirthday(contact.birthday) : null;
  const formattedBirthday = contact.birthday ? formatBirthday(contact.birthday.split('/').reverse().join('/')) : '';

  const getBirthdayStatus = () => {
    if (!daysUntil && daysUntil !== 0) return 'Invalid date';
    if (daysUntil === 0) return 'Today! 🎉';
    if (daysUntil === 1) return 'Tomorrow';
    return `in ${daysUntil} days`;
  };

  if (!contact.birthday || daysUntil === null) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => router.push(`/contact/${encodeURIComponent(contact.email)}`)}
      className={`mb-3 rounded-xl overflow-hidden shadow-md ${
        isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
      } shadow-black/25 dark:shadow-black`}
    >
      <View className="flex-row p-4 items-center">
        <Image
          source={contact.photo ? { uri: contact.photo } : require('@/assets/images/icon.png')}
          className="w-14 h-14 rounded-full bg-gray-200"
        />
        <View className="flex-1 ml-4">
          <Text className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {contact.name}
          </Text>
          <Text className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {formattedBirthday}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons
              name="gift-outline"
              size={16}
              color={isDarkMode ? '#93C5FD' : '#2563EB'}
            />
            <Text className={`ml-1 text-sm font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
              {getBirthdayStatus()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
