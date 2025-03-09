import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../utils/constants';
import Icon from 'react-native-vector-icons/AntDesign';
import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';

// Navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type ReportProps = NativeStackScreenProps<RootStackParamList, 'Report'>;

const ReportScreen = ({ navigation }: ReportProps) => {
  const [loading, setLoading] = useState(true);
  const [allReports, setAllReports] = useState<any[]>([]); // Store all reports
  const [selectedReport, setSelectedReport] = useState<any>(null); // Store the selected report
  const [result, setResult] = useState<{ left: string | null, right: string | null }>({ left: null, right: null });

  // Fetch all reports
  const getReport = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${url}/getallreports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.data.results.length > 0) {
        setAllReports(data.data.results); // Store all reports
        setSelectedReport(data.data.results[0]); // Set the latest report as default
        checkReport(data.data.results[0]); // Check and set result for the latest report
      } else {
        console.error('Failed to fetch reports:', data.message);
        setAllReports([]); // Reset reports if no data is available
        setSelectedReport(null); // Reset selected report
        setResult({ left: null, right: null }); // Reset result
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setAllReports([]); // Reset reports on error
      setSelectedReport(null); // Reset selected report
      setResult({ left: null, right: null }); // Reset result
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  // Check report and set result
  const checkReport = (report: any) => {
    if (report && report.left_foot && report.right_foot) {
      const categoryL = report.left_foot.risk_category || '';
      const categoryR = report.right_foot.risk_category || '';

      const getSimplifiedResult = (category: string) => {
        switch (category) {
          case 'Very Low Risk - Category 0':
            return 'Very Low Risk';
          case 'Low Risk - Category 1':
            return 'Low Risk';
          case 'Moderate Risk - Category 2':
            return 'Moderate Risk';
          case 'High Risk - Category 3':
            return 'High Risk';
          case 'Urgent Risk':
            return 'Urgent Risk';
          case 'Healthy Foot - Need Self Care':
            return 'Healthy Foot - Need Self Care';
          default:
            return null;
        }
      };

      setResult({
        left: getSimplifiedResult(categoryL),
        right: getSimplifiedResult(categoryR),
      });
    } else {
      setResult({ left: null, right: null }); // Reset result if report is invalid
    }
  };

  // Request notification permissions
  async function requestPermissions() {
    const settings = await notifee.requestPermission();
    if (!settings.authorizationStatus) {
      console.log('User denied notifications');
    }
  }

  // Create notification channel
  async function createNotificationChannel() {
    await notifee.createChannel({
      id: 'test-retest',
      name: 'Test Retake Reminders',
      importance: AndroidImportance.HIGH,
    });
  }

  // Schedule notification
  async function scheduleNotification(duration: number) {
    const durationInMilliseconds = duration * 24 * 60 * 60 * 1000;

    if (duration > 7) {
      // Schedule notification 7 days before the screening frequency
      const notificationTime = Date.now() + durationInMilliseconds - (7 * 24 * 60 * 60 * 1000);
      await notifee.createTriggerNotification(
        {
          title: 'Retake Your Test',
          body: 'Your next screening is due in 7 days. Time to retake your test for better results!',
          android: {
            channelId: 'test-retest',
            pressAction: {
              id: 'test-retest',
              launchActivity: 'default',
            },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: notificationTime,
        },
      );
    } else {
      // Schedule daily notifications if screening frequency is less than 7 days
      for (let i = 1; i <= 7; i++) {
        const notificationTime = Date.now() + i * 24 * 60 * 60 * 1000; // Schedule for the next 7 days
        await notifee.createTriggerNotification(
          {
            title: 'Retake Your Test',
            body: 'Your screening is due soon. Time to retake your test for better results!',
            android: {
              channelId: 'test-retest',
              pressAction: {
                id: 'test-retest',
                launchActivity: 'default',
              },
            },
          },
          {
            type: TriggerType.TIMESTAMP,
            timestamp: notificationTime,
          },
        );
      }
    }
  }

  // Handle test submission and schedule notifications
  const handleTestSubmission = (report: any) => {
    if (!report || !report.left_foot || !report.right_foot) {
      console.error('Invalid report data');
      return;
    }

    let freqLeft = report.left_foot.screening_frequency || '';
    let freqRight = report.right_foot.screening_frequency || '';

    // Extract numbers safely
    freqLeft = freqLeft.match(/\d+/)
      ? parseInt(freqLeft.match(/\d+/)[0], 10)
      : null;
    freqRight = freqRight.match(/\d+/)
      ? parseInt(freqRight.match(/\d+/)[0], 10)
      : null;

    // Ensure both frequencies are valid numbers
    if (freqLeft === null || freqRight === null) {
      console.error('Invalid screening frequency data');
      return;
    }

    // Get the minimum frequency
    let freq = Math.min(freqLeft, freqRight);

    // Schedule notifications based on frequency
    if (freq > 0) {
      scheduleNotification(freq);
    } else {
      console.error('Invalid frequency value:', freq);
    }
  };

  useEffect(() => {
    getReport();
    requestPermissions();
    createNotificationChannel();
  }, []);

  useEffect(() => {
    if (selectedReport) {
      handleTestSubmission(selectedReport);
    }
  }, [selectedReport]);

  return (
    <SafeAreaView style={styles.container}>
      <Modal animationType="fade" transparent={false} visible={loading}>
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          <ActivityIndicator size={150} color={colors.primary} animating={loading} />
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
        <Icon name="arrowleft" size={30} />
      </TouchableOpacity>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>Assessment Report</Text>
      </View>
      <ScrollView style={{ width: '100%', marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Previous Reports:
        </Text>
        {allReports.map((report, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: colors.primary,
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
            }}
            onPress={() => {
              setSelectedReport(report); // Set the selected report
              checkReport(report); // Update result for the selected report
            }}>
            <Text style={{ color: colors.white, textAlign: 'center' }}>
              Report from {new Date(report.timestamp).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          padding: 10,
          borderRadius: 10,
          position: 'absolute',
          bottom: 20,
        }}
        onPress={() => {
          if (selectedReport) {
            navigation.replace('ReportDetail', { reportData: selectedReport, result });
          } else {
            Alert.alert('Error', 'No report selected.');
          }
        }}>
        <Text style={{ fontSize: 23, fontWeight: 600, color: colors.white, textAlign: 'center' }}>
          Click here for detailed report
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 20,
  },
  titleBox: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 35,
  },
  titleTxt: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'semibold',
    textAlign: 'center',
    padding: 8,
  },
});