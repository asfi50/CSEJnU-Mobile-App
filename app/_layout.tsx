import { useRouter, Stack } from "expo-router";
import { useEffect } from "react";
import { View, StatusBar } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import Header from "@/components/Header";
import './global.css';

function ProtectedLayout() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn]);

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#111827' : '#f9fafb'}
      />
      <Stack
        screenOptions={{
          header: (props) => <Header title={props.route.name} />,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}

