import { Stack, useGlobalSearchParams } from "expo-router";
import { useTheme } from '@/context/ThemeContext';
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { wp_url } from '@/config';
import { decode } from 'html-entities';

interface WPPost {
  title: { rendered: string };
  content: { rendered: string };
}

export default function PostLayout() {
  const { isDarkMode } = useTheme();
  const { id } = useGlobalSearchParams();
  const [postTitle, setPostTitle] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${wp_url}/wp-json/wp/v2/posts/${id}`);
        const data: WPPost = await response.json();
        if (data && data.title) {
          setPostTitle(decode(data.title.rendered));
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  return (
    <Stack
      screenOptions={{
        header: () => <Header 
          title={postTitle || "Loading..."}
          showBack={true}
        />,
        contentStyle: {
          backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: postTitle || "Loading...",
        }}
      />
    </Stack>
  );
}
