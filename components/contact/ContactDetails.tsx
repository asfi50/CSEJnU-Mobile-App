import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Contact } from '@/types/contact';
import { DetailItem, SocialLink } from './DetailComponents';
import { formatBirthday } from "@/utils/dateUtils";

interface ContactDetailsProps {
  contact: Contact;
}

export default function ContactDetails({ contact }: ContactDetailsProps) {
  const { isDarkMode } = useTheme();

  return (
    <View className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Basic Info Section */}
      <View className="mb-6">
        <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Basic Information
        </Text>
        <DetailItem label="Phone" value={contact.phone} />
        <DetailItem label="Email" value={contact.email} />
        <DetailItem label="Blood Type" value={contact.blood_type} />
        <DetailItem
          label="Birthday"
          value={
            contact.birthday
              ? formatBirthday(contact.birthday.split('/').reverse().join('/'))
              : ''
          }
        />
        <DetailItem label="Gender" value={contact.gender?.join(', ')} />
      </View>

      {/* Academic Info Section */}
      <View className="mb-6">
        <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Academic Information
        </Text>
        <DetailItem label="Student ID" value={contact.student_id} />
        <DetailItem label="Batch" value={contact.batch} />
        <DetailItem 
          label="CR" 
          value={Array.isArray(contact.cr) && contact.cr.includes("Yes") ? "Yes" : "No"} 
        />
        <DetailItem 
          label="Graduated" 
          value={Array.isArray(contact.graduated) && contact.graduated.includes("Yes") ? "Yes" : "No"} 
        />
        <DetailItem label="Job Description" value={contact.job_description} />
      </View>

      {/* Social Links Section */}
      <View>
        <Text className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Social Links
        </Text>
        <View className="flex-row gap-4">
        {contact.linkedin && (
                <SocialLink 
                  icon="logo-linkedin" 
                  label="LinkedIn"
                  color={isDarkMode ? '#fff' : '#0077b5'}
                  onPress={() => Linking.openURL(contact.linkedin!)}
                />
              )}
              {contact.facebook && (
                <SocialLink 
                  icon="logo-facebook" 
                  label="Facebook"
                  color={isDarkMode ? '#fff' : '#1877f2'}
                  onPress={() => Linking.openURL(contact.facebook!)}
                />
              )}
              {contact.twitter && (
                <SocialLink 
                  icon="logo-twitter" 
                  label="Twitter"
                  color={isDarkMode ? '#fff' : '#1DA1F2'}
                  onPress={() => Linking.openURL(contact.twitter!)}
                />
              )}
              {contact.telegram && (
                <SocialLink 
                  icon="paper-plane" 
                  label="Telegram"
                  color={isDarkMode ? '#fff' : '#0088cc'}
                  onPress={() => Linking.openURL(contact.telegram!)}
                />
              )}
              {contact.github && (
                <SocialLink 
                  icon="logo-github" 
                  label="GitHub"
                  color={isDarkMode ? '#fff' : '#333'}
                  onPress={() => Linking.openURL(contact.github!)}
                />
              )}
              {contact.website && (
                <SocialLink 
                  icon="globe" 
                  label="Website"
                  color={isDarkMode ? '#fff' : '#4a5568'}
                  onPress={() => Linking.openURL(contact.website!)}
                />
              )}
        </View>
      </View>
    </View>
  );
}
