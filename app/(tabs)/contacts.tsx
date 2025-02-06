import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Linking } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import ContactCard from "@/components/ContactCard";
import ContactSearch from "@/components/ContactSearch";
import { AUTH_URL } from "@/config";
import { Contact } from "@/types/contact";
import { saveContacts, getStoredContacts, shouldRefetchContacts } from "@/utils/storage";

export default function Contacts() {
  const { isDarkMode } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [attemptedServerFetch, setAttemptedServerFetch] = useState(false);

  const fetchContacts = async (forceRefresh = false) => {
    try {
      // If not forced refresh, try to load from storage first
      if (!forceRefresh) {
        const storedContacts = await getStoredContacts();
        if (storedContacts.length > 0) {
          setContacts(storedContacts);
          const shouldRefetch = await shouldRefetchContacts();
          if (!shouldRefetch) {
            setLoading(false);
            return;
          }
        }
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No auth token found');

      setAttemptedServerFetch(true);
      const response = await fetch(`${AUTH_URL}/api/contacts?token=${token}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setContacts(data);
        await saveContacts(data);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error(`Invalid response format: ${JSON.stringify(data).slice(0, 100)}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Contacts fetch error:', err);
      
      // Only show toast if it's not the initial load of empty contacts
      if (attemptedServerFetch) {
        Toast.show({
          type: 'error',
          text1: 'Error Loading Contacts',
          text2: errorMessage,
          position: 'top',
          visibilityTime: 4000,
        });
      }

      // Try stored contacts as fallback
      const storedContacts = await getStoredContacts();
      if (storedContacts.length > 0) {
        setContacts(storedContacts);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchContacts(true);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.phone?.includes(searchQuery) || '') ||
      (contact.student_id?.includes(searchQuery) || '')
    );
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

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

  if (!loading && contacts.length === 0) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ContactSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDarkMode ? '#fff' : '#000'}
            />
          }
        >
          <View className="flex-1 justify-center items-center p-8">
            <Text className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No contacts found
            </Text>
            <Text className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Pull down to refresh and try again
            </Text>
          </View>
        </ScrollView>
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
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDarkMode ? '#fff' : '#000'}
          />
        }
      >
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
