import { View, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Contact } from '@/types/contact';

export default function SocialIcons({ contact }: { contact: Contact }) {
  const { isDarkMode } = useTheme();
  
  const socialLinks = [
    { key: 'linkedin', icon: 'logo-linkedin', url: contact.linkedin, color: '#0077b5' },
    { key: 'facebook', icon: 'logo-facebook', url: contact.facebook, color: '#1877f2' },
    { key: 'twitter', icon: 'logo-twitter', url: contact.twitter, color: '#1DA1F2' },
    { key: 'telegram', icon: 'paper-plane', url: contact.telegram, color: '#0088cc' },
    { key: 'github', icon: 'logo-github', url: contact.github, color: '#333' },
    { key: 'website', icon: 'globe', url: contact.website, color: '#4a5568' }
  ];

  return (
    <View className="flex-row justify-center flex-wrap gap-4 mt-4">
      {socialLinks.map(({ key, icon, url, color }) => 
        url ? (
          <TouchableOpacity
            key={key}
            onPress={() => Linking.openURL(url)}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={isDarkMode ? '#fff' : color} 
            />
          </TouchableOpacity>
        ) : null
      )}
    </View>
  );
}
