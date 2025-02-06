import { View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '@/context/ThemeContext';

interface LightboxImageProps {
  isVisible: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function LightboxImage({ isVisible, imageUrl, onClose }: LightboxImageProps) {
  const { isDarkMode } = useTheme();
  const { width, height } = Dimensions.get('window');

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.9}
      style={{ margin: 0 }}
    >
      <TouchableOpacity 
        onPress={onClose}
        className="flex-1 items-center justify-center"
      >
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-auto"
          style={{ aspectRatio: 1 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Modal>
  );
}
