import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ContactFilterOptions } from '@/types/contact';

interface ContactFilterProps {
  options: ContactFilterOptions;
  onOptionsChange: (options: ContactFilterOptions) => void;
  availableOptions: {
    batches: string[];
    genders: string[];
    bloodTypes: string[];
  };
}

export default function ContactFilter({ options, onOptionsChange, availableOptions }: ContactFilterProps) {
  const { isDarkMode } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempOptions, setTempOptions] = useState(options);

  const applyFilters = () => {
    onOptionsChange(tempOptions);
    setIsModalVisible(false);
  };

  const resetFilters = () => {
    const resetOptions: ContactFilterOptions = {
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
    };
    setTempOptions(resetOptions);
    onOptionsChange(resetOptions);
    setIsModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity 
        onPress={() => setIsModalVisible(true)}
        className={`h-9 px-3 rounded-lg flex-row items-center justify-center
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border
        `}
      >
        <Ionicons name="options" size={16} color={isDarkMode ? '#fff' : '#666'} />
        {(Object.values(options.roles).some(v => v) || options.batch || 
         options.gender?.length || options.blood_type?.length) && (
          <View className="w-2 h-2 bg-blue-500 rounded-full absolute -top-1 -right-1" />
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className={`flex-1 ${isDarkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'}`}>
          <View className="flex-1 mt-16">
            <View className="px-4 py-2 flex-row justify-between items-center border-b border-gray-700">
              <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Filter Contacts
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4">
              {/* Roles Section */}
              <View className="mb-6">
                <Text className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Roles & Status
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  <TouchableOpacity
                    onPress={() => setTempOptions(prev => ({
                      ...prev,
                      roles: { ...prev.roles, students: !prev.roles.students }
                    }))}
                    className={`px-3 py-1 rounded-full ${
                      tempOptions.roles.students
                        ? 'bg-blue-500'
                        : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`}
                  >
                    <Text className={tempOptions.roles.students ? 'text-white' : 
                      (isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                      Students
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setTempOptions(prev => ({
                      ...prev,
                      roles: { ...prev.roles, teachers: !prev.roles.teachers }
                    }))}
                    className={`px-3 py-1 rounded-full ${
                      tempOptions.roles.teachers
                        ? 'bg-green-500'
                        : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`}
                  >
                    <Text className={tempOptions.roles.teachers ? 'text-white' : 
                      (isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                      Teachers
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setTempOptions(prev => ({
                      ...prev,
                      roles: { ...prev.roles, graduated: !prev.roles.graduated }
                    }))}
                    className={`px-3 py-1 rounded-full ${
                      tempOptions.roles.graduated
                        ? 'bg-purple-500'
                        : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`}
                  >
                    <Text className={tempOptions.roles.graduated ? 'text-white' : 
                      (isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                      Graduated
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setTempOptions(prev => ({
                      ...prev,
                      roles: { ...prev.roles, cr: !prev.roles.cr }
                    }))}
                    className={`px-3 py-1 rounded-full ${
                      tempOptions.roles.cr
                        ? 'bg-yellow-500'
                        : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`}
                  >
                    <Text className={tempOptions.roles.cr ? 'text-white' : 
                      (isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                      CR
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Batch */}
              {availableOptions.batches.length > 0 && (
                <View className="mb-6">
                  <Text className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Batch
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {availableOptions.batches.map(batch => (
                      <TouchableOpacity
                        key={batch}
                        onPress={() => setTempOptions(prev => ({
                          ...prev,
                          batch: prev.batch === batch ? undefined : batch
                        }))}
                        className={`px-3 py-1 rounded-full ${
                          tempOptions.batch === batch
                            ? (isDarkMode ? 'bg-green-500' : 'bg-green-500')
                            : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                        }`}
                      >
                        <Text className={tempOptions.batch === batch ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                          {batch}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Gender */}
              {availableOptions.genders.length > 0 && (
                <View className="mb-6">
                  <Text className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Gender
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {availableOptions.genders.map(gender => (
                      <TouchableOpacity
                        key={gender}
                        onPress={() => {
                          setTempOptions(prev => ({
                            ...prev,
                            gender: prev.gender?.includes(gender)
                              ? prev.gender.filter(g => g !== gender)
                              : [...(prev.gender || []), gender]
                          }));
                        }}
                        className={`px-3 py-1 rounded-full ${
                          tempOptions.gender?.includes(gender)
                            ? (isDarkMode ? 'bg-purple-500' : 'bg-purple-500')
                            : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                        }`}
                      >
                        <Text className={tempOptions.gender?.includes(gender) ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Blood Type */}
              {availableOptions.bloodTypes.length > 0 && (
                <View className="mb-6">
                  <Text className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Blood Type
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {availableOptions.bloodTypes.map(blood => (
                      <TouchableOpacity
                        key={blood}
                        onPress={() => {
                          setTempOptions(prev => ({
                            ...prev,
                            blood_type: prev.blood_type?.includes(blood)
                              ? prev.blood_type.filter(b => b !== blood)
                              : [...(prev.blood_type || []), blood]
                          }));
                        }}
                        className={`px-3 py-1 rounded-full ${
                          tempOptions.blood_type?.includes(blood)
                            ? (isDarkMode ? 'bg-red-500' : 'bg-red-500')
                            : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                        }`}
                      >
                        <Text className={tempOptions.blood_type?.includes(blood) ? 'text-white' : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                          {blood}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View className="p-4 flex-row justify-between gap-4 border-t border-gray-700">
              <TouchableOpacity
                onPress={resetFilters}
                className={`flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                <Text className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                className="flex-1 p-3 rounded-lg bg-blue-500"
              >
                <Text className="text-center text-white">
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
