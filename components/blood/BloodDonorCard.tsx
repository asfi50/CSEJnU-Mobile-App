import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Contact } from '@/types/contact';
import { Linking } from 'react-native';
import { router } from 'expo-router';

interface BloodDonorCardProps {
  donor: Contact;
  isSelected?: boolean;
  onSelect?: () => void;
  onSendSMS?: () => void;
}

export default function BloodDonorCard({ donor, isSelected, onSelect, onSendSMS }: BloodDonorCardProps) {
  const { isDarkMode } = useTheme();

  const handleSendSMS = () => {
    if (donor.phone) {
      const message = `Hi, I am looking for ${donor.blood_type} blood. Please contact me if you can help.`;
      Linking.openURL(`sms:${donor.phone}?body=${encodeURIComponent(message)}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/contact/${donor.email}`)}
      className={`
        p-4 rounded-lg mb-3 border
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        ${isSelected ? (isDarkMode ? 'border-red-500' : 'border-red-500') : ''}
      `}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {donor.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="bg-red-500/20 px-2 py-0.5 rounded-full">
              <Text className="text-red-500 text-xs font-medium">{donor.blood_type}</Text>
            </View>
          </View>
          {donor.phone && (
            <Text className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {donor.phone}
            </Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          {onSelect && (
            <TouchableOpacity
              onPress={onSelect}
              className={`w-8 h-8 rounded-full items-center justify-center
                ${isSelected ? 'bg-red-500' : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <Ionicons
                name={isSelected ? 'checkmark' : 'add'}
                size={20}
                color={isSelected ? 'white' : isDarkMode ? '#9ca3af' : '#666'}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onSendSMS || handleSendSMS}
            className={`w-8 h-8 rounded-full items-center justify-center
              ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
          >
            <Ionicons
              name="chatbox-outline"
              size={20}
              color={isDarkMode ? '#9ca3af' : '#666'}
            />
          </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
  );
}