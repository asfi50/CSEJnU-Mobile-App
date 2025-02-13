import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Contact } from '@/types/contact';
import { getStoredContacts } from '@/utils/storage';
import { getDaysUntilBirthday } from '@/utils/dateUtils';
import Header from '@/components/Header';
import BirthdayTile from '@/components/birthday/BirthdayTile';

interface GroupedBirthdays {
  thisWeek: Contact[];
  thisMonth: Contact[];
  upcoming: Contact[];
}

export default function Birthdays() {
  const { isDarkMode } = useTheme();
  const [groupedContacts, setGroupedContacts] = useState<GroupedBirthdays>({
    thisWeek: [],
    thisMonth: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAndGroupContacts();
  }, []);

  const loadAndGroupContacts = async () => {
    try {
      setLoading(true);
      const contacts = await getStoredContacts();
      
      // Filter and sort contacts by upcoming birthdays
      const validContacts = contacts
        .filter(c => c.birthday)
        .sort((a, b) => {
          const daysA = getDaysUntilBirthday(a.birthday!) ?? Infinity;
          const daysB = getDaysUntilBirthday(b.birthday!) ?? Infinity;
          return daysA - daysB;
        });

      // Group contacts
      const grouped = validContacts.reduce((acc: GroupedBirthdays, contact) => {
        const daysUntil = getDaysUntilBirthday(contact.birthday!);
        if (daysUntil === null) return acc;

        if (daysUntil <= 7) {
          acc.thisWeek.push(contact);
        } else if (daysUntil <= 30) {
          acc.thisMonth.push(contact);
        } else {
          acc.upcoming.push(contact);
        }
        return acc;
      }, { thisWeek: [], thisMonth: [], upcoming: [] });

      setGroupedContacts(grouped);
    } catch (err) {
      setError('Failed to load contacts.');
    } finally {
      setLoading(false);
    }
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

  const renderSection = (title: string, contacts: Contact[], emoji: string) => {
    if (contacts.length === 0) return null;

    return (
      <View className="mb-6">
        <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {emoji} {title}
        </Text>
        {contacts.map(contact => (
          <BirthdayTile key={contact.email} contact={contact} />
        ))}
      </View>
    );
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title="Birthdays" showBack />
      <ScrollView className="flex-1 px-4">
        {renderSection('This Week', groupedContacts.thisWeek, '🎉')}
        {renderSection('This Month', groupedContacts.thisMonth, '📅')}
        {renderSection('Upcoming', groupedContacts.upcoming, '📆')}
        
        {Object.values(groupedContacts).every(group => group.length === 0) && (
          <View className="flex-1 justify-center items-center py-20">
            <Text className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No birthdays found. Add birthdays to your contacts to see them here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
