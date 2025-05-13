import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {colors} from '../utils/colors';
import {url} from '../utils/constants';
import {useAuth} from '../AuthContext';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../App';
import {useTranslation} from 'react-i18next';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: LoginProps) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const isFormValid = email.length >= 9 && password.length >= 6;
  const {login} = useAuth();

  const {t, i18n} = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        const response = await fetch(`${url}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email, password}),
        });

        const data = await response.json();

        if (data.success) {
          await login(data.token);
          Alert.alert(t('Login success'));
        } else {
          Alert.alert(t('Login.error'), t('Login.loginFailed'));
        }
      } catch (error) {
        console.error('Error Logging in:', error);
        Alert.alert(t('Login.error'), t('Login.tryAgain'));
      }
    } else {
      Alert.alert(t('Login.error'), t('Login.fillAllFields'));
    }
  };

  return (
    <SafeAreaView style={[styles.mainContainer, isRTL && styles.rtlContainer]}>
      {/* Back Button - Fixed position and direction */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Welcome')}
        accessible
        accessibilityLabel={t('Login.goBack')}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      
      <View style={[styles.contentContainer, isRTL && styles.rtlContentContainer]}>
        <Text style={styles.mainHeader}>{t('Login.title')}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.labels}>{t('Login.text1')}</Text>
          <TextInput
            style={[styles.inputStyle, isRTL && styles.rtlInput]}
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labels}>{t('Login.text2')}</Text>
          <TextInput
            style={[styles.inputStyle, isRTL && styles.rtlInput]}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.buttonStyle,
            {backgroundColor: isFormValid ? colors.primary : 'grey'},
            {marginTop: 50},
          ]}
          disabled={!isFormValid}
          onPress={handleSubmit}
          accessible
          accessibilityLabel={t('Login.loginButton')}>
          <Text style={styles.buttonText}>{t('Login.btn1')}</Text>
        </TouchableOpacity>
        <Text style={[styles.description, {marginTop: 20}]}>
          {t('Login.text3')}
        </Text>
        <TouchableOpacity
          style={[styles.buttonStyle, {backgroundColor: colors.primary}]}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>{t('Login.btn2')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#fff',
  },
  rtlContainer: {
    direction: 'rtl',
  },
  contentContainer: {
    paddingHorizontal: 30,
  },
  rtlContentContainer: {
    direction: 'rtl',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20, // Always on the left
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    fontSize: 35,
    color: colors.primary,
    fontWeight: '900',
  },
  mainHeader: {
    fontSize: 30,
    color: '#344055',
    fontWeight: '500',
    paddingBottom: 15,
    textAlign: 'center',
    fontFamily: 'bold',
    writingDirection: 'auto',
  },
  description: {
    fontSize: 20,
    color: '#7d7d7d',
    paddingBottom: 20,
    lineHeight: 25,
    fontFamily: 'regular',
    textAlign: 'center',
    writingDirection: 'auto',
  },
  inputContainer: {
    marginTop: 20,
  },
  labels: {
    fontSize: 18,
    color: '#7d7d7d',
    marginTop: 10,
    marginBottom: 5,
    lineHeight: 25,
    fontFamily: 'regular',
    textAlign: 'left', // Will be overridden by writingDirection
    writingDirection: 'auto',
  },
  inputStyle: {
    borderWidth: 1,
    color: 'black',
    borderColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    fontFamily: 'regular',
    fontSize: 18,
    textAlign: 'left', // Default, will be overridden by component prop
    writingDirection: 'auto',
  },
  rtlInput: {
    textAlign: 'right',
  },
  buttonStyle: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 5,
    textAlign: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    writingDirection: 'auto',
  },
});

export default LoginScreen;