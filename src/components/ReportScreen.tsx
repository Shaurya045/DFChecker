import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  SafeAreaView,
} from 'react-native';
import {colors} from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {url} from '../utils/constants';
import Icon from 'react-native-vector-icons/AntDesign';
import notifee, {AndroidImportance, TriggerType} from '@notifee/react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import {useTranslation} from 'react-i18next';

type ReportProps = NativeStackScreenProps<RootStackParamList, 'Report'>;

const recommendations = [
  {
    id: 'High Risk',
    text: 'Refer to podiatry clinic or treating physician',
  },
  {
    id: 'Healthy Foot - Need Self Care',
    text: 'Daily inspection of feet.',
  },
  {
    id: 'Healthy Foot - Need Self Care',
    text: 'Trimming toenails straight.',
  },
  {
    id: 'Healthy Foot - Need Self Care',
    text: 'Well-fitting footwear.',
  },
  {
    id: 'Very Low Risk',
    text: 'Daily inspection of feet.',
  },
  {
    id: 'Very Low Risk',
    text: 'Appropriate foot and nail care.',
  },
  {
    id: 'Very Low Risk',
    text: 'Well-fitting footwear.',
  },
  {
    id: 'Very Low Risk',
    text: 'Trimming toenails straight.',
  },
  {
    id: 'Very Low Risk',
    text: 'Don’t remove any calluses by yourself.',
  },
  {
    id: 'Very Low Risk',
    text: 'Seek medical care if you notice scaly peeling or cracked skin between toes.',
  },
  {
    id: 'Low Risk',
    text: 'Daily inspection of feet.',
  },
  {
    id: 'Low Risk',
    text: 'Appropriate foot and nail care.',
  },
  {
    id: 'Low Risk',
    text: 'Well-fitting footwear.',
  },
  {
    id: 'Low Risk',
    text: 'Trimming toenails straight.',
  },
  {
    id: 'Low Risk',
    text: 'Don’t remove any calluses by yourself.',
  },
  {
    id: 'Low Risk',
    text: 'Seek medical care if you notice scaly peeling or cracked skin between toes.',
  },
  {
    id: 'Low Risk',
    text: 'Reduce weight if high BMI, stop smoking, control diabetes and hypertension if present.',
  },
  {
    id: 'Low Risk',
    text: 'Seek rehab specialist to provide fitness plan for feet.',
  },
  {
    id: 'Moderate Risk',
    text: 'Well-fitting orthopaedic footwear and medical socks.',
  },
  {
    id: 'Moderate Risk',
    text: 'Don’t remove any calluses by yourself.',
  },
  {
    id: 'Moderate Risk',
    text: 'Seek medical care if you notice scaly peeling or cracked skin between toes.',
  },
  {
    id: 'Moderate Risk',
    text: 'Reduce weight if high BMI, stop smoking, control diabetes and hypertension if present.',
  },
  {
    id: 'Moderate Risk',
    text: 'Seek rehab specialist to provide fitness plan for feet.',
  },
  {
    id: 'Moderate Risk',
    text: 'Seek blood vessels care consultation.',
  },
  {
    id: 'Moderate Risk',
    text: 'Seek a rehab specialist for consultation on fitness exercises for feet.',
  },
  {
    id: 'Urgent Risk',
    text: 'Seek immediate medical attention from a podiatrist or physician.',
  },
  {
    id: 'Urgent Risk',
    text: 'Avoid walking or putting pressure on the affected foot.',
  },
  {
    id: 'Urgent Risk',
    text: 'Keep the foot clean and dry to prevent infection.',
  },
  {
    id: 'Urgent Risk',
    text: 'Do not attempt home treatments such as cutting calluses or draining wounds.',
  },
  {
    id: 'Urgent Risk',
    text: 'Visit an emergency care center if pain, swelling, or signs of infection (redness, pus, fever) occur.',
  },
];

