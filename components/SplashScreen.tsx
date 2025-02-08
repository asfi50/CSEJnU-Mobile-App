import React, { useEffect } from 'react';
import { View, Image, Text, StatusBar, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

export default function SplashScreen() {
  const { isDarkMode } = useTheme();
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const copyrightOpacity = useSharedValue(0);

  useEffect(() => {
    // Hide status bar on mount
    StatusBar.setHidden(true);
    scale.value = withSpring(1, {
      damping: 20,
      stiffness: 90,
    });
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.ease,
    });
    taglineOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.ease,
    }, () => {
      // Animation completed callback if needed
    });

    // Add copyright animation with delay
    setTimeout(() => {
      copyrightOpacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.ease,
      });
    }, 500);

    // Cleanup
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [
      { translateY: withTiming(taglineOpacity.value * 0, { duration: 1000 }) }
    ],
  }));

  const copyrightAnimatedStyle = useAnimatedStyle(() => ({
    opacity: copyrightOpacity.value,
    transform: [
      { translateY: withTiming(copyrightOpacity.value * -10, { duration: 800 }) }
    ],
  }));

  return (
    <SafeAreaView 
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      style={{ 
        marginTop: Platform.OS === 'android' ? -(StatusBar.currentHeight ?? 0) : 0
      }}
    >
      <View className="absolute inset-0 justify-center items-center">
        <Animated.View style={logoAnimatedStyle} className="items-center">
          <Image
            source={require('../assets/images/icon.png')}
            className="w-40 h-40"
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.Text
          style={taglineAnimatedStyle}
          className={`mt-6 text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
        >
          CSE JnU Community
        </Animated.Text>
        
        <Animated.Text
          style={taglineAnimatedStyle}
          className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Learn • Connect • Grow
        </Animated.Text>
      </View>
      
      <Animated.Text
        style={[copyrightAnimatedStyle, { 
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 40 : 20,
          width: '100%',
          textAlign: 'center'
        }]}
        className={`px-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
      >
        © {new Date().getFullYear()} Department of Computer Science & Engineering{'\n'}
        Jagannath University
      </Animated.Text>
    </SafeAreaView>
  );
}
