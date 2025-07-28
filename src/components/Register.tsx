import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../utils/colors';
import {url} from '../utils/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useTranslation} from 'react-i18next';

type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register = ({navigation}: RegisterProps) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();
  const isFormValid =
    name.length >= 3 && email.length >= 9 && password.length >= 6;

  const handleSubmit = async () => {
    const userData = {
      name,
      email,
      password,
      isDoctor,
    };
    if (isFormValid) {
      setIsLoading(true);
      try {
        const response = await fetch(`${url}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (data.success) {
          Alert.alert('Registration successfull!!!');
          navigation.navigate('Login');
        } else {
          Alert.alert('Registration failed!!!');
        }
      } catch (error) {
        console.error('Error registering user:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Please fill all the fields');
    }
  };

  // useEffect(() => {
  //   if (username.length >= 3 && password.length >= 6) {
  //     setAgree(true);
  //   }
  // }, [username, password]);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#EAF6FB', '#B3D8F7']}
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoRow}>
            <Ionicons name="person-add-outline" size={72} color={colors.primary} style={styles.logoIcon} accessibilityLabel={t('Register.logoAlt')} />
          </View>
          <View style={styles.cardContainer}>
            <Text style={styles.mainHeader}>{t('Register.title')}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.labels}>{t('Register.text1')}</Text>
              <TextInput
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={text => setName(text)}
                placeholder={t('Register.text1')}
                placeholderTextColor="#aaa"
                accessibilityLabel={t('Register.text1')}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labels}>{t('Register.text2')}</Text>
              <TextInput
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={text => setEmail(text)}
                placeholder={t('Register.text2')}
                placeholderTextColor="#aaa"
                accessibilityLabel={t('Register.text2')}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labels}>{t('Register.text3')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  placeholder={t('Register.text3')}
                  placeholderTextColor="#aaa"
                  accessibilityLabel={t('Register.text3')}
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
            <View style={[styles.inputContainer, styles.switchRow]}>
              <Text style={styles.labels}>Are you a doctor?</Text>
              <Switch
                value={isDoctor}
                onValueChange={setIsDoctor}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={isDoctor ? '#ffffff' : '#f4f3f4'}
                accessibilityLabel={t('Register.doctorSwitch')}
              />
            </View>
            <TouchableOpacity
              style={[styles.buttonStyle, {backgroundColor: isFormValid ? colors.primary : 'grey'}]}
              disabled={!isFormValid || isLoading}
              onPress={handleSubmit}
              accessible
              accessibilityLabel={t('Register.btn1')}>
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>{t('Register.btn1')}</Text>
              )}
            </TouchableOpacity>
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>
            <TouchableOpacity
              style={[styles.buttonStyle, styles.loginButton]}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>{t('Register.btn2')}</Text>
            </TouchableOpacity>
          </View>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  flexGrow: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    minHeight: '100%',
    paddingTop: 40,
    paddingBottom: 40,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
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
  loginButton: {
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

export default Register;
