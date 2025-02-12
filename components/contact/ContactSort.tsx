import { TouchableOpacity, Text, Modal, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { ContactSortOptions, SortOption } from '@/types/contact';

interface ContactSortProps {
  options: ContactSortOptions;
  onOptionsChange: (options: ContactSortOptions) => void;
}

export default function ContactSort({ options, onOptionsChange }: ContactSortProps) {
  const { isDarkMode } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Batch', value: 'batch' },
  ];

  const handleSort = (field: SortOption) => {
    const ascending = field === options.field ? !options.ascending : true;
    onOptionsChange({ field, ascending });
    setIsModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className={`h-10 px-3 rounded-lg flex-row items-center justify-center border
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        `}
      >
        <Ionicons 
          name={options.ascending ? "arrow-up" : "arrow-down"} 
          size={16} 
          color={isDarkMode ? '#fff' : '#666'} 
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50"
          activeOpacity={1} 
          onPress={() => setIsModalVisible(false)}
        >
          <View className={`absolute top-16 right-4 w-48 rounded-lg shadow-lg
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            {sortOptions.map((sort) => (
              <TouchableOpacity
                key={sort.value}
                onPress={() => handleSort(sort.value)}
                className={`flex-row items-center px-4 py-3 border-b
                  ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}
                  ${options.field === sort.value ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}
                `}
              >
                <Text className={`flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {sort.label}
                </Text>
                {options.field === sort.value && (
                  <Ionicons 
                    name={options.ascending ? "arrow-up" : "arrow-down"}
                    size={16}
                    color={isDarkMode ? '#fff' : '#666'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
