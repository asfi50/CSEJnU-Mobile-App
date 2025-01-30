import { Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";

export default function Index() {
  const { logout } = useAuth();
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View className={`flex-1 p-5 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="flex-1 justify-center">
        <View className={`p-6 rounded-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-xl`}>
          <Text className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Back
          </Text>
          <Text className={`text-base mb-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Your dashboard is ready
          </Text>
          
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-red-500 p-4 rounded-xl active:bg-red-600"
          >
            <Text className="text-white font-semibold text-center text-base">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
