import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { decode } from 'html-entities';

interface CommentType {
  id: number;
  author_name: string;
  author_avatar_urls: {
    [key: string]: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  parent: number;
}

interface CommentsProps {
  comments: CommentType[];
}

export default function Comments({ comments }: CommentsProps) {
  const { isDarkMode } = useTheme();

  if (!comments || comments.length === 0) {
    return (
      <View className={`p-4 mb-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <Text className={`text-center ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          No comments yet. Be the first to share your thoughts!
        </Text>
      </View>
    );
  }

  const renderComment = (comment: CommentType) => (
    <View 
      key={comment.id} 
      className={`p-4 mb-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}
    >
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: comment.author_avatar_urls['96'] }}
          className="w-8 h-8 rounded-full mr-2"
        />
        <View>
          <Text className={`font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-900'
          }`}>
            {comment.author_name}
          </Text>
          <Text className={`text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {new Date(comment.date).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text 
        className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
      >
        {decode(comment.content.rendered.replace(/<[^>]*>/g, ''))}
      </Text>
    </View>
  );

  return (
    <View>
      <Text className={`text-xl font-bold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Comments ({comments.length})
      </Text>
      {comments.map(renderComment)}
    </View>
  );
}
