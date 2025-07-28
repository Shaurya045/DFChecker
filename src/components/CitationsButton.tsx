import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';
import CitationsModal from './CitationsModal';
import { wp } from '../utils/responsive';

interface CitationsButtonProps {
  category: string; // Category of medical information to show citations for
  style?: object; // Optional additional styles
  isDoctor?: boolean; // Whether the user is a doctor - citations won't be shown if true
}

const CitationsButton = ({ category, style, isDoctor = false }: CitationsButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t, i18n } = useTranslation();
  
  // If isDoctor is true, don't render the citations button
  if (isDoctor) {
    return null;
  }
  
  // Reference to IWGDF Guidelines explicitly with proper translation
  const buttonText = category === 'assessment' ? 
    t('Citations.buttonLabel') + (i18n.language === 'ar' ? ' (إرشادات IWGDF)' : ' (IWGDF Guidelines)') : 
    t('Citations.buttonLabel');

  const handleOpenCitations = () => {
    setIsModalVisible(true);
  };

  const handleCloseCitations = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.container, style]} 
        onPress={handleOpenCitations}
        accessibilityLabel="View medical sources"
        accessibilityHint="Opens a modal with medical citations for the information in this section">
        <Icon name="medicinebox" size={14} color={colors.primary} />
        <Text style={styles.text}>{buttonText}</Text>
      </TouchableOpacity>

      <CitationsModal
        isVisible={isModalVisible}
        onClose={handleCloseCitations}
        category={category}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e6f2ff', // Lighter blue background
    borderWidth: 1,
    borderColor: '#bfdbfe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  text: {
    color: colors.primary,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default CitationsButton;
