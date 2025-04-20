import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {colors} from '../utils/colors';
import {useTranslation} from 'react-i18next';
import LanguageDropdown from './LanguageDropdown';

type WelcomeProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({navigation}: WelcomeProps) => {
  const submit = () => {
    navigation.navigate('Login');
  };
  const {t} = useTranslation();
  // const changeLanguage = () => {
  //   if (i18n.language === 'en') {
  //     i18n.changeLanguage('ar');
  //   } else {
  //     i18n.changeLanguage('en');
  //   }
  // };
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.mainText}>DFChecker</Text> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}>
        <Text style={{fontSize: 22, fontWeight: 'bold', color: colors.primary}}>
          {t('Welcome.text1')}
        </Text>
        <LanguageDropdown />
      </View>
      <Image
        source={require('../assets/dfcheckerImage.png')}
        style={styles.image}
      />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.primary}]}
        onPress={submit}>
        <Text style={styles.loginText}>{t('Welcome.login')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 250,
    width: 200,
  },
  mainText: {
    fontSize: 40,
    fontFamily: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderRadius: 98,
  },
  loginText: {
    padding: 6,
    color: colors.white,
    fontSize: 20,
    fontFamily: 'semibold',
  },
});

export default WelcomeScreen;
