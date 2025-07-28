import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {colors} from '../utils/colors';
import {url} from '../utils/constants';
import {useAuth} from '../AuthContext';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../App';
import {useTranslation} from 'react-i18next';
import ForgotPasswordModal from './ForgotPassword';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: LoginProps) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const isFormValid = email.length >= 5 && password.length >= 5;
  const {login} = useAuth();

  const {t, i18n} = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Detect if device is an iPad
  const { width, height } = Dimensions.get('window');
  const isIpad = Platform.OS === 'ios' && Math.min(width, height) >= 768;

  const handleSubmit = async () => {
    if (isFormValid) {
      setIsLoading(true);
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
          await login(data.token, data.isDoctor || false);
          Alert.alert(t('Login success'));
        } else {
          Alert.alert(t('Login Failed'), t('Check for id and password'));
        }
      } catch (error) {
        console.error('Error Logging in:', error);
        Alert.alert(t('Login.error'), t('Login.tryAgain'));
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(t('Login.error'), t('Login.fillAllFields'));
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#EAF6FB', '#B3D8F7']}
      style={styles.gradientContainer}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={[styles.mainContainer, isRTL && styles.rtlContainer]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Welcome')}
          accessible
          accessibilityLabel={t('Login.goBack')}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <KeyboardAvoidingView
          style={styles.flexGrow}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={40}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoRow}>
              <Ionicons name="person-circle-outline" size={72} color={colors.primary} style={styles.logoIcon} accessibilityLabel={t('Login.logoAlt')} />
            </View>
            <View style={styles.cardContainer}>
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
                  placeholder={t('Login.text1')}
                  placeholderTextColor="#aaa"
                  accessibilityLabel={t('Login.text1')}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.labels}>{t('Login.text2')}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.inputStyle, isRTL && styles.rtlInput]}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    textAlign={isRTL ? 'right' : 'left'}
                    placeholder={t('Login.text2')}
                    placeholderTextColor="#aaa"
                    accessibilityLabel={t('Login.text2')}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  {(passwordFocused || password.length > 0) && (
                    <TouchableOpacity
                      onPress={() => setShowPassword(v => !v)}
                      style={styles.eyeIconInside}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={[styles.buttonStyle, {backgroundColor: isFormValid ? colors.primary : colors.gray}]}
                disabled={!isFormValid || isLoading}
                onPress={handleSubmit}
                accessible
                accessibilityLabel={t('Login.loginButton')}>
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.buttonText}>{t('Login.btn1')}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginTop: 15, alignSelf: 'center'}}
                onPress={() => setForgotModalVisible(true)}>
                <Text style={{color: colors.primary, fontSize: 16}}>{t('Login.forgotPassword') || 'Forgot Password?'}</Text>
              </TouchableOpacity>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.divider} />
              </View>
              <TouchableOpacity
                style={[styles.buttonStyle, styles.registerButton]}
                onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonText}>{t('Login.btn2')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <ForgotPasswordModal
          visible={forgotModalVisible}
          onClose={() => setForgotModalVisible(false)}
          onSuccess={email => {
            setForgotModalVisible(false);
            setForgotEmail(email);
            navigation.navigate('ResetPassword', { email });
          }}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
  },
  flexGrow: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    minHeight: '100%',
    paddingTop: 60,
    paddingBottom: 40,
    width: '100%',
  },
  logoRow: {
    marginTop: 0,
    marginBottom: 10,
    alignItems: 'center',
  },
  logoIcon: {
    marginBottom: 8,
  },
  cardContainer: {
    width: '92%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'stretch',
    marginBottom: 24,
  },
  mainHeader: {
    fontSize: 28,
    color: '#344055',
    fontWeight: '700',
    paddingBottom: 18,
    textAlign: 'center',
    fontFamily: 'bold',
    writingDirection: 'auto',
  },
  inputContainer: {
    marginTop: 16,
  },
  labels: {
    fontSize: 16,
    color: '#7d7d7d',
    marginTop: 6,
    marginBottom: 4,
    lineHeight: 22,
    fontFamily: 'regular',
    textAlign: 'left',
    writingDirection: 'auto',
  },
  inputStyle: {
    borderWidth: 1,
    color: 'black',
    borderColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    fontFamily: 'regular',
    fontSize: 16,
    textAlign: 'left',
    writingDirection: 'auto',
    backgroundColor: '#f7f7f7',
  },
  rtlInput: {
    textAlign: 'right',
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  registerButton: {
    marginTop: 18,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    writingDirection: 'auto',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontWeight: '600',
    fontSize: 15,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    fontSize: 35,
    color: colors.primary,
    fontWeight: '900',
  },
  rtlContainer: {
    direction: 'rtl',
  },
  contentContainer: {
    display: 'none', // Hide the old content container
  },
  rtlContentContainer: {
    display: 'none',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIconInside: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 5,
    zIndex: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default LoginScreen;