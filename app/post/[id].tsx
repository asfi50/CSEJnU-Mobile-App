import { View, Text, ScrollView, ActivityIndicator, Image, useWindowDimensions, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { wp_url } from '@/config';
import { decode } from 'html-entities';
import ProgressiveImage from '@/components/ProgressiveImage';
import { WebView } from 'react-native-webview';
import LightboxImage from '@/components/LightboxImage';

interface WPPost {
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  featured_media_url?: string;
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
  author: {
    name: string;
    avatar_urls: { [key: string]: string };
  };
}

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const { width } = useWindowDimensions();
  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [webViewHeight, setWebViewHeight] = useState(1000);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${wp_url}/wp-json/wp/v2/posts/${id}?_embed`);
      const data = await response.json();

      const formattedPost: WPPost = {
        title: { rendered: decode(data.title.rendered) },
        content: { rendered: decode(data.content.rendered) },
        date: new Date(data.date).toLocaleDateString(),
        featured_media_url: data._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        categories: data._embedded?.['wp:term']?.[0] || [],
        tags: data._embedded?.['wp:term']?.[1] || [],
        author: data._embedded?.['author']?.[0] || {
          name: 'Unknown',
          avatar_urls: { '96': 'https://www.gravatar.com/avatar/00000000000000000000000000000000' }
        }
      };

      setPost(formattedPost);
    } catch (err) {
      console.error('Post fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateHtml = (content: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, system-ui;
            background: ${isDarkMode ? '#111827' : '#F9FAFB'};
            color: ${isDarkMode ? '#D1D5DB' : '#374151'};
          }
          img {
            width: 100% !important;
            height: auto !important;
            display: block;
            margin: 16px 0;
            border-radius: 8px;
            cursor: pointer;
          }
          figure {
            margin: 0;
            padding: 0;
            width: 100% !important;
          }
          iframe {
            width: 100% !important;
            height: auto;
            aspect-ratio: 16/9;
            margin: 16px 0;
          }
        </style>
      </head>
      <body>${content}</body>
      <script>
        document.querySelectorAll('img').forEach(img => {
          img.addEventListener('load', function() {
            const ratio = this.naturalHeight / this.naturalWidth;
            this.style.height = this.offsetWidth * ratio + 'px';
          });
          img.onclick = function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'image-click',
              url: this.src
            }));
          }
        });
        window.onload = () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'height',
            height: document.body.scrollHeight
          }));
        }
      </script>
    </html>
  `;

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      </View>
    );
  }

  if (!post) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Text className={isDarkMode ? 'text-white' : 'text-black'}>Post not found</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView 
        className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <ProgressiveImage
          uri={post.featured_media_url || 'https://picsum.photos/800/400'}
          className="w-full aspect-[16/9]"
          resizeMode="cover"
        />
        <View className="p-4">
          {/* Categories */}
          <View className="flex-row gap-2 mb-4">
            {post.categories.map(category => (
              <View 
                key={category.id} 
                className={`px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}
              >
                <Text className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  {category.name}
                </Text>
              </View>
            ))}
          </View>
          {/* Title */}
          <Text className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {post.title.rendered}
          </Text>
          {/* Author and Date */}
          <View className="flex-row items-center mb-6">
            <Image
              source={{ uri: post.author.avatar_urls['96'] }}
              className="w-8 h-8 rounded-full mr-2"
            />
            <View>
              <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {post.author.name}
              </Text>
              <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {post.date}
              </Text>
            </View>
          </View>
          {/* Content */}
          <WebView
            originWhitelist={['*']}
            source={{ 
              html: generateHtml(post.content.rendered)
            }}
            style={{
              height: webViewHeight,
              backgroundColor: isDarkMode ? '#111827' : '#F9FAFB',
              width: width - 32,
            }}
            scrollEnabled={false}
            onMessage={event => {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'height') {
                setWebViewHeight(Number(data.height));
              } else if (data.type === 'image-click') {
                setLightboxImage(data.url);
              }
            }}
            injectedJavaScript={`
              window.ReactNativeWebView.postMessage(document.body.scrollHeight);
              true;
            `}
          />
          <LightboxImage
            isVisible={!!lightboxImage}
            imageUrl={lightboxImage || ''}
            onClose={() => setLightboxImage(null)}
          />
          {/* Tags */}
          {post.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-6 pt-6 border-t border-gray-700/20">
              {post.tags.map(tag => (
                <Text 
                  key={tag.id}
                  className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  #{tag.name}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