const ReportScreen = ({navigation}: ReportProps) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [result, setResult] = useState({left: null, right: null});
  const {t} = useTranslation();

  const getReport = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return null;
      }

      const response = await fetch(`${url}/getreport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setReportData(data.data.result);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        console.error('Failed to fetch report:', data.message);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const checkreport = () => {
    if (reportData) {
      handleTestSubmission();
      const categoryL = reportData.left_foot.risk_category;
      const categoryR = reportData.right_foot.risk_category;

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
    }
  };

  async function requestPermissions() {
    const settings = await notifee.requestPermission();
    if (!settings.authorizationStatus) {
      console.log('User denied notifications');
    }
  }

  async function createNotificationChannel() {
    await notifee.createChannel({
      id: 'test-retest',
      name: 'Test Retake Reminders',
      importance: AndroidImportance.HIGH,
    });
  }

  async function scheduleNotification(duration: number) {
    const delay = duration * 1000; // Convert seconds to milliseconds

    if (duration >= 7 * 24 * 60 * 60) {
      // If duration is 7 days or more, schedule notification 7 days before
      const notificationTime =
        Date.now() + (duration - 7 * 24 * 60 * 60) * 1000;
      await notifee.createTriggerNotification(
        {
          title: 'Retake Your Test',
          body: 'Time to retake your test for better results!',
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
      // If duration is less than 7 days, schedule daily notifications
      const dailyNotificationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
      await notifee.createTriggerNotification(
        {
          title: 'Retake Your Test',
          body: 'Time to retake your test for better results!',
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
          timestamp: dailyNotificationTime,
          repeatFrequency: 1, // Repeat daily
        },
      );
    }
  }

  const handleTestSubmission = () => {
    let freqLeft = reportData.left_foot.screening_frequency;
    let freqRight = reportData.right_foot.screening_frequency;

    freqLeft = freqLeft.match(/\d+/)
      ? parseInt(freqLeft.match(/\d+/)[0], 10)
      : null;
    freqRight = freqRight.match(/\d+/)
      ? parseInt(freqRight.match(/\d+/)[0], 10)
      : null;

    if (freqLeft === null || freqRight === null) {
      console.error('Invalid screening frequency data');
      return;
    }

    let freq = Math.min(freqLeft, freqRight);
    if (freq > 0) {
      scheduleNotification(freq * 1000 * 60 * 60 * 24);
    } else {
      console.error('Invalid frequency value:', freq);
    }
  };

  const generatePDF = async () => {
    try {
      if (!reportData) {
        Alert.alert('Error', 'No report data available to generate PDF.');
        return;
      }

      const htmlContent = `
        <h1>Report Detail</h1>
        <h2>Pre-screening Assessment</h2>
        <p>Do you have peripheral neurological disease? ${
          reportData?.basic_questions?.neurologicalDisease ? 'Yes' : 'No'
        }</p>
        <p>Have you had any amputations? ${
          reportData?.basic_questions?.amputation ? 'Yes' : 'No'
        }</p>
        <p>How many amputations have you had? ${
          reportData?.basic_questions?.amputationCount || 'N/A'
        }</p>
        <p>Are you currently smoking? ${
          reportData?.basic_questions?.smoking ? 'Yes' : 'No'
        }</p>
        <p>Do you have any ulcers on your feet? ${
          reportData?.basic_questions?.ulcer ? 'Yes' : 'No'
        }</p>
        
        <h2>Left Foot Report</h2>
        <p>Risk Category: ${reportData?.left_foot?.risk_category || 'N/A'}</p>
        <p>Criteria: ${reportData?.left_foot?.criteria || 'N/A'}</p>
        <p>Clinical Indicator: ${
          reportData?.left_foot?.clinical_indicator || 'N/A'
        }</p>
        <p>Screening Frequency: ${
          reportData?.left_foot?.screening_frequency || 'N/A'
        }</p>
        
        <h2>Right Foot Report</h2>
        <p>Risk Category: ${reportData?.right_foot?.risk_category || 'N/A'}</p>
        <p>Criteria: ${reportData?.right_foot?.criteria || 'N/A'}</p>
        <p>Clinical Indicator: ${
          reportData?.right_foot?.clinical_indicator || 'N/A'
        }</p>
        <p>Screening Frequency: ${
          reportData?.right_foot?.screening_frequency || 'N/A'
        }</p>
        
        <h2>Recommendations</h2>
        <h3>For Left Foot:</h3>
        <ul>
          ${recommendations
            .filter(item => item.id === result.left)
            .map(item => `<li>${item.text}</li>`)
            .join('')}
        </ul>
        <h3>For Right Foot:</h3>
        <ul>
          ${recommendations
            .filter(item => item.id === result.right)
            .map(item => `<li>${item.text}</li>`)
            .join('')}
        </ul>
      `;

      const options = {
        html: htmlContent,
        fileName: 'Foot_Health_Report',
        directory: 'Documents',
      };

      // Generate the PDF
      const file = await RNHTMLtoPDF.convert(options);

      // Share the PDF using react-native-share
      const shareOptions = {
        title: 'Share Foot Health Report',
        url: `file://${file.filePath}`, // Use the file path with the file:// prefix
        type: 'application/pdf',
      };

      await Share.open(shareOptions);
      Alert.alert(
        'PDF generated successfully!',
        'You can now share or save the PDF.',
      );
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
      Alert.alert(
        'Error',
        'Failed to generate or share the PDF. Please try again.',
      );
    }
  };

  useEffect(() => {
    getReport();
    requestPermissions();
    createNotificationChannel();
  }, []);

  useEffect(() => {
    if (reportData && (reportData.left_foot || reportData.right_foot)) {
      checkreport();
    }
  }, [reportData]);

  return (
    <SafeAreaView style={styles.container}>
      <Modal animationType="fade" transparent={false} visible={loading}>
        <View
          style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
          <ActivityIndicator
            size={150}
            color={colors.primary}
            animating={loading}
          />
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={{alignSelf: 'flex-start', marginBottom: 10}}>
        <Icon name="arrowleft" size={30} />
      </TouchableOpacity>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>{t('Report.title1')}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 25,
          justifyContent: 'center',
          marginHorizontal: 10,
        }}>
        <View style={{maxWidth: '50%'}}>
          <View
            style={{
              backgroundColor: colors.primary,
              padding: 10,
              borderRadius: 10,
              marginBottom: 15,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.white,
                fontSize: 16,
                fontWeight: '500',
              }}>
              {t('Report.title2')}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: 'green',
              textAlign: 'center',
            }}>
            {result.left}
          </Text>
        </View>
        <View style={{maxWidth: '50%'}}>
          <View
            style={{
              backgroundColor: colors.primary,
              padding: 10,
              borderRadius: 10,
              marginBottom: 15,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.white,
                fontSize: 16,
                fontWeight: '500',
              }}>
              {t('Report.title2')}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: 'green',
              textAlign: 'center',
            }}>
            {result.right}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          padding: 10,
          borderRadius: 10,
          position: 'absolute',
          bottom: 80,
        }}
        onPress={() =>
          navigation.replace('ReportDetail', {reportData, result})
        }>
        <Text
          style={{
            fontSize: 23,
            fontWeight: 600,
            color: colors.white,
            textAlign: 'center',
          }}>
          {t('Report.btn1')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          padding: 10,
          borderRadius: 10,
          position: 'absolute',
          bottom: 20,
        }}
        onPress={generatePDF}>
        <Text
          style={{
            fontSize: 23,
            fontWeight: 600,
            color: colors.white,
            textAlign: 'center',
          }}>
          {t('Report.btn2')}
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
