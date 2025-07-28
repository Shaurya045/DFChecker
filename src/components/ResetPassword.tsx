import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { colors } from '../utils/colors';
import { url } from '../utils/constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type ResetPasswordProps = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

const ResetPassword = ({ navigation, route }: ResetPasswordProps) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert(t('ResetPassword.error'), t('ResetPassword.fillAllFields') || 'Please fill all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t('ResetPassword.error'), t('ResetPassword.passwordsDontMatch') || 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${url}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert(t('ResetPassword.success'), t('ResetPassword.passwordReset') || 'Password reset successful.');
        navigation.navigate('Login');
      } else {
        Alert.alert(t('ResetPassword.error'), data.message || 'Failed to reset password.');
      }
    } catch (error) {
      Alert.alert(t('ResetPassword.error'), t('ResetPassword.tryAgain') || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={() => navigation.goBack()}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, isRTL && styles.rtlContainer]}>
          <View style={styles.iconRow}>
            <Ionicons name="shield-checkmark-outline" size={48} color={colors.primary} style={styles.icon} accessibilityLabel={t('ResetPassword.iconAlt')} />
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel={t('ResetPassword.close')}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={[styles.contentContainer, isRTL && styles.rtlContentContainer]}>
            <Text style={styles.mainHeader}>{t('ResetPassword.title') || 'Reset Password'}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.labels}>{t('ResetPassword.otp') || 'OTP'}</Text>
              <TextInput
                style={[styles.inputStyle, isRTL && styles.rtlInput]}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                textAlign={isRTL ? 'right' : 'left'}
                placeholder={t('ResetPassword.otpPlaceholder') || 'Enter OTP'}
                placeholderTextColor="#aaa"
                accessibilityLabel={t('ResetPassword.otpInputAlt')}
              />
              <Text style={styles.helperText}>{t('ResetPassword.helperText') || 'Enter the OTP sent to your email.'}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labels}>{t('ResetPassword.newPassword') || 'New Password'}</Text>
              <View style={styles.inputWrapper}> 
                <TextInput
                  style={[styles.inputStyle, isRTL && styles.rtlInput]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  textAlign={isRTL ? 'right' : 'left'}
                  placeholder={t('ResetPassword.newPasswordPlaceholder') || 'Enter new password'}
                  placeholderTextColor="#aaa"
                  accessibilityLabel={t('ResetPassword.newPasswordInputAlt')}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(v => !v)}
                  style={styles.eyeIconInside}
                  accessibilityLabel={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labels}>{t('ResetPassword.confirmPassword') || 'Confirm New Password'}</Text>
              <View style={styles.inputWrapper}> 
                <TextInput
                  style={[styles.inputStyle, isRTL && styles.rtlInput]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  textAlign={isRTL ? 'right' : 'left'}
                  placeholder={t('ResetPassword.confirmPasswordPlaceholder') || 'Confirm new password'}
                  placeholderTextColor="#aaa"
                  accessibilityLabel={t('ResetPassword.confirmPasswordInputAlt')}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(v => !v)}
                  style={styles.eyeIconInside}
                  accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.buttonStyle, { backgroundColor: otp && newPassword && confirmPassword ? colors.primary : colors.gray, marginTop: 40, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 }]}
              disabled={!otp || !newPassword || !confirmPassword || loading}
              onPress={handleResetPassword}
              accessibilityLabel={t('ResetPassword.resetPassword')}
            >
              <Text style={styles.buttonText}>{loading ? t('ResetPassword.reseting') || 'Resetting...' : t('ResetPassword.resetPassword') || 'Reset Password'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    alignItems: 'stretch',
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginBottom: 4,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  rtlContentContainer: {
    direction: 'rtl',
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '900',
  },
  mainHeader: {
    fontSize: 24,
    color: '#344055',
    fontWeight: '700',
    paddingBottom: 15,
    textAlign: 'center',
    fontFamily: 'bold',
    writingDirection: 'auto',
  },
  inputContainer: {
    marginTop: 20,
  },
  labels: {
    fontSize: 16,
    color: '#7d7d7d',
    marginTop: 10,
    marginBottom: 5,
    lineHeight: 22,
    fontFamily: 'regular',
    textAlign: 'left',
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
    fontSize: 16,
    textAlign: 'left',
    writingDirection: 'auto',
    backgroundColor: '#f7f7f7',
  },
  rtlInput: {
    textAlign: 'right',
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
  buttonStyle: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    marginBottom: 2,
    textAlign: 'left',
    writingDirection: 'auto',
  },
});

export default ResetPassword; 