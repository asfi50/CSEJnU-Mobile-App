import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface ContactSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export default function ContactSearch({ searchQuery, onSearchChange, onClear }: ContactSearchProps) {
  const { isDarkMode } = useTheme();

  return (
    <View className={`
      flex-row items-center border rounded-lg px-2 h-10
      ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
    `}>
      <Ionicons name="search" size={18} color={isDarkMode ? '#9ca3af' : '#666'} />
      <TextInput
        placeholder="Search contacts..."
        value={searchQuery}
        onChangeText={onSearchChange}
        className={`flex-1 px-2 text-sm ${isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-900'}`}
        placeholderTextColor={isDarkMode ? '#9ca3af' : '#666'}
      />
      {searchQuery ? (
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close-circle" size={18} color={isDarkMode ? '#9ca3af' : '#666'} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
