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
  children?: CommentType[]; // Add children property for nested comments
}

interface CommentsProps {
  comments: CommentType[];
}

export default function Comments({ comments }: CommentsProps) {
  const { isDarkMode } = useTheme();

  const organizeComments = (flatComments: CommentType[]): CommentType[] => {
    const commentMap = new Map<number, CommentType>();
    const rootComments: CommentType[] = [];

    // Create a map of all comments
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    // Organize into hierarchy
    flatComments.forEach(comment => {
      const commentWithChildren = commentMap.get(comment.id)!;
      
      if (comment.parent === 0) {
        rootComments.push(commentWithChildren);
      } else {
        const parentComment = commentMap.get(comment.parent);
        if (parentComment) {
          if (!parentComment.children) {
            parentComment.children = [];
          }
          parentComment.children.push(commentWithChildren);
        } else {
          // If parent is not found, treat as root comment
          rootComments.push(commentWithChildren);
        }
      }
    });

    // Sort children comments by date
    const sortComments = (comments: CommentType[]) => {
      comments.forEach(comment => {
        if (comment.children && comment.children.length > 0) {
          comment.children.sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          sortComments(comment.children);
        }
      });
    };

    sortComments(rootComments);
    return rootComments;
  };

  const renderComment = (comment: CommentType, depth: number = 0) => (
    <View key={comment.id}>
      <View 
        className={`p-4 mb-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}
        style={{ marginLeft: depth * 20 }}
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
      {comment.children?.map(child => renderComment(child, depth + 1))}
    </View>
  );

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

  const organizedComments = organizeComments(comments);

  return (
    <View>
      <Text className={`text-xl font-bold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Comments ({comments.length})
      </Text>
      {organizedComments.map(comment => renderComment(comment))}
    </View>
  );
}
