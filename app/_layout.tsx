import React from 'react';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import Toast from 'react-native-toast-message';
import './global.css';

function LayoutContent() {
  const { isLoggedIn, isInitializing } = useAuth();
  const { isDarkMode } = useTheme();

  if (isInitializing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false, // Hide header for all screens by default
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
          },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="post" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="contact" />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

