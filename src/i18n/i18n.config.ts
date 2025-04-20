import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en, ar} from './translations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languageResources = {
  en: {translation: en},
  ar: {translation: ar},
};

// Language detector configuration
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    const storedLanguage = await AsyncStorage.getItem('user-language');
    callback(storedLanguage || 'en');
  },
  init: () => {},
  cacheUserLanguage: async language => {
    await AsyncStorage.setItem('user-language', language);
  },
};

i18next.use(languageDetector).use(initReactI18next).init({
  // debug: true,
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  resources: languageResources,
});

export default i18next;
