import { View, ScrollView, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Contact } from '@/types/contact';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_URL } from "@/config";

export default function ContactDetail() {
  const { email } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        const response = await fetch(`${AUTH_URL}/api/contacts?token=${token}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const decodedEmail = decodeURIComponent(email as string);
          const foundContact = data.find(c => c.email === decodedEmail);
          if (foundContact) {
            setContact(foundContact);
          }
        }
      } catch (err) {
        console.error('Error fetching contact:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [email]);

  if (loading) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header showBack title="Loading..." />
        <View className="p-4">
          <Text className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  if (!contact) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header showBack title="Not Found" />
        <View className="p-4">
          <Text className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Contact not found
          </Text>
        </View>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${contact.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contact.email}`);
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header showBack title={contact.name} />
      <ScrollView>
        <View className="p-4">
          {/* Header with avatar */}
          <View className={`p-6 rounded-xl mb-4 items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {contact.photo ? (
              <Image 
                source={{ uri: contact.photo }} 
                className="w-20 h-20 rounded-full mb-3"
              />
            ) : (
              <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
                <Text className="text-white text-3xl font-bold">
                  {contact.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {contact.name}
            </Text>
            <View className="flex-row flex-wrap justify-center gap-2 mt-2">
              {contact.roles.um_student && (
                <Text className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  Student
                </Text>
              )}
              {contact.roles.um_teacher && (
                <Text className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
                  Teacher
                </Text>
              )}
              {Array.isArray(contact.graduated) && contact.graduated.includes("Yes") && (
                <Text className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  Alumni
                </Text>
              )}
              {Array.isArray(contact.cr) && contact.cr.includes("Yes") && (
                <Text className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-amber-900 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                  CR
                </Text>
              )}
            </View>
          </View>

          {/* Contact Actions */}
          <View className={`flex-row justify-around p-4 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <TouchableOpacity onPress={handleCall} className="items-center">
              <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mb-1">
                <Ionicons name="call" size={24} color="white" />
              </View>
              <Text className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEmail} className="items-center">
              <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mb-1">
                <Ionicons name="mail" size={24} color="white" />
              </View>
              <Text className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Details */}
          <View className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Basic Info Section */}
            <View className="mb-6">
              <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Basic Information</Text>
              <DetailItem label="Phone" value={contact.phone} />
              <DetailItem label="Email" value={contact.email} />
              <DetailItem label="Blood Type" value={contact.blood_type} />
              <DetailItem label="Birthday" value={contact.birthday} />
              <DetailItem label="Gender" value={contact.gender?.join(', ')} />
            </View>

            {/* Academic Info Section */}
            <View className="mb-6">
              <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Academic Information</Text>
              <DetailItem label="Student ID" value={contact.student_id} />
              <DetailItem label="Batch" value={contact.batch} />
              <DetailItem 
                label="CR" 
                value={Array.isArray(contact.cr) && contact.cr.includes("Yes") ? "Yes" : "No"} 
              />
              <DetailItem 
                label="Graduated" 
                value={Array.isArray(contact.graduated) && contact.graduated.includes("Yes") ? "Yes" : "No"} 
              />
              <DetailItem label="Job Description" value={contact.job_description} />
            </View>

            {/* Social Links Section */}
            <View>
              <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Social Links</Text>
              
              {contact.linkedin && (
                <SocialLink 
                  icon="logo-linkedin" 
                  label="LinkedIn"
                  color={isDarkMode ? '#fff' : '#0077b5'}
                  onPress={() => Linking.openURL(contact.linkedin!)}
                />
              )}
              {contact.facebook && (
                <SocialLink 
                  icon="logo-facebook" 
                  label="Facebook"
                  color={isDarkMode ? '#fff' : '#1877f2'}
                  onPress={() => Linking.openURL(contact.facebook!)}
                />
              )}
              {contact.twitter && (
                <SocialLink 
                  icon="logo-twitter" 
                  label="Twitter"
                  color={isDarkMode ? '#fff' : '#1DA1F2'}
                  onPress={() => Linking.openURL(contact.twitter!)}
                />
              )}
              {contact.telegram && (
                <SocialLink 
                  icon="paper-plane" 
                  label="Telegram"
                  color={isDarkMode ? '#fff' : '#0088cc'}
                  onPress={() => Linking.openURL(contact.telegram!)}
                />
              )}
              {contact.github && (
                <SocialLink 
                  icon="logo-github" 
                  label="GitHub"
                  color={isDarkMode ? '#fff' : '#333'}
                  onPress={() => Linking.openURL(contact.github!)}
                />
              )}
              {contact.website && (
                <SocialLink 
                  icon="globe" 
                  label="Website"
                  color={isDarkMode ? '#fff' : '#4a5568'}
                  onPress={() => Linking.openURL(contact.website!)}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Helper components
const DetailItem = ({ label, value }: { label: string; value?: string | null }) => {
  const { isDarkMode } = useTheme();
  if (!value) return null;
  
  return (
    <View className="mb-4">
      <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</Text>
      <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</Text>
    </View>
  );
};

const SocialLink = ({ 
  icon, 
  label, 
  color, 
  onPress 
}: { 
  icon: string; 
  label: string; 
  color: string; 
  onPress: () => void;
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center mb-4"
    >
      <Ionicons name={icon as any} size={20} color={color} />
      <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</Text>
    </TouchableOpacity>
  );
};
