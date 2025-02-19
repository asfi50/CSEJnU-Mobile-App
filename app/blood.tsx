import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Contact } from '@/types/contact';
import BloodSearch from '@/components/blood/BloodSearch';
import BloodDonorCard from '@/components/blood/BloodDonorCard';
import { contactService } from '@/services/contact.service';
import { getStoredContacts, saveContacts, shouldRefetchContacts } from '@/utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Blood() {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonors, setSelectedDonors] = useState<string[]>([]);
  const [donors, setDonors] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [bloodGroupSelections, setBloodGroupSelections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadDonors();
  }, []);

  const handleBloodGroupSelection = (bloodType: string) => {
    const isCurrentlySelected = bloodGroupSelections[bloodType];
    setBloodGroupSelections(prev => ({
      ...prev,
      [bloodType]: !isCurrentlySelected
    }));

    // Get all donors of this blood type
    const donorsOfType = donors.filter(donor => donor.blood_type === bloodType);
    const emailsOfType = donorsOfType.map(donor => donor.email);

    if (!isCurrentlySelected) {
      // Select all donors of this blood type that aren't already selected
      setSelectedDonors(prev => [...new Set([...prev, ...emailsOfType])]);
    } else {
      // Unselect all donors of this blood type
      setSelectedDonors(prev => prev.filter(email => !emailsOfType.includes(email)));
    }
  };

  const getUniqueBloodTypes = () => {
    return [...new Set(donors.filter(donor => donor.blood_type).map(donor => donor.blood_type))];
  };

  const loadDonors = async () => {
    try {
      // Try to get contacts from storage first
      const storedContacts = await getStoredContacts();
      if (storedContacts.length > 0) {
        const bloodDonors = storedContacts.filter(contact => contact.blood_type);
        setDonors(bloodDonors);
        const shouldRefetch = await shouldRefetchContacts();
        if (!shouldRefetch) {
          setLoading(false);
          return;
        }
      }

      // If not in storage or needs refresh, fetch from API
      const fetchedContacts = await contactService.getContacts();
      const bloodDonors = fetchedContacts.filter(contact => contact.blood_type);
      setDonors(bloodDonors);
      // Store in async storage
      await saveContacts(fetchedContacts);
    } catch (error) {
      console.error('Error loading donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleDonorSelection = (email: string) => {
    setSelectedDonors(prev =>
      prev.includes(email)
        ? prev.filter(id => id !== email)
        : [...prev, email]
    );
  };

  const handleBulkSMS = () => {
    const selectedDonorsList = donors.filter(donor => selectedDonors.includes(donor.email));
    if (selectedDonorsList.length > 0) {
      const phones = selectedDonorsList.map(donor => donor.phone).filter(Boolean).join(',');
      const bloodType = selectedDonorsList[0].blood_type;
      const message = `Hi, I am looking for ${bloodType} blood. Please contact me if you can help.`;
      if (phones) {
        Linking.openURL(`sms:${phones}?body=${encodeURIComponent(message)}`);
      }
    }
  };

  // Randomize donors order on initial load
  useEffect(() => {
    if (!loading && donors.length > 0) {
      const shuffledDonors = [...donors].sort(() => Math.random() - 0.5);
      setDonors(shuffledDonors);
    }
  }, [loading]);

  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.blood_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Text className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading donors...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="p-4">
        <BloodSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onClear={handleClearSearch}
        />

        <View className="flex-row flex-wrap gap-2 mt-4">
          {getUniqueBloodTypes().map(bloodType => (
            <TouchableOpacity
              key={bloodType}
              onPress={() => handleBloodGroupSelection(bloodType || '')}
              className={`px-4 py-2 rounded-lg flex-row items-center
                ${bloodGroupSelections[bloodType || '']
                  ? (isDarkMode ? 'bg-red-600' : 'bg-red-500')
                  : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')} border`}
            >
              <Text className={bloodGroupSelections[bloodType || ''] ? 'text-white' : 
                (isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                {bloodType}
              </Text>
              <View className="w-5 h-5 ml-2 rounded-full border items-center justify-center
                ${bloodGroupSelections[bloodType] ? 'border-white' : 
                  (isDarkMode ? 'border-gray-600' : 'border-gray-400')}">
                <Text className={`text-xs ${bloodGroupSelections[bloodType || ''] ? 'text-white' : 
                  (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}>
                  {donors.filter(d => d.blood_type === bloodType).length}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {filteredDonors.map(donor => (
          <BloodDonorCard
            key={donor.email}
            donor={donor}
            isSelected={selectedDonors.includes(donor.email)}
            onSelect={() => toggleDonorSelection(donor.email)}
          />
        ))}
        {filteredDonors.length === 0 && (
          <Text className={`text-center mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No blood donors found
          </Text>
        )}
      </ScrollView>

      {selectedDonors.length > 0 && (
        <View className="p-4">
          <TouchableOpacity
            onPress={handleBulkSMS}
            className={`px-6 py-3 rounded-full flex-row items-center justify-center
              ${isDarkMode ? 'bg-red-600' : 'bg-red-500'}`}
          >
            <Ionicons name="chatbox-outline" size={20} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-semibold">
              Send Bulk SMS ({selectedDonors.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}