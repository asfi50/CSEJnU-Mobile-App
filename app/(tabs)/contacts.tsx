import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import ContactCard from "@/components/ContactCard";
import ContactSearch from "@/components/ContactSearch";
import { AUTH_URL } from "@/config";

interface Contact {
  roles: {
    um_student?: boolean;
    um_teacher?: boolean;
  };
  name: string;
  email: string;
  phone: string;
  blood_type: string;
  linkedin: string;
  facebook: string;
}

export default function Contacts() {
  const { isDarkMode } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  const fetchContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No auth token found');

      // Debug toast for token
      Toast.show({
        type: 'info',
        text1: 'Debug: Token',
        text2: token.slice(0, 20) + '...',
        position: 'bottom',
        visibilityTime: 4000,
      });

      const response = await fetch(`${AUTH_URL}/api/contacts?token=${token}`);
      const data = await response.json();
      
      // Debug toast for response
      Toast.show({
        type: 'info',
        text1: 'Debug: Response',
        text2: JSON.stringify(data).slice(0, 50) + '...',
        position: 'bottom',
        visibilityTime: 4000,
      });

      if (!data) {
        throw new Error('Empty response received');
      }

      if (Array.isArray(data)) {
        setContacts(data);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error(`Invalid response format: ${JSON.stringify(data).slice(0, 100)}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Contacts fetch error:', err);
      
      Toast.show({
        type: 'error',
        text1: 'Error Loading Contacts',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLink = (url: string) => {
    if (url) Linking.openURL(url);
  };

  if (loading) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Text className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{error}</Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ContactSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />
      <ScrollView className="flex-1">
        <View className="p-4">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.email}
              contact={contact}
              isCompact={true}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
