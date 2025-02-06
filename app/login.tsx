import { View, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { isDarkMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/' as any);
    }
  }, [isLoggedIn]);

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