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

  const generatePDF = async () => {
    try {
      const leftRecommendations = result.left 
        ? (t(`recommendations.${result.left.replace(/ - /g, '').replace(/ /g, '')}`, { returnObjects: true }) as string[])
        : [];
      const rightRecommendations = result.right
        ? (t(`recommendations.${result.right.replace(/ - /g, '').replace(/ /g, '')}`, { returnObjects: true }) as string[])
        : [];

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
          </style>
        </head>
        <body>
          <h1>${t('Detail.title1')}</h1>
          <h2>${t('Detail.title2')}</h2>
          <p>${t('Detail.text1')} ${reportData?.basic_questions?.neurologicalDisease ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text2')} ${reportData?.basic_questions?.amputation ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text4')} ${reportData?.basic_questions?.smoking ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text5')} ${reportData?.basic_questions?.ulcer ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          <p>${t('Detail.text10')} ${reportData?.basic_questions?.renalFailure ? t('BasicQes.yes') : t('BasicQes.no')}</p>
          
          <h2>${t('Detail.title3')}</h2>
          <p>${t('Detail.text6')}: ${translateFootReportField('risk_category', reportData?.result?.left_foot?.risk_category)}</p>
          <p>${t('Detail.text7')}: ${translateFootReportField('criteria', reportData?.result?.left_foot?.criteria)}</p>
          <p>${t('Detail.text8')}: ${translateFootReportField('clinical_indicator', reportData?.result?.left_foot?.clinical_indicator)}</p>
          <p>${t('Detail.text9')}: ${translateFootReportField('screening_frequency', reportData?.result?.left_foot?.screening_frequency)}</p>
          
          // <h3>${t('Detail.scores')}:</h3>
          // ${Object.entries(reportData?.result?.left_foot?.scores || {}).map(([key, value]) => `
          //   <div class="score-row">
          //     <span>${t(`scores.${key}`)}:</span>
          //     <span>${value}</span>
          //   </div>
          // `).join('')}
          
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
          
          // <h3>${t('Detail.scores')}:</h3>
          // ${Object.entries(reportData?.result?.right_foot?.scores || {}).map(([key, value]) => `
          //   <div class="score-row">
          //     <span>${t(`scores.${key}`)}:</span>
          //     <span>${value}</span>
          //   </div>
          // `).join('')}
          
          <h3>${t('Detail.interpretation')}:</h3>
          <ul>
            ${(reportData?.result?.right_foot?.interpretation || []).map((item: string) => `
              <li>${translateFootReportField('interpretation', item)}</li>
            `).join('')}
          </ul>
          
          <h2>${t('Detail.title5')}</h2>
          <h3>${t('Detail.title6')}:</h3>
          <ul>
            ${leftRecommendations.length > 0 ? leftRecommendations.map(item => `<li>${item}</li>`).join('') : '<li>N/A</li>'}
          </ul>
          <h3>${t('Detail.title7')}:</h3>
          <ul>
            ${rightRecommendations.length > 0 ? rightRecommendations.map(item => `<li>${item}</li>`).join('') : '<li>N/A</li>'}
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
        onPress={() => navigation.navigate('Home')}
        style={styles.backButton}>
        <Icon name="arrowleft" size={30} />
      </TouchableOpacity>

      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>{t('Detail.title1')}</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Basic Questions */}
        <View style={styles.section}>
          <Text style={styles.heading}>{t('Detail.title2')}</Text>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text1')}</Text>
            <Text style={styles.infoText}>
              {reportData?.result?.basic_questions?.neurologicalDisease ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text2')}</Text>
            <Text style={styles.infoText}>
              {reportData?.result?.basic_questions?.amputation ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text4')}</Text>
            <Text style={styles.infoText}>
              {reportData?.result?.basic_questions?.smoking ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text5')}</Text>
            <Text style={styles.infoText}>
              {reportData?.result?.basic_questions?.ulcer ? t('BasicQes.yes') : t('BasicQes.no')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subHeading}>{t('Detail.text10')}</Text>
            <Text style={styles.infoText}>
              {reportData?.result?.basic_questions?.renalFailure ? t('BasicQes.yes') : t('BasicQes.no')}
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
          
          {/* <Text style={styles.subHeading}>{t('Detail.scores')}</Text>
          <View style={styles.scoresContainer}>
            {renderScores(reportData?.result?.left_foot?.scores)}
          </View> */}
          
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
          
          {/* <Text style={styles.subHeading}>{t('Detail.scores')}</Text>
          <View style={styles.scoresContainer}>
            {renderScores(reportData?.result?.right_foot?.scores)}
          </View> */}
          
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
            {result.left ? (
              (t(`recommendations.${result.left.replace(/ - /g, '').replace(/ /g, '')}`, 
                { returnObjects: true }) as string[]).map((item, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {item}
                </Text>
              ))
            ) : (
              <Text style={styles.recommendationText}>• {t('interpretation.notAvailable')}</Text>
            )}
          </View>
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>
              {t('Detail.title7')}
            </Text>
            {result.right ? (
              (t(`recommendations.${result.right.replace(/ - /g, '').replace(/ /g, '')}`, 
                { returnObjects: true }) as string[]).map((item, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {item}
                </Text>
              ))
            ) : (
              <Text style={styles.recommendationText}>• {t('interpretation.notAvailable')}</Text>
            )}
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
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
});

export default ReportProfile;