import { View, Text, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Contact } from "@/types/contact";
import SocialIcons from "@/components/contact/SocialIcons";
import BirthdayCountdown from "@/components/contact/BirthdayCountdown";

interface ProfileCardProps {
  contact: Contact;
}

export default function ProfileCard({ contact }: ProfileCardProps) {
  const { isDarkMode } = useTheme();

  return (
    <View
      className={`p-6 rounded-xl mb-4 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Avatar */}
      {contact?.photo ? (
        <Image
          source={{ uri: contact.photo }}
          className="w-24 h-24 rounded-full self-center mb-4"
        />
      ) : (
        <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center self-center mb-4">
          <Text className="text-white text-4xl font-bold">
            {contact?.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <Text
        className={`text-2xl font-bold text-center mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {contact?.name}
      </Text>

      {/* Role Tags */}
      <View className="flex-row flex-wrap justify-center gap-2">
        {contact.roles.um_student && (
          <Text
            className={`px-3 py-1 rounded-full text-sm ${
              isDarkMode
                ? "bg-blue-900 text-blue-400"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            Student
          </Text>
        )}
        {contact.roles.um_teacher && (
          <Text
            className={`px-3 py-1 rounded-full text-sm ${
              isDarkMode
                ? "bg-green-900 text-green-400"
                : "bg-green-100 text-green-600"
            }`}
          >
            Teacher
          </Text>
        )}
        {Array.isArray(contact.graduated) &&
          contact.graduated.includes("Yes") && (
            <Text
              className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode
                  ? "bg-purple-900 text-purple-400"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              Alumni
            </Text>
          )}
        {Array.isArray(contact.cr) && contact.cr.includes("Yes") && (
          <Text
            className={`px-3 py-1 rounded-full text-sm ${
              isDarkMode
                ? "bg-amber-900 text-amber-400"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            CR
          </Text>
        )}
      </View>

      {contact?.job_description && (
        <Text
          className={`text-center mb-3 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {contact.job_description}
        </Text>
      )}

      {contact?.birthday && <BirthdayCountdown birthday={contact.birthday} />}

      <SocialIcons contact={contact} />
    </View>
  );
}
