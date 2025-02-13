import { useState } from 'react';
import { View, Image, ActivityIndicator, ImageProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ProgressiveImageProps extends ImageProps {
  uri: string;
  className?: string;
}

export default function ProgressiveImage({ uri, className, ...props }: ProgressiveImageProps) {
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  return (
    <View className={className}>
      <Image
        source={{ uri }}
        className="w-full h-full"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        {...props}
      />
      {loading && (
        <View className="absolute inset-0 items-center justify-center bg-gray-900/10">
          <ActivityIndicator color={isDarkMode ? '#fff' : '#000'} />
        </View>
      )}
    </View>
  );
}
