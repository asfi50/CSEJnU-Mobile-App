import { View, ScrollView, Text, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
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
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="p-4">
        {/* Header with avatar */}
        <View className={`p-6 rounded-xl mb-4 items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
            <Ionicons name="person" size={40} color="white" />
          </View>
          <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {contact.name}
          </Text>
          {contact.roles.um_student && (
            <Text className={`mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Student</Text>
          )}
          {contact.roles.um_teacher && (
            <Text className={`mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Teacher</Text>
          )}
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
          <View className="mb-4">
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</Text>
            <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{contact.phone}</Text>
          </View>
          <View className="mb-4">
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</Text>
            <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{contact.email}</Text>
          </View>
          <View className="mb-4">
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Blood Type</Text>
            <Text className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{contact.blood_type}</Text>
          </View>
          {contact.linkedin && (
            <TouchableOpacity 
              onPress={() => Linking.openURL(contact.linkedin)}
              className="flex-row items-center mb-4"
            >
              <Ionicons name="logo-linkedin" size={20} color={isDarkMode ? '#fff' : '#0077b5'} />
              <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>LinkedIn Profile</Text>
            </TouchableOpacity>
          )}
          {contact.facebook && (
            <TouchableOpacity 
              onPress={() => Linking.openURL(contact.facebook)}
              className="flex-row items-center"
            >
              <Ionicons name="logo-facebook" size={20} color={isDarkMode ? '#fff' : '#1877f2'} />
              <Text className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Facebook Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
