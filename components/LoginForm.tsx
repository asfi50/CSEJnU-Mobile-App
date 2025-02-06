import { View, Text, TextInput, TouchableOpacity, Switch, Linking, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useAuth, TEST_CREDENTIALS } from '../context/AuthContext';
import { wp_url } from '@/config';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginForm() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState(TEST_CREDENTIALS.username);
  const [password, setPassword] = useState(TEST_CREDENTIALS.password);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (isLoading) return;
    setError('');
    const success = await login(username, password, rememberMe);
    if (success) {
      router.replace('/' as any);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = async () => {
    const registerUrl = `${wp_url}/register`;
    try {
      await Linking.openURL(registerUrl);
    } catch (error) {
      setError('Could not open registration page');
    }
  };

  const handleForgotPassword = async () => {
    const resetUrl = `${wp_url}/password-reset`;
    try {
      await Linking.openURL(resetUrl);
    } catch (error) {
      setError('Could not open password reset page');
    }
  };

  return (
    <View className={`
      p-6 mx-5 rounded-3xl shadow-xl
      ${isDarkMode ? 'bg-gray-800/90' : 'bg-white'}
    `}>
      <Text className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Welcome Back
      </Text>

      <Text className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
        Test Account:{'\n'}
        Username: {TEST_CREDENTIALS.username}{'\n'}
        Password: {TEST_CREDENTIALS.password}
      </Text>

      <View className="mb-4">
        <Text className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Username</Text>
        <View className={`
          flex-row items-center border rounded-xl px-3
          ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200'}
        `}>
          <Ionicons name="person-outline" size={20} color={isDarkMode ? '#fff' : '#666'} />
          <TextInput
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            className={`flex-1 py-3 px-2 ${isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-900'}`}
            autoCapitalize="none"
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#666'}
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Password</Text>
        <View className={`
          flex-row items-center border rounded-xl px-3
          ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200'}
        `}>
          <Ionicons name="lock-closed-outline" size={20} color={isDarkMode ? '#fff' : '#666'} />
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            className={`flex-1 py-3 px-2 ${isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-900'}`}
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#666'}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color={isDarkMode ? '#fff' : '#666'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: isDarkMode ? '#4b5563' : '#e5e7eb', true: '#3b82f6' }}
            thumbColor={rememberMe ? '#fff' : isDarkMode ? '#9ca3af' : '#f4f3f4'}
          />
          <Text className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Remember me
          </Text>
        </View>
      </View>

      {error ? (
        <Text className="text-red-500 mb-4 text-center">
          {error}
        </Text>
      ) : null}

      <TouchableOpacity 
        onPress={handleSubmit}
        disabled={isLoading}
        className={`
          p-4 rounded-xl flex-row justify-center items-center
          ${isLoading ? 'bg-blue-400' : 'bg-blue-500 active:bg-blue-600'}
        `}
      >
        {isLoading ? (
          <ActivityIndicator color="white" className="mr-2" />
        ) : null}
        <Text className="text-white font-semibold text-center text-base">
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center">
        <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text className="text-blue-500 font-semibold">Register here</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-2 flex-row justify-center">
        <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Forgot your password?{' '}
        </Text>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text className="text-blue-500 font-semibold">Reset here</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}