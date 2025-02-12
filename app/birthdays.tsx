import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Contact } from '@/types/contact';
import { getStoredContacts } from '@/utils/storage';
import { getDaysUntilBirthday } from '@/utils/dateUtils';
import Header from '@/components/Header';
import BirthdayTile from '@/components/birthday/BirthdayTile';

const SectionHeader = ({ title, isDarkMode }: { title: string; isDarkMode: boolean }) => (
  <Text className={`text-xl font-bold mb-3 mt-5 px-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
    {title}
  </Text>
);

export default function Birthdays() {
  const { isDarkMode } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadAndSortContacts();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadAndSortContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allContacts = await getStoredContacts();

      if (!Array.isArray(allContacts)) {
        throw new Error('Contacts data is not an array');
      }

      const contactsWithBirthdays = allContacts.filter(
        contact => contact?.birthday?.split('/').length === 2
      );

      contactsWithBirthdays.sort((a, b) => {
        const daysA = getDaysUntilBirthday(a.birthday!) ?? Infinity;
        const daysB = getDaysUntilBirthday(b.birthday!) ?? Infinity;
        return daysA - daysB;
      });

      setContacts(contactsWithBirthdays);
    } catch (err: any) {
      console.error('Error loading contacts:', err);
      setError('Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const groupBirthdays = useCallback(() => {
    const groups: { [key: string]: Contact[] } = {
      today: [],
      thisWeek: [],
      thisMonth: [],
      later: [],
    };

    contacts.forEach(contact => {
      if (!contact.birthday) return;

      const days = getDaysUntilBirthday(contact.birthday);

      if (days === 0) {
        groups.today.push(contact);
      } else if (days && days <= 7) {
        groups.thisWeek.push(contact);
      } else if (days && days <= 30) {
        groups.thisMonth.push(contact);
      } else if (days) {
        groups.later.push(contact);
      }
    });

    return groups;
  }, [contacts]);

  const birthdayGroups = groupBirthdays();

  const renderItem: ListRenderItem<Contact> = useCallback(
    ({ item }) => <BirthdayTile contact={item} />,
    []
  );

  const renderSection = (groupName: string, contacts: Contact[]) => {
    if (contacts.length === 0) {
      return null;
    }

    let title = '';
    switch (groupName) {
      case 'today':
        title = '🎉 Today';
        break;
      case 'thisWeek':
        title = '📅 This Week';
        break;
      case 'thisMonth':
        title = '🗓️ This Month';
        break;
      case 'later':
        title = '⏳ Coming Up';
        break;
      default:
        title = 'Upcoming';
        break;
    }

    return (
      <View>
        <SectionHeader title={title} isDarkMode={isDarkMode} />
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={item => item.email}
          scrollEnabled={false}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="Birthdays" showBack />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="Birthdays" showBack />
        <View className="flex-1 justify-center items-center p-4">
          <Text className={`text-lg text-center ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  if (contacts.length === 0) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="Birthdays" showBack />
        <View className="flex-1 justify-center items-center p-4">
          <Text className={`text-lg text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
            No birthdays found. Ensure your contacts have birthdays saved in DD/MM format.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Birthdays" showBack />
      <Animated.View 
        className="flex-1 px-4 pt-2" 
        style={{ opacity: fadeAnim }}
      >
        <FlatList
          data={[
            { title: 'today', data: birthdayGroups.today },
            { title: 'thisWeek', data: birthdayGroups.thisWeek },
            { title: 'thisMonth', data: birthdayGroups.thisMonth },
            { title: 'later', data: birthdayGroups.later },
          ]}
          keyExtractor={item => item.title}
          renderItem={({ item }) => renderSection(item.title, item.data)}
          ListFooterComponent={<View className="h-20" />}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
}
