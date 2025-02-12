import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/Header";

export default function ProfileLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Stack
      screenOptions={{
        header: (props) => <Header title={props.route.name} />,
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
