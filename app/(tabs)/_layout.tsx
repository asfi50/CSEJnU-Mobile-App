import { Tabs } from "expo-router";
import { useTheme } from '@/context/ThemeContext';
import Header from "@/components/Header";
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const { isDarkMode } = useTheme();

  const getScreenTitle = (routeName: string) => {
    const titles: { [key: string]: string } = {
      index: 'Home',
      contacts: 'Contacts',
      blog: 'Blog',
      youtube: 'YouTube'
    };
    return titles[routeName] || routeName;
  };

  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header title={getScreenTitle(props.route.name)} />,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#111827' : '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          padding: 10,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: isDarkMode ? '#6b7280' : '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: 'Blog',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="youtube"
        options={{
          title: 'YouTube',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="logo-youtube" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
