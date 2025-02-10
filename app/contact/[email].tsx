import { View, ScrollView, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Contact } from '@/types/contact';
import { getStoredContacts } from '@/utils/storage';
import ProfileCard from '@/components/contact/ProfileCard';
import QuickActions from '@/components/contact/QuickActions';
import ContactDetails from '@/components/contact/ContactDetails';

export default function ContactDetail() {
  const { email } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const contacts = await getStoredContacts();
        const decodedEmail = decodeURIComponent(email as string);
        const foundContact = contacts.find(c => c.email === decodedEmail);
        setContact(foundContact || null);
      } catch (err) {
        console.error('Error loading contact:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [email]);

  if (loading || !contact) {
    return (
      <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header showBack title={loading ? "Loading..." : "Not Found"} />
        <View className="p-4">
          <Text className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {loading ? "Loading..." : "Contact not found"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header showBack title={contact.name} />
      <ScrollView>
        <View className="p-4">
          <ProfileCard contact={contact} />
          <QuickActions phone={contact.phone || ''} email={contact.email || ''} />
          <ContactDetails contact={contact} />
        </View>
      </ScrollView>
    </View>
  );
}
