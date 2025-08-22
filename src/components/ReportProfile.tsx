import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React from 'react';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CitationsButton from './CitationsButton';

type ReportProfileProps = {
  route: {
    params: {
      reportData: any;
      result: {
        left: string;
        right: string;
      };
    };
  };
  navigation: any;
};

const ReportProfile = ({ route, navigation }: ReportProfileProps) => {
  const { reportData, result } = route.params;
  const { t, i18n } = useTranslation();
  const { isDoctor } = useAuth();

  // Function to translate foot report fields
  const translateFootReportField = (field: string, value: string): string => {
    if (!value) return t('interpretation.notdata');

    const namespaceMap: Record<string, string> = {
      'risk_category': 'riskCategories',
      'clinical_indicator': 'clinicalIndicators',
      'criteria': 'criteria',
      'screening_frequency': 'screening_frequency',
      'interpretation': 'interpretation'
    };

    const namespace = namespaceMap[field] || field;
    const translationKey = `${namespace}.${value}`;
    const translated = t(translationKey);

    return translated !== translationKey ? translated : value;
  };

  // Safe way to get recommendations
  const getRecommendations = (riskLevel: string | undefined): string[] => {
    if (!riskLevel) return [t('interpretation.notAvailable')];
    
    const key = riskLevel.replace(/ - /g, '').replace(/ /g, '');
    const recommendations = t(`recommendations.${key}`, { returnObjects: true });
    
    if (Array.isArray(recommendations)) {
      return Array.isArray(recommendations) ? recommendations.filter(item => typeof item === 'string') : [recommendations];
    }
    if (typeof recommendations === 'string') {
      return [recommendations];
    }
    return [t('interpretation.notAvailable')];
  };

  const generatePDF = async () => {
    try {
      const leftRecommendations = getRecommendations(result.left);
      const rightRecommendations = getRecommendations(result.right);

      // Robust patient info extraction with fallbacks
      const patientData = reportData?.formId?.data || {};
      const patientName = patientData.patientName || t('Profile.unknownPatient', 'Unknown Patient');
      const patientAge = patientData.patientAge || 'N/A';
      const patientGender = patientData.patientGender
        ? (patientData.patientGender === 'male' ? t('Profile.male', 'Male') : t('Profile.female', 'Female'))
        : 'N/A';
      const patientPhone = patientData.patientPhone || patientData.patientContact || 'N/A';

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
          ${isDoctor ? `
            <div class="patient-info-card">
              <div class="patient-info-name">
                ${t('Profile.patientName', 'Patient')}: ${patientName}
              </div>
              <div class="patient-info-row">
                ${t('Profile.age', 'Age')}: <span class='patient-info-value'>${patientAge}</span>
                | ${t('Profile.gender', 'Gender')}: <span class='patient-info-value'>${patientGender}</span>
                | ${t('Profile.phone', 'Phone')}: <span class='patient-info-value'>${patientPhone}</span>
              </div>
            </div>
          ` : ''}
          <h1>${t('Detail.title1')}</h1>
          <h2>${t('Detail.title2')}</h2>
          <p>${t('Detail.text1')} ${reportData?.result.basic_questions?.neurologicalDisease ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text2')} ${reportData?.result.basic_questions?.amputation ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text4')} ${reportData?.result.basic_questions?.smoking ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text5')} ${reportData?.result.basic_questions?.ulcer ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text10')} ${reportData?.formId?.data?.renalFailure ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          
          <h2>${t('Detail.title3')}</h2>
          <p>${t('Detail.text6')}: ${translateFootReportField('risk_category', reportData?.result?.left_foot?.risk_category)}</p>
          <p>${t('Detail.text7')}: ${translateFootReportField('criteria', reportData?.result?.left_foot?.criteria)}</p>
          <p>${t('Detail.text8')}: ${translateFootReportField('clinical_indicator', reportData?.result?.left_foot?.clinical_indicator)}</p>
          <p>${t('Detail.text9')}: ${translateFootReportField('screening_frequency', reportData?.result?.left_foot?.screening_frequency)}</p>
          
          <h3>${t('Detail.interpretation')}:</h3>
          <ul>
            ${(reportData?.result?.left_foot?.interpretation || []).map((item: string) => `
              <li>${translateFootReportField('interpretation', item)}</li>
            `).join('')}
          </ul>
          
          <h2>${t('Detail.title4')}</h2>
          <p>${t('Detail.text6')}: ${translateFootReportField('risk_category', reportData?.result?.right_foot?.risk_category)}</p>
          <p>${t('Detail.text7')}: ${translateFootReportField('criteria', reportData?.result?.right_foot?.criteria)}</p>
          <p>${t('Detail.text8')}: ${translateFootReportField('clinical_indicator', reportData?.result?.right_foot?.clinical_indicator)}</p>
          <p>${t('Detail.text9')}: ${translateFootReportField('screening_frequency', reportData?.result?.right_foot?.screening_frequency)}</p>
          
          <h3>${t('Detail.interpretation')}:</h3>
          <ul>
            ${(reportData?.result?.right_foot?.interpretation || []).map((item: string) => `
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

      const options = {
        html: htmlContent,
        fileName: 'Foot_Health_Report',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      const shareOptions = {
        title: t('Report.btn2'),
        url: `file://${file.filePath}`,
        type: 'application/pdf',
      };

      await Share.open(shareOptions);
      Alert.alert(t('Alert.title1'), t('Alert.text1'));
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
      Alert.alert(t('Alert.error'), t('Alert.pdfError'));
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
        onPress={() => navigation.navigate('Profile')}
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
              {reportData?.result.basic_questions?.neurologicalDisease ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text2')}</Text>
            <Text style={styles.infoText}>
              {reportData?.result.basic_questions?.amputation ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text4')}</Text>
            <Text style={styles.infoText}>
              {reportData?.result.basic_questions?.smoking ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text5')}</Text>
            <Text style={styles.infoText}>
              {reportData?.result.basic_questions?.ulcer ? t('BasicQes.yes') : t('BasicQes.no')}
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
              {translateFootReportField('risk_category', reportData?.result?.left_foot?.risk_category)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text7')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('criteria', reportData?.result?.left_foot?.criteria)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text8')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('clinical_indicator', reportData?.result?.left_foot?.clinical_indicator)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text9')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('screening_frequency', reportData?.result?.left_foot?.screening_frequency)}
            </Text>
          </View>
          
          <Text style={styles.subHeading}>{t('Detail.interpretation')}</Text>
          {renderInterpretation(reportData?.result?.left_foot?.interpretation)}
        </View>

        {/* Right Foot Report */}
        <View style={styles.section}>
          <Text style={styles.heading}>{t('Detail.title4')}</Text>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text6')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('risk_category', reportData?.result?.right_foot?.risk_category)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text7')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('criteria', reportData?.result?.right_foot?.criteria)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text8')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('clinical_indicator', reportData?.result?.right_foot?.clinical_indicator)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text9')}</Text>
            <Text style={styles.infoText}>
              {translateFootReportField('screening_frequency', reportData?.result?.right_foot?.screening_frequency)}
            </Text>
          </View>
          
          <Text style={styles.subHeading}>{t('Detail.interpretation')}</Text>
          {renderInterpretation(reportData?.result?.right_foot?.interpretation)}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.heading}>{t('Detail.title5')}</Text>
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>
              {t('Detail.title6')}
            </Text>
            {getRecommendations(result.left).map((item, index) => (
              <Text key={index} style={styles.recommendationText}>
                • {item}
              </Text>
            ))}
          </View>
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>
              {t('Detail.title7')}
            </Text>
            {getRecommendations(result.right).map((item, index) => (
              <Text key={index} style={styles.recommendationText}>
                • {item}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
        {/* Download PDF Button */}
        <TouchableOpacity style={styles.actionButton} onPress={generatePDF}>
          <Icon name="download" size={22} color={colors.white} style={{marginRight: 8}} />
          <Text style={styles.buttonText}>{t('Report.btn2')}</Text>
        </TouchableOpacity>
      
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
  },
  titleBox: {
     backgroundColor: colors.primary,
      padding: 11,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 30,
      marginHorizontal: 20,
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
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

export default ReportProfile;