import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { getDaysUntilBirthday } from '@/utils/dateUtils';

export default function BirthdayCountdown({ birthday }: { birthday?: string }) {
  const { isDarkMode } = useTheme();
  if (!birthday) return null;

  const daysUntil = getDaysUntilBirthday(birthday);
  if (daysUntil === null) return null;

  return (
    <View className={`mt-4 p-3 rounded-lg ${
      isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
    }`}>
      <Text className={`text-center ${
        isDarkMode ? 'text-purple-300' : 'text-purple-700'
      }`}>
        {daysUntil === 0 ? "🎉 Today is their birthday! 🎂" :
         `🎂 Birthday in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`}
      </Text>
    </View>
  );
}
