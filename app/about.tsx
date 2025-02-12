import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Markdown from 'react-native-markdown-display';
import { github_repo, github_branch } from '@/config';

export default function About() {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReadme();
  }, []);

  const fetchReadme = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/' + github_repo +'/'+ github_branch+ '/README.md');
      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error('Failed to fetch README:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const markdownStyles = {
    body: {
      color: isDarkMode ? '#fff' : '#000',
    },
    heading1: {
      color: isDarkMode ? '#fff' : '#000',
      borderBottomWidth: 1,
      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
      paddingBottom: 8,
      marginBottom: 16,
    },
    heading2: {
      color: isDarkMode ? '#fff' : '#000',
      marginTop: 20,
      marginBottom: 10,
    },
    paragraph: {
      color: isDarkMode ? '#d1d5db' : '#374151',
      marginBottom: 16,
      lineHeight: 24,
    },
    link: {
      color: '#3b82f6',
    },
    listItem: {
      color: isDarkMode ? '#d1d5db' : '#374151',
      marginBottom: 8,
    },
    code_inline: {
      backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
      padding: 4,
      borderRadius: 4,
      color: isDarkMode ? '#fff' : '#000',
    },
    code_block: {
      backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
      padding: 8,
      borderRadius: 4,
      color: isDarkMode ? '#fff' : '#000',
    },
  };

  if (loading) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="About" showBack />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="About" showBack />
        <View className="flex-1 justify-center items-center">
          <Text className={isDarkMode ? 'text-white' : 'text-black'}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="About" showBack />
      <ScrollView 
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Markdown style={markdownStyles}>
          {content}
        </Markdown>
      </ScrollView>
    </View>
  );
}
