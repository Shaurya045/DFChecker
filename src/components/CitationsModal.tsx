import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from '../utils/colors';
import { formatCitationsForDisplay } from '../utils/citations';
import { useTranslation } from 'react-i18next';
import { wp, hp } from '../utils/responsive';

interface CitationsModalProps {
  isVisible: boolean;
  onClose: () => void;
  category: string; // Category of medical information being cited
}

const CitationsModal = ({ isVisible, onClose, category }: CitationsModalProps) => {
  const { t, i18n } = useTranslation();
  const citations = formatCitationsForDisplay(category);
  
  const handleOpenLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Cannot open URL: ${url}`);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{t('Citations.title')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.citationList}>
            <Text style={styles.explanationText}>
              {t('Citations.explanation')}
            </Text>
            
            {citations.map((citation: {title: string, description: string, url: string}, index: number) => (
              <View key={index} style={styles.citationItem}>
                <Text style={styles.citationTitle}>{citation.title}</Text>
                <Text style={styles.citationDescription}>{citation.description}</Text>
                <TouchableOpacity 
                  style={[styles.linkButton, citation.title === "IWGDF Guidelines 2023" && styles.primarySourceButton]}
                  onPress={() => handleOpenLink(citation.url)}>
                  <Text style={[styles.linkText, citation.title === "IWGDF Guidelines 2023" && styles.primarySourceText]}>
                  {citation.title === "IWGDF Guidelines 2023" ? 
                    (i18n.language === 'ar' ? "عرض المصدر الرئيسي" : "View Primary Source") : 
                    t('Citations.viewSource')}
                </Text>
                  <Icon name="link" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t('Citations.disclaimer')}
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    height: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeButton: {
    padding: 5,
  },
  citationList: {
    flex: 1,
  },
  explanationText: {
    fontSize: wp(4),
    marginBottom: 20,
    lineHeight: 22,
  },
  citationItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  citationTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  citationDescription: {
    fontSize: wp(3.5),
    marginBottom: 10,
    color: '#555',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    marginRight: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  primarySourceButton: {
    backgroundColor: colors.primary + '20', // Primary color with 20% opacity
    borderWidth: 1,
    borderColor: colors.primary,
  },
  primarySourceText: {
    fontWeight: '700',
  },
  footer: {
    marginTop: 20,
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  footerText: {
    fontSize: wp(3.5),
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
});

export default CitationsModal;
