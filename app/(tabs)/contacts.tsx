import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Linking } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import ContactCard from "@/components/contact/ContactCard";
import ContactSearch from "@/components/contact/ContactSearch";
import { AUTH_URL } from "@/config";
import { Contact } from "@/types/contact";
import { saveContacts, getStoredContacts, shouldRefetchContacts } from "@/utils/storage";
import ContactFilter from "@/components/contact/ContactFilter";
import { ContactFilterOptions } from "@/types/contact";
import { getUniqueBatches, getUniqueGenders, getUniqueBloodTypes } from "@/utils/contactUtils";
import ViewToggle from '@/components/contact/ViewToggle';
import ContactSort from "@/components/contact/ContactSort";
import { ContactSortOptions } from "@/types/contact";
import { contactService } from '@/services/contact.service';

export default function Contacts() {
  const { isDarkMode } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [attemptedServerFetch, setAttemptedServerFetch] = useState(false);
  const [filterOptions, setFilterOptions] = useState<ContactFilterOptions>({
    search: '',
    roles: {
      students: false,
      teachers: false,
      graduated: false,
      cr: false,
    },
    batch: undefined,
    gender: undefined,
    blood_type: undefined,
  });

  const [availableFilterOptions, setAvailableFilterOptions] = useState({
    batches: [] as string[],
    genders: [] as string[],
    bloodTypes: [] as string[],
  });

  const [isGridView, setIsGridView] = useState(false);
  const [sortOptions, setSortOptions] = useState<ContactSortOptions>({
    field: 'name',
    ascending: true
  });

  useEffect(() => {
    AsyncStorage.getItem('contactsViewPreference')
      .then(value => setIsGridView(value === 'grid'));
  }, []);

  const toggleView = () => {
    const newValue = !isGridView;
    setIsGridView(newValue);
    AsyncStorage.setItem('contactsViewPreference', newValue ? 'grid' : 'list');
  };

  const fetchContacts = async (forceRefresh = false) => {
    try {
      // If not forced refresh, try to load from storage first
      if (!forceRefresh) {
        const storedContacts = await getStoredContacts();
        if (storedContacts.length > 0) {
          storedContacts.sort((a, b) => a.name.localeCompare(b.name));
          setContacts(storedContacts);
          const shouldRefetch = await shouldRefetchContacts();
          if (!shouldRefetch) {
            setLoading(false);
            return;
          }
        }
      }

      setAttemptedServerFetch(true);
      const data:any = await contactService.getContacts();

      if (Array.isArray(data)) {
        data.sort((a, b) => a.name.localeCompare(b.name));
        setContacts(data);
        await saveContacts(data);
      } else if (data.error) {
        throw new Error(data.error);
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
    const filtered = contacts.filter(contact => {
      // Search filter
      const searchMatch = 
        contact.name.toLowerCase().includes(filterOptions.search.toLowerCase()) ||
        contact.email.toLowerCase().includes(filterOptions.search.toLowerCase()) ||
        (contact.phone?.includes(filterOptions.search) || '') ||
        (contact.student_id?.includes(filterOptions.search) || '');
      if (!searchMatch) return false;

      // Roles filter
      if (filterOptions.roles.students && !contact.roles.um_student) return false;
      if (filterOptions.roles.teachers && !contact.roles.um_teacher) return false;
      if (filterOptions.roles.graduated && !contact.graduated?.length) return false;
      if (filterOptions.roles.cr && !contact.cr?.length) return false;

      // Batch filter
      if (filterOptions.batch && contact.batch !== filterOptions.batch) return false;

      // Gender filter
      if (filterOptions.gender?.length && !filterOptions.gender.some(g => contact.gender?.includes(g))) return false;

      // Blood type filter
      if (filterOptions.blood_type?.length && !filterOptions.blood_type.includes(contact.blood_type || '')) return false;

      return true;
    });
    setFilteredContacts(filtered);
  }, [filterOptions, contacts]);

  useEffect(() => {
    setAvailableFilterOptions({
      batches: getUniqueBatches(contacts),
      genders: getUniqueGenders(contacts),
      bloodTypes: getUniqueBloodTypes(contacts),
    });
  }, [contacts]);

  useEffect(() => {
    const sorted = [...filteredContacts].sort((a, b) => {
      if (sortOptions.field === 'batch') {
        const aBatch = parseInt(a.batch || '0') || 0;
        const bBatch = parseInt(b.batch || '0') || 0;
        return sortOptions.ascending ? aBatch - bBatch : bBatch - aBatch;
      }
      const aValue = String(a[sortOptions.field] || '');
      const bValue = String(b[sortOptions.field] || '');
      const comparison = aValue.localeCompare(bValue);
      return sortOptions.ascending ? comparison : -comparison;
    });
    setFilteredContacts(sorted);
  }, [sortOptions]);

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
          searchQuery={filterOptions.search}
          onSearchChange={(search) => setFilterOptions(prev => ({ ...prev, search }))}
          onClear={() => setFilterOptions(prev => ({ ...prev, search: '' }))}
        />
        <ContactFilter
          options={filterOptions}
          onOptionsChange={setFilterOptions}
          availableOptions={availableFilterOptions}
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
      <View className="px-4 py-2 gap-2 border-b border-gray-800">
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <ContactSearch
              searchQuery={filterOptions.search}
              onSearchChange={(search) => setFilterOptions(prev => ({ ...prev, search }))}
              onClear={() => setFilterOptions(prev => ({ ...prev, search: '' }))}
            />
          </View>
          <ContactSort 
            options={sortOptions} 
            onOptionsChange={setSortOptions} 
          />
          <ContactFilter
            options={filterOptions}
            onOptionsChange={setFilterOptions}
            availableOptions={availableFilterOptions}
          />
          <ViewToggle isGrid={isGridView} onToggle={toggleView} />
        </View>
      </View>

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
        <View className={`p-2 ${isGridView ? 'flex-row flex-wrap justify-between' : ''}`}>
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.email}
              contact={contact}
              isCompact={!isGridView}
              isGrid={isGridView}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
