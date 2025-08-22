import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { requestTrackingPermission, getTrackingStatus } from '../utils/trackingPermission';
import { colors } from '../utils/colors';

const TrackingPermissionTest = () => {
  const [status, setStatus] = useState<string>('Not checked');
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const currentStatus = await getTrackingStatus();
      setStatus(currentStatus);
      Alert.alert('Current Status', `Tracking permission status: ${currentStatus}`);
    } catch (error) {
      setStatus('Error');
      Alert.alert('Error', 'Failed to get tracking status');
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = async () => {
    setLoading(true);
    try {
      const result = await requestTrackingPermission();
      setStatus(result ? 'authorized' : 'denied');
      Alert.alert(
        'Permission Result',
        `Tracking permission ${result ? 'granted' : 'denied'}`
      );
    } catch (error) {
      setStatus('Error');
      Alert.alert('Error', 'Failed to request tracking permission');
    } finally {
      setLoading(false);
    }
  };

  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>App Tracking Transparency Test</Text>
        <Text style={styles.subtitle}>This feature is only available on iOS</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Tracking Transparency Test</Text>
      <Text style={styles.status}>Current Status: {status}</Text>
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={checkStatus}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Checking...' : 'Check Current Status'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.requestButton, loading && styles.buttonDisabled]}
        onPress={requestPermission}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Requesting...' : 'Request Permission'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        This test component helps verify that App Tracking Transparency is working correctly.
        The permission request should appear as a system dialog on iOS.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  status: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  requestButton: {
    backgroundColor: colors.secondary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 18,
  },
});

export default TrackingPermissionTest;


