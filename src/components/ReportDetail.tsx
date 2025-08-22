import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import RNFS from 'react-native-fs'; // Add this import
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';
import CitationsButton from './CitationsButton';

type ReportDetailProps = NativeStackScreenProps<RootStackParamList, 'ReportDetail'>;

const ReportDetail = ({ route, navigation }: ReportDetailProps) => {
  const [detailedReport, setDetailedReport] = useState<any>({});
  const { reportData, result } = route.params;
  const { t, i18n } = useTranslation();
  const { isDoctor } = useAuth();

  useEffect(() => {
    setDetailedReport(route.params);
  }, [route.params]);

  // Function to translate foot report fields
  const translateFootReportField = (field: string, value: string): string => {
    if (!value) return t('interpretation.notdata');

    const namespaceMap: Record<string, string> = {
      'risk_category': 'riskCategories',
      'clinical_indicator': 'clinicalIndicators',
      'criteria': 'criteria',
      'screening_frequency': 'screening_frequency',
      'interpretation': 'interpretations'
    };

    const namespace = namespaceMap[field] || field;
    const translationKey = `${namespace}.${value}`;
    const translated = t(translationKey);

    return translated !== translationKey ? translated : value;
  };

  // Safe way to get recommendations that handles all cases
  const getRecommendations = (riskLevel: string | undefined): string[] => {
    if (!riskLevel) return [t('interpretation.notAvailable')];
    
    try {
      const key = riskLevel.replace(/ - /g, '').replace(/ /g, '');
      const recommendations = t(`recommendations.${key}`, { returnObjects: true });
      
      if (Array.isArray(recommendations)) {
        return Array.isArray(recommendations) ? recommendations.filter(item => typeof item === 'string') : [t('interpretation.notAvailable')];
      }
      if (typeof recommendations === 'string') {
        return [recommendations];
      }
      return [t('interpretation.notAvailable')];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [t('interpretation.notAvailable')];
    }
  };

  // Request storage permissions for Android
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          // For Android 13 and above
          const permissions = [
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          ];
          
          const granted = await PermissionsAndroid.requestMultiple(permissions);
          
          return Object.values(granted).every(
            status => status === PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          // For Android 12 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: t('Permissions.storageTitle'),
              message: t('Permissions.storageMessage'),
              buttonNeutral: t('Permissions.askLater'),
              buttonNegative: t('Permissions.cancel'),
              buttonPositive: t('Permissions.ok'),
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.error('Permission request error:', err);
        return false;
      }
    }
    return true; // iOS doesn't need this permission
  };

  const generatePDF = async () => {
    console.log('reportData for PDF:', reportData);
    try {
      // Check storage permissions first
      const hasPermission = await requestStoragePermission();
      
      if (!hasPermission) {
        Alert.alert(
          t('Alert.permissionDenied'),
          t('Alert.storagePermissionRequired')
        );
        return;
      }

      const leftRecommendations = getRecommendations(result.left ?? undefined);
      const rightRecommendations = getRecommendations(result.right ?? undefined);

      const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; direction: ${i18n.language === 'ar' ? 'rtl' : 'ltr'}; }
            h1, h2, h3 { color: #2c3e50; }
            p, li { font-size: 16px; }
            ul { padding-left: 20px; }
            .score-container { margin-bottom: 10px; }
            .score-row { display: flex; justify-content: space-between; }
            .patient-info-card { background:#f6fafd;padding:12px 14px;border-radius:12px;margin-bottom:18px; }
            .patient-info-name { font-size:20px;color:#1976d2;font-weight:bold;margin-bottom:2px;text-align:center; }
            .patient-info-row { font-size:14px;color:#666;font-weight:400;text-align:center; }
            .patient-info-value { color:#222;font-weight:700; }
          </style>
        </head>
        <body>
          ${isDoctor && reportData?.formId?.data ? `
            <div class="patient-info-card">
              <div class="patient-info-name">
                ${t('Profile.patientName', 'Patient')}: ${reportData.formId.data.patientName || t('Profile.unknownPatient', 'Unknown Patient')}
              </div>
              <div class="patient-info-row">
                ${reportData.formId.data.patientAge ? `${t('Profile.age', 'Age')}: <span class='patient-info-value'>${reportData.formId.data.patientAge}</span>` : ''}
                ${reportData.formId.data.patientGender ? ` | ${t('Profile.gender', 'Gender')}: <span class='patient-info-value'>${reportData.formId.data.patientGender === 'male' ? t('Profile.male', 'Male') : t('Profile.female', 'Female')}</span>` : ''}
                ${(reportData.formId.data.patientPhone || reportData.formId.data.patientContact) ? ` | ${t('Profile.phone', 'Phone')}: <span class='patient-info-value'>${reportData.formId.data.patientPhone || reportData.formId.data.patientContact}</span>` : ''}
              </div>
            </div>
          ` : ''}
          <h1>${t('Detail.title1')}</h1>
          <h2>${t('Detail.title2')}</h2>
          <p>${t('Detail.text1')} ${reportData?.basic_questions?.neurologicalDisease ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text2')} ${reportData?.basic_questions?.amputation ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text4')} ${reportData?.basic_questions?.smoking ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text5')} ${reportData?.basic_questions?.ulcer ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text10')} ${reportData?.formId?.data?.renalFailure ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          
          <h2>${t('Detail.title3')}</h2>
          <p>${t('Detail.text6')}: ${translateFootReportField('risk_category', reportData?.left_foot?.risk_category)}</p>
          <p>${t('Detail.text7')}: ${translateFootReportField('criteria', reportData?.left_foot?.criteria)}</p>
          <p>${t('Detail.text8')}: ${translateFootReportField('clinical_indicator', reportData?.left_foot?.clinical_indicator)}</p>
          <p>${t('Detail.text9')}: ${translateFootReportField('screening_frequency', reportData?.left_foot?.screening_frequency)}</p>
          
          <h3>${t('Detail.interpretation')}:</h3>
          <ul>
            ${(reportData?.left_foot?.interpretation || []).map((item: string) => `
              <li>${translateFootReportField('interpretation', item)}</li>
            `).join('')}
          </ul>
          
          <h2>${t('Detail.title4')}</h2>
          <p>${t('Detail.text6')}: ${translateFootReportField('risk_category', reportData?.right_foot?.risk_category)}</p>
          <p>${t('Detail.text7')}: ${translateFootReportField('criteria', reportData?.right_foot?.criteria)}</p>
          <p>${t('Detail.text8')}: ${translateFootReportField('clinical_indicator', reportData?.right_foot?.clinical_indicator)}</p>
          <p>${t('Detail.text9')}: ${translateFootReportField('screening_frequency', reportData?.right_foot?.screening_frequency)}</p>
          
          <h3>${t('Detail.interpretation')}:</h3>
          <ul>
            ${(reportData?.right_foot?.interpretation || []).map((item: string) => `
              <li>${translateFootReportField('interpretation', item)}</li>
            `).join('')}
          </ul>
          
          <h2>${t('Detail.title5')}</h2>
          <h3>${t('Detail.title6')}:</h3>
          <ul>
            ${leftRecommendations.map(item => `<li>${item}</li>`).join('')}
          </ul>
          <h3>${t('Detail.title7')}:</h3>
          <ul>
            ${rightRecommendations.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </body>
      </html>
      `;

      // Use appropriate directory based on platform
      const directory = Platform.select({
        ios: 'Documents',
        android: 'Download',
      });
      
      const filename = `Foot_Health_Report_${new Date().getTime()}`;
      
      const options = {
        html: htmlContent,
        fileName: filename,
        directory: directory,
        base64: true, // Add this option
      };

      const file = await RNHTMLtoPDF.convert(options);
      
      if (!file.filePath) {
        throw new Error('PDF file path is empty');
      }

      // For Android, ensure the file is discoverable in the Downloads folder
      if (Platform.OS === 'android') {
        // Copy the file to the external Downloads directory to make it visible in file explorer
        const downloadPath = `${RNFS.DownloadDirectoryPath}/${filename}.pdf`;
        
        // Check if file exists first
        const fileExists = await RNFS.exists(file.filePath);
        
        if (fileExists) {
          try {
            // Copy PDF to downloads folder
            await RNFS.copyFile(file.filePath, downloadPath);
            
            // Make file visible in gallery/downloads
            await RNFS.scanFile(downloadPath);
            
            console.log('File saved to:', downloadPath);
          } catch (copyError) {
            console.error('Error copying file:', copyError);
          }
        }
      }
      
      // Share the PDF file
      const shareOptions = {
        title: t('Report.btn2'),
        url: Platform.OS === 'ios' ? file.filePath : `file://${file.filePath}`,
        type: 'application/pdf',
      };

      await Share.open(shareOptions);
      Alert.alert(t('Alert.title1'), t('Alert.text1'));
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      Alert.alert(t('Alert.error'), `${t('Alert.pdfError')}: ${errorMsg}`);
    }
  };

  const renderScores = (scores: Record<string, number>) => {
    return Object.entries(scores || {}).map(([key, value]) => (
      <View key={key} style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>{t(`scores.${key}`)}:</Text>
        <Text style={styles.scoreValue}>{value}</Text>
      </View>
    ));
  };

  const renderInterpretation = (interpretation: string[]) => {
    if (!interpretation || interpretation.length === 0) {
      return <Text style={styles.interpretationText}>• {t('interpretation.notAvailable')}</Text>;
    }
    return interpretation.map((item, index) => (
      <Text key={index} style={styles.interpretationText}>
        • {translateFootReportField('interpretation', item)}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.backButton}>
        <Icon name="arrowleft" size={30} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>{t('Detail.title1')}</Text>
      </View>
      
      <View style={styles.citationsContainer}>
        <CitationsButton category="recommendations" style={styles.citationsButton} isDoctor={isDoctor} />
      </View>
      {isDoctor && (
        <View style={styles.patientInfoCardNew}>
          <Text style={styles.patientInfoInlineName}>
            {t('Profile.patientName', 'Patient')}: {reportData?.formId?.data?.patientName || t('Profile.unknownPatient', 'Unknown Patient')}
          </Text>
          <View style={styles.patientInfoInlineRowNew}>
            {reportData?.formId?.data?.patientAge && (
              <>
                <Text style={styles.patientInfoInlineLabel}> {t('Profile.age', 'Age')}:</Text>
                <Text style={styles.patientInfoInlineValue}>{reportData?.formId?.data?.patientAge}</Text>
              </>
            )}
            {reportData?.formId?.data?.patientGender && (
              <>
                <Text style={styles.patientInfoInlineLabel}> | {t('Profile.gender', 'Gender')}:</Text>
                <Text style={styles.patientInfoInlineValue}>{reportData?.formId?.data?.patientGender === 'male' ? t('Profile.male', 'Male') : t('Profile.female', 'Female')}</Text>
              </>
            )}
            {(reportData?.formId?.data?.patientPhone || reportData?.formId?.data?.patientContact) && (
              <>
                <Text style={styles.patientInfoInlineLabel}> | {t('Profile.phone', 'Phone')}:</Text>
                <Text style={styles.patientInfoInlineValue}>{reportData?.formId?.data?.patientPhone || reportData?.formId?.data?.patientContact}</Text>
              </>
            )}
          </View>
        </View>
      )}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Basic Questions */}
        <View style={styles.section}>
          <Text style={styles.heading}>{t('Detail.title2')}</Text>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text1')}</Text>
            <Text style={styles.infoText}>
              {reportData?.basic_questions?.neurologicalDisease ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text2')}</Text>
            <Text style={styles.infoText}>
              {reportData?.basic_questions?.amputation ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text4')}</Text>
            <Text style={styles.infoText}>
              {reportData?.basic_questions?.smoking ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text5')}</Text>
            <Text style={styles.infoText}>
              {reportData?.basic_questions?.ulcer ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text10')}</Text>
            <Text style={styles.infoText}>
              {reportData?.formId?.data?.renalFailure ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
        </View>

        {/* Left Foot Report */}
        <View style={styles.section}>
          <Text style={styles.heading}>{t('Detail.title3')}</Text>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text6')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('risk_category', reportData?.left_foot?.risk_category)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text7')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('criteria', reportData?.left_foot?.criteria)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text8')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('clinical_indicator', reportData?.left_foot?.clinical_indicator)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text9')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('screening_frequency', reportData?.left_foot?.screening_frequency)}
            </Text>
          </View>
          
          <Text style={styles.subHeading}>{t('Detail.interpretation')}</Text>
          {renderInterpretation(reportData?.left_foot?.interpretation)}
        </View>

        {/* Right Foot Report */}
        <View style={styles.section}>
          <Text style={styles.heading}>{t('Detail.title4')}</Text>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text6')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('risk_category', reportData?.right_foot?.risk_category)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text7')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('criteria', reportData?.right_foot?.criteria)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text8')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('clinical_indicator', reportData?.right_foot?.clinical_indicator)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text9')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('screening_frequency', reportData?.right_foot?.screening_frequency)}
            </Text>
          </View>
          
          <Text style={styles.subHeading}>{t('Detail.interpretation')}</Text>
          {renderInterpretation(reportData?.right_foot?.interpretation)}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.heading}>{t('Detail.title5')}</Text>
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>
              {t('Detail.title6')}
            </Text>
            {getRecommendations(result.left ?? undefined).map((item, index) => (
              <Text key={index} style={styles.recommendationText}>
                • {item}
              </Text>
            ))}
          </View>
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>
              {t('Detail.title7')}
            </Text>
            {getRecommendations(result.right ?? undefined).map((item, index) => (
              <Text key={index} style={styles.recommendationText}>
                • {item}
              </Text>
            ))}
          </View>
        </View>

        {/* Download PDF Button */}
        <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
          <Text style={styles.downloadButtonText}>{t('Report.btn2')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  citationsContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  citationsButton: {
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    color: colors.primary,
  },
  titleBox: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 20,
    paddingVertical: 10,
  },
  titleTxt: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    flex: 1,
    textAlign: 'right',
  },
  scoresContainer: {
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  interpretationText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginLeft: 10,
  },
  recommendationBox: {
    marginTop: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  recommendationTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.primary,
  },
  recommendationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginLeft: 5,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  patientInfoCardNew: {
    backgroundColor: '#f6fafd',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    marginTop: -4,
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  patientInfoInlineName: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  patientInfoInlineRowNew: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  patientInfoInlineLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
    marginLeft: 4,
    marginRight: 2,
  },
  patientInfoInlineValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '700',
    marginRight: 8,
  },
});

export default ReportDetail;