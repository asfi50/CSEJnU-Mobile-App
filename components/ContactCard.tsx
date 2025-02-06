import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Contact } from '@/types/contact';

interface ContactCardProps {
  contact: Contact;
  isCompact?: boolean;
}

export default function ContactCard({ contact, isCompact = false }: ContactCardProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/contact/[email]',
      params: { email: encodeURIComponent(contact.email) }
    });
  };

  if (isCompact) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className={`p-3 mb-2 rounded-xl flex-row items-center ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}
      >
        <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
          <Ionicons name="person" size={20} color="white" />
        </View>
        <View className="flex-1">
          <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {contact.name}
          </Text>
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {contact.email}
          </Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDarkMode ? '#fff' : '#666'} 
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`p-4 mb-3 rounded-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}
    >
      {/* Rest of the existing contact card layout */}
      // ...existing code...
    </TouchableOpacity>
  );
}
