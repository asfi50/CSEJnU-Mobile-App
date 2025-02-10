import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface QuickActionsProps {
  phone: string;
  email: string;
}

export default function QuickActions({ phone, email }: QuickActionsProps) {
  const { isDarkMode } = useTheme();

  const handleCall = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View className={`flex-row justify-around p-4 rounded-xl mb-4 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <TouchableOpacity onPress={handleCall} className="items-center">
        <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mb-1">
          <Ionicons name="call" size={24} color="white" />
        </View>
        <Text className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Call</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleEmail} className="items-center">
        <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mb-1">
          <Ionicons name="mail" size={24} color="white" />
        </View>
        <Text className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email</Text>
      </TouchableOpacity>
    </View>
  );
}
