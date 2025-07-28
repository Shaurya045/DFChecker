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
import CitationsButton from './CitationsButton';
import {useAuth} from '../AuthContext';

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
    text: "Don't remove any  by yourself.",
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
    text: "Don't remove any cornes by yourself.",
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
    text: "Don't remove any cornes by yourself.",
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
    text: 'Do not attempt home treatments such as cutting cornes or draining wounds.',
  },
  {
    id: 'Urgent Risk',
    text: 'Visit an emergency care center if pain, swelling, or signs of infection (redness, pus, fever) occur.',
  },
];

const getRiskColors = (risk: string) => {
  switch (risk) {
    case 'Very Low Risk':
      return { bg: '#eafbe7', text: '#228B22' };
    case 'Low Risk':
      return { bg: '#fffbe6', text: '#e6a700' };
    case 'Moderate Risk':
      return { bg: '#fff4e6', text: '#ff9800' };
    case 'High Risk':
      return { bg: '#ffeaea', text: '#d32f2f' };
    case 'Urgent Risk':
      return { bg: '#ffd6d6', text: '#b71c1c' };
    case 'Healthy Foot - Need Self Care':
      return { bg: '#e6f0fa', text: colors.primary };
    default:
      return { bg: '#f0f0f0', text: '#333' };
  }
};

const ReportScreen = ({navigation}: ReportProps) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [result, setResult] = useState<{left: string | null; right: string | null}>({left: null, right: null});
  const {t} = useTranslation();
  const {isDoctor} = useAuth();

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
      console.log('getreport response:', data);
      if (data.success) {
        setReportData(data.data);
        // Log the risk category values for left and right foot
        if (data.data.result && data.data.result.left_foot && data.data.result.right_foot) {
          console.log('Left Foot Risk Category:', data.data.result.left_foot.risk_category);
          console.log('Right Foot Risk Category:', data.data.result.right_foot.risk_category);
          
          // Directly set the risk categories so we don't need to process them later
          const leftCategory = data.data.result.left_foot.risk_category;
          const rightCategory = data.data.result.right_foot.risk_category;
          
          // Extract just the main risk level (e.g., "High Risk" from "High Risk - Category 3")
          const getMainRiskLevel = (category: string | undefined): string | null => {
            if (!category) return null;
            
            // Extract the part before any dash or hyphen
            const mainPart = category.split('-')[0];
            if (mainPart) {
              return mainPart.trim();
            }
            
            return category;
          };
          
          setResult({
            left: getMainRiskLevel(leftCategory),
            right: getMainRiskLevel(rightCategory)
          });
        }
        
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

  // Removed checkreport function since we're doing the processing directly in getReport

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
        <p>Do you have history of end-stage renal failure ? ${
          reportData?.basic_questions?.renalFailure ? 'Yes' : 'No'
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
      // Processing now happens directly in getReport
      handleTestSubmission();
    }
  }, [reportData]);

  return (
    <SafeAreaView style={styles.container}>
      <Modal animationType="fade" transparent={false} visible={loading}>
        <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
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
      <View style={styles.citationsContainer}>
        <CitationsButton category="assessment" style={styles.citationsButton} isDoctor={isDoctor} />
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>{t('Report.title2')}</Text>
          <View style={styles.riskBadgeContainer}>
            <Text
              style={[
                styles.riskBadge,
                result.left && getRiskColors(result.left)
                  ? {
                      backgroundColor: getRiskColors(result.left).bg,
                      color: getRiskColors(result.left).text,
                    }
                  : {},
              ]}
            >
              {result.left || 'Loading...'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>{t('Report.title3')}</Text>
          <View style={styles.riskBadgeContainer}>
            <Text
              style={[
                styles.riskBadge,
                result.right && getRiskColors(result.right)
                  ? {
                      backgroundColor: getRiskColors(result.right).bg,
                      color: getRiskColors(result.right).text,
                    }
                  : {},
              ]}
            >
              {result.right || 'Loading...'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.replace('ReportDetail', {reportData, result})
          }>
          <Icon name="profile" size={22} color={colors.white} style={{marginRight: 8}} />
          <Text style={styles.buttonText}>{t('Report.btn1')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, {marginTop: 15}]}
          onPress={generatePDF}>
          <Icon name="download" size={22} color={colors.white} style={{marginRight: 8}} />
          <Text style={styles.buttonText}>{t('Report.btn2')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 0,
    backgroundColor: '#f7f7f7',
  },
  citationsContainer: {
    width: '90%',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  citationsButton: {
    marginBottom: 10,
  },
  titleBox: {
    width: '90%',
    backgroundColor: colors.primary,
    borderRadius: 14,
    marginBottom: 25,
    alignSelf: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleTxt: {
    color: 'white',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    padding: 12,
    letterSpacing: 0.5,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 40,
    gap: 18,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 120,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  riskBadgeContainer: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskBadge: {
    backgroundColor: '#eafbe7',
    color: 'green',
    fontWeight: '700',
    fontSize: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    overflow: 'hidden',
    textAlign: 'center',
    minWidth: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '90%',
    alignSelf: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
});