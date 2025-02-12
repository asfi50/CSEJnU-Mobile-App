import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Contact } from '@/types/contact';

interface ContactCardProps {
  contact: Contact;
  isCompact?: boolean;
  isGrid?: boolean;
}

const RoleBadges = ({ contact }: { contact: Contact }) => {
  const badges = [];
  
  if (contact.roles.um_teacher) {
    badges.push(
      <View key="teacher" className="bg-blue-500/20 px-2 py-0.5 rounded-full">
        <Text className="text-blue-500 text-xs font-medium">Teacher</Text>
      </View>
    );
  }
  
  if (contact.cr?.length) {
    badges.push(
      <View key="cr" className="bg-yellow-500/20 px-2 py-0.5 rounded-full">
        <Text className="text-yellow-500 text-xs font-medium">CR</Text>
      </View>
    );
  }
  
  if (contact.graduated?.length) {
    badges.push(
      <View key="graduated" className="bg-green-500/20 px-2 py-0.5 rounded-full">
        <Text className="text-green-500 text-xs font-medium">Alumni</Text>
      </View>
    );
  }
  
  return badges.length ? (
    <View className="flex-row gap-1 flex-wrap mt-1">
      {badges}
    </View>
  ) : null;
};

export default function ContactCard({ contact, isCompact = false, isGrid = false }: ContactCardProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/contact/[email]',
      params: { email: encodeURIComponent(contact.email) }
    });
  };

  const AvatarComponent = () => (
    contact.photo ? (
      <Image 
        source={{ uri: contact.photo }} 
        className="w-10 h-10 rounded-full"
      />
    ) : (
      <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center">
        <Text className="text-white text-lg font-bold">
          {contact.name.charAt(0).toUpperCase()}
        </Text>
      </View>
    )
  );

  if (isGrid) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className={`
          w-[48%] m-1 p-4 rounded-xl items-center justify-center
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm
        `}
      >
        <View className="w-16 h-16 mb-2">
          {contact.photo ? (
            <Image 
              source={{ uri: contact.photo }} 
              className="w-full h-full rounded-full"
            />
          ) : (
            <View className="w-full h-full bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-white text-xl font-bold">
                {contact.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text 
          numberOfLines={1} 
          className={`text-center font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          {contact.name}
        </Text>
        <Text 
          numberOfLines={1}
          className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {contact.email}
        </Text>
        <RoleBadges contact={contact} />
      </TouchableOpacity>
    );
  }

  if (isCompact) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className={`p-3 mb-2 rounded-xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}
      >
        <View className="flex-row items-center">
          <View className="mr-3">
            <AvatarComponent />
          </View>
          <View className="flex-1">
            <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {contact.name}
            </Text>
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {contact.email}
            </Text>
            <RoleBadges contact={contact} />
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDarkMode ? '#fff' : '#666'} 
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`p-4 mb-3 rounded-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}
    >
      <View className="flex-row items-center mb-2">
        <AvatarComponent />
        <View className="ml-3">
          <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {contact.name}
          </Text>
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {contact.email}
          </Text>
          {contact.phone && (
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {contact.phone}
            </Text>
          )}
        </View>
      </View>
      {/* Rest of the existing contact card layout */}
    </TouchableOpacity>
  );
}
