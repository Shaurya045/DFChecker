import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageDropdown = () => {
  const {t, i18n} = useTranslation();
  const [visible, setVisible] = useState(false);

  // Supported languages with RTL support indication
  const languages = [
    {code: 'en', name: 'English', isRTL: false},
    {code: 'ar', name: 'العربية', isRTL: true},
  ];

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const changeLanguage = async (languageCode: string) => {
    try {
      // Change language in i18next
      await i18n.changeLanguage(languageCode);

      // Save to AsyncStorage
      await AsyncStorage.setItem('user-language', languageCode);

      // Handle RTL if needed
      const selectedLanguage = languages.find(
        lang => lang.code === languageCode,
      );
      if (selectedLanguage) {
        I18nManager.forceRTL(selectedLanguage.isRTL);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setVisible(false);
    }
  };

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            {languages.map(item => (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.item,
                  i18n.language === item.code && styles.selectedItem,
                  item.isRTL && {flexDirection: 'row-reverse'},
                ]}
                onPress={() => changeLanguage(item.code)}>
                <Text style={styles.itemText}>{item.name}</Text>
                {i18n.language === item.code && (
                  <Icon name="check" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const currentLanguage =
    languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.buttonText}>{currentLanguage.name}</Text>
        <Icon
          name={visible ? 'arrow-drop-up' : 'arrow-drop-down'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {renderDropdown()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  buttonText: {
    marginRight: 8,
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    maxHeight: '60%',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
  },
});

export default LanguageDropdown;
