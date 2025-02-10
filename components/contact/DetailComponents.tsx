import { View, Text, TouchableOpacity, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export const DetailItem = ({ label, value }: { label: string; value?: string | null }) => {
  const { isDarkMode } = useTheme();
  if (!value) return null;
  
  const handleLongPress = async () => {
    await Clipboard.setString(value);
  };
  
  return (
    <View className="mb-4">
      <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</Text>
      <TouchableOpacity onLongPress={handleLongPress}>
        <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</Text>
      </TouchableOpacity>
    </View>
  );
};

export const SocialLink = ({ 
  icon, 
  label, 
  color, 
  onPress 
}: { 
  icon: string; 
  label: string; 
  color: string; 
  onPress: () => void;
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center mb-4"
    >
      <Ionicons name={icon as any} size={20} color={color} />
      <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</Text>
    </TouchableOpacity>
  );
};
