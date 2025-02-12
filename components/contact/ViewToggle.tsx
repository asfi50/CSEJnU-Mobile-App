import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface ViewToggleProps {
  isGrid: boolean;
  onToggle: () => void;
}

export default function ViewToggle({ isGrid, onToggle }: ViewToggleProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <TouchableOpacity
      onPress={onToggle}
      className={`h-9 px-3 rounded-lg items-center justify-center border
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}
    >
      <Ionicons
        name={isGrid ? "list" : "grid"}
        size={16}
        color={isDarkMode ? '#fff' : '#666'}
      />
    </TouchableOpacity>
  );
}
