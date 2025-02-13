import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/Header";

export default function ProfileLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Stack
      screenOptions={{
        header: () => <Header title="Profile" />,
        contentStyle: {
          backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
        },
        headerStyle: {
          backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        },
        headerTintColor: isDarkMode ? '#ffffff' : '#000000',
      }}
    >
    </Stack>
  );
}
