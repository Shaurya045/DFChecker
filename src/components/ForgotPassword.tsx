import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ActivityIndicator } from 'react-native';
import { colors } from '../utils/colors';
import { url } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const ForgotPasswordModal = ({ visible, onClose, onSuccess }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert(t('ForgotPassword.error'), t('ForgotPassword.enterEmail') || 'Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${url}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert(t('ForgotPassword.success'), t('ForgotPassword.otpSent') || 'OTP sent to your email.');
        setEmail('');
        onSuccess(email);
      } else {
        Alert.alert(t('ForgotPassword.error'), data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      Alert.alert(t('ForgotPassword.error'), t('ForgotPassword.tryAgain') || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, isRTL && styles.rtlContainer]}>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, isRTL ? styles.closeButtonRTL : styles.closeButtonLTR]} accessibilityLabel={t('ForgotPassword.close')}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <View style={styles.iconRow}>
            <Ionicons name="mail-open-outline" size={48} color={colors.primary} style={styles.icon} accessibilityLabel={t('ForgotPassword.iconAlt')} />
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.mainHeader}>{t('ForgotPassword.title') || 'Forgot Password'}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.labels}>{t('ForgotPassword.email') || 'Email'}</Text>
            <TextInput
              style={[styles.inputStyle, isRTL && styles.rtlInput]}
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              textAlign={isRTL ? 'right' : 'left'}
              keyboardType="email-address"
              placeholder={t('ForgotPassword.emailPlaceholder') || 'Enter your email'}
              placeholderTextColor="#aaa"
              accessibilityLabel={t('ForgotPassword.emailInputAlt')}
            />
            <Text style={styles.helperText}>{t('ForgotPassword.helperText') || 'We will send a reset link to your email.'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.buttonStyle, { backgroundColor: email ? colors.primary : colors.gray, marginTop: 30, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 }]}
            disabled={!email || loading}
            onPress={handleSendOTP}
            accessibilityLabel={t('ForgotPassword.sendOTP')}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>{t('ForgotPassword.sendOTP') || 'Send OTP'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  rtlContainer: {
    direction: 'rtl',
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    zIndex: 10,
    padding: 8,
  },
  closeButtonLTR: {
    right: 16,
  },
  closeButtonRTL: {
    left: 16,
  },
  closeButtonText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: 'bold',
  },
  mainHeader: {
    fontSize: 24,
    color: '#344055',
    fontWeight: '700',
    textAlign: 'left',
    fontFamily: 'bold',
    flex: 1,
  },
  inputContainer: {
    marginTop: 10,
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

export default ForgotPasswordModal; 