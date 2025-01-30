import { View, StatusBar } from 'react-native';
import LoginForm from '../components/LoginForm';
import { useTheme } from '@/context/ThemeContext';

export default function Login() {
  const { isDarkMode } = useTheme();
  
  return (
    <View className={`flex-1 justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#111827' : '#f9fafb'}
      />
      <LoginForm />
    </View>
  );
}