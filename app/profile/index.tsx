import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { authService } from '@/services/auth.service';
import { ProfileData } from "@/types/profile";
import { formatBirthday } from "@/utils/dateUtils";

export default function Profile() {
  const { logout, token, checkTokenExpiration } = useAuth();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      if (await checkTokenExpiration()) {
        router.replace('/login');
        return;
      }
      
      const data = await authService.verifyToken(token!);
      if (data.valid) {
        setProfile(data.payload);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    value ? (
      <View className="mb-4">
        <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</Text>
        <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</Text>
      </View>
    ) : null
  );

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="p-5">
        <View className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
          {isLoading ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
              <Text className={`mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Loading profile...
              </Text>
            </View>
          ) : profile && (
            <>
              <View className="items-center mb-4">
                {profile.meta.photo ? (
                  <Image
                    source={{ uri: profile.meta.photo }}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                ) : (
                  <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
                    <Text className="text-white text-4xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Profile Information
              </Text>
              
              <InfoItem label="Name" value={profile.name} />
              <InfoItem label="Email" value={profile.email} />
              <InfoItem label="Role" value={profile.meta.role} />
              <InfoItem label="Student ID" value={profile.meta.student_id} />
              <InfoItem label="Batch" value={profile.meta.batch} />
              <InfoItem label="Blood Type" value={profile.meta.blood_type} />
              <InfoItem 
                label="Birthday" 
                value={profile.meta.birthday ? formatBirthday(profile.meta.birthday) : ''} 
              />
              <InfoItem label="Phone" value={profile.meta.phone} />
              <InfoItem label="Facebook" value={profile.meta.facebook} />
              <InfoItem label="LinkedIn" value={profile.meta.linkedin} />
              <InfoItem label="Twitter" value={profile.meta.twitter} />
              <InfoItem label="Telegram" value={profile.meta.telegram} />
              <InfoItem label="GitHub" value={profile.meta.github} />
              <InfoItem label="Website" value={profile.meta.website} />
            </>
          )}
          
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-red-500 p-4 rounded-xl active:bg-red-600 mt-6"
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-center text-base">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
