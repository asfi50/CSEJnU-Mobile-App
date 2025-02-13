import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { useTheme } from "@/context/ThemeContext";
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface FilterOptions {
  search: string;
  selectedCategories: number[];
  selectedTags: number[];
  selectedAuthors: number[];
  dateFrom?: Date;
  dateTo?: Date;
}

interface BlogFilterProps {
  options: FilterOptions;
  onOptionsChange: (options: FilterOptions) => void;
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
  authors: Array<{ id: number; name: string }>;
}

export default function BlogFilter({ options, onOptionsChange, categories, tags, authors }: BlogFilterProps) {
  const { isDarkMode } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempOptions, setTempOptions] = useState(options);

  const applyFilters = () => {
    onOptionsChange(tempOptions);
    setIsModalVisible(false);
  };

  const resetFilters = () => {
    const resetOptions = {
      search: '',
      selectedCategories: [],
      selectedTags: [],
      selectedAuthors: [],
      dateFrom: undefined,
      dateTo: undefined
    };
    setTempOptions(resetOptions);
    onOptionsChange(resetOptions);
    setIsModalVisible(false);
  };

  return (
    <View>
      {/* Search Bar with immediate local filtering */}
      <View className="px-4 py-2">
        <View className={`flex-row items-center p-2 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Ionicons name="search" size={20} color={isDarkMode ? '#666' : '#999'} />
          <TextInput
            className={`flex-1 ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            placeholder="Search posts..."
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            value={options.search}
            onChangeText={(text) => onOptionsChange({ ...options, search: text })}
          />
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Ionicons 
              name="options" 
              size={20} 
              color={isDarkMode ? '#666' : '#999'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className={`flex-1 ${isDarkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'}`}>
          <View className="flex-1 mt-16">
            <View className="px-4 py-2 flex-row justify-between items-center">
              <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Filters
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4">
              {/* Categories */}
              <View className="mb-6">
                <Text className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Categories
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => {
                        const isSelected = tempOptions.selectedCategories.includes(category.id);
                        setTempOptions(prev => ({
                          ...prev,
                          selectedCategories: isSelected
                            ? prev.selectedCategories.filter(id => id !== category.id)
                            : [...prev.selectedCategories, category.id]
                        }));
                      }}
                      className={`px-3 py-1 rounded-full ${
                        tempOptions.selectedCategories.includes(category.id)
                          ? (isDarkMode ? 'bg-blue-500' : 'bg-blue-500')
                          : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                      }`}
                    >
                      <Text className={tempOptions.selectedCategories.includes(category.id)
                        ? 'text-white'
                        : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tags (similar to Categories) */}
              <View className="mb-6">
                <Text className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tags
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {tags.map(tag => (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => {
                        const isSelected = tempOptions.selectedTags.includes(tag.id);
                        setTempOptions(prev => ({
                          ...prev,
                          selectedTags: isSelected
                            ? prev.selectedTags.filter(id => id !== tag.id)
                            : [...prev.selectedTags, tag.id]
                        }));
                      }}
                      className={`px-3 py-1 rounded-full ${
                        tempOptions.selectedTags.includes(tag.id)
                          ? (isDarkMode ? 'bg-green-500' : 'bg-green-500')
                          : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                      }`}
                    >
                      <Text className={tempOptions.selectedTags.includes(tag.id)
                        ? 'text-white'
                        : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }>
                        #{tag.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Authors */}
              <View className="mb-6">
                <Text className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Authors
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {authors.map(author => (
                    <TouchableOpacity
                      key={author.id}
                      onPress={() => {
                        const isSelected = tempOptions.selectedAuthors.includes(author.id);
                        setTempOptions(prev => ({
                          ...prev,
                          selectedAuthors: isSelected
                            ? prev.selectedAuthors.filter(id => id !== author.id)
                            : [...prev.selectedAuthors, author.id]
                        }));
                      }}
                      className={`px-3 py-1 rounded-full ${
                        tempOptions.selectedAuthors.includes(author.id)
                          ? (isDarkMode ? 'bg-purple-500' : 'bg-purple-500')
                          : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                      }`}
                    >
                      <Text className={tempOptions.selectedAuthors.includes(author.id)
                        ? 'text-white'
                        : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                      }>
                        {author.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="p-4 flex-row justify-between gap-4">
              <TouchableOpacity
                onPress={resetFilters}
                className={`flex-1 p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              >
                <Text className={`text-center ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
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
