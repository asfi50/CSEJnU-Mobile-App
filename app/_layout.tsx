import { Slot } from "expo-router";
import { View, StatusBar, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import Toast from 'react-native-toast-message';
import './global.css';

function ProtectedLayout() {
  const { isLoggedIn, isInitializing } = useAuth();
  const { isDarkMode } = useTheme();

  if (isInitializing) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#111827' : '#f9fafb'}
      />
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedLayout />
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  );
}

