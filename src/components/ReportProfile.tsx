import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share'; // Import the Share module
import { colors } from '../utils/colors';

// Navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type ReportProfileProps = NativeStackScreenProps<
  RootStackParamList,
  'ReportProfile'
>;

const recommendations = [
  // ... (same as in your original code)
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

const ReportProfile = ({ route, navigation }: ReportProfileProps) => {
  const { reportData, result } = route.params;

  const generatePDF = async () => {
    try {
      const htmlContent = `
      <h1>Report Detail</h1>
      <h2>Pre-screening Assessment</h2>
      <p>Do you have peripheral neurological disease? ${reportData?.basic_questions?.neurologicalDisease ? 'Yes' : 'No'}</p>
      <p>Have you had any amputations? ${reportData?.basic_questions?.amputation ? 'Yes' : 'No'}</p>
      <p>How many amputations have you had? ${reportData?.basic_questions?.amputationCount || 'N/A'}</p>
      <p>Are you currently smoking? ${reportData?.basic_questions?.smoking ? 'Yes' : 'No'}</p>
      <p>Do you have any ulcers on your feet? ${reportData?.basic_questions?.ulcer ? 'Yes' : 'No'}</p>
      
      <h2>Left Foot Report</h2>
      <p>Risk Category: ${reportData?.result?.left_foot?.risk_category || 'N/A'}</p>
      <p>Criteria: ${reportData?.result?.left_foot?.criteria || 'N/A'}</p>
      <p>Clinical Indicator: ${reportData?.result?.left_foot?.clinical_indicator || 'N/A'}</p>
      <p>Screening Frequency: ${reportData?.result?.left_foot?.screening_frequency || 'N/A'}</p>
      
      <h2>Right Foot Report</h2>
      <p>Risk Category: ${reportData?.result?.right_foot?.risk_category || 'N/A'}</p>
      <p>Criteria: ${reportData?.result?.right_foot?.criteria || 'N/A'}</p>
      <p>Clinical Indicator: ${reportData?.result?.right_foot?.clinical_indicator || 'N/A'}</p>
      <p>Screening Frequency: ${reportData?.result?.right_foot?.screening_frequency || 'N/A'}</p>
      
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
      Alert.alert('PDF generated successfully!', 'You can now share or save the PDF.');
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
      Alert.alert('Error', 'Failed to generate or share the PDF. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
        <Icon name="arrowleft" size={30} />
      </TouchableOpacity>

      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>Report Detail</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Basic Questions */}
        <View style={styles.section}>
          <Text style={styles.heading}>Pre-screening Assessment</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
            <Text style={styles.subHeading}>
              Do you have peripheral neurological disease?{' '}
            </Text>
            <Text style={styles.infoText}>
              {reportData?.basic_questions?.neurologicalDisease ? 'Yes' : 'No'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Have you had any amputations? </Text>
            <Text style={styles.infoText}>
              {reportData?.basic_questions?.amputation ? 'Yes' : 'No'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>
              How many amputations have you had?{' '}
            </Text>
            <Text style={styles.infoText}>
              {reportData?.basic_questions?.amputationCount || 'N/A'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Are you currently smoking? </Text>
            <Text style={styles.infoText}>
              {reportData?.basic_questions?.smoking ? 'Yes' : 'No'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>
              Do you have any ulcers on your feet?{' '}
            </Text>
            <Text style={styles.infoText}>
              {reportData?.basic_questions?.ulcer ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {/* Left Foot Report */}
        <View style={styles.section}>
          <Text style={styles.heading}>Left Foot Report</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Risk Category: </Text>
            <Text style={styles.infoText}>
              {reportData?.result?.left_foot?.risk_category || 'N/A'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Criteria: </Text>
            <Text style={styles.infoText}>
              {reportData?.result?.left_foot?.criteria || 'N/A'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Clinical Indicator: </Text>
            <Text style={styles.infoText}>
              {reportData?.result?.left_foot?.clinical_indicator || 'N/A'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Screening Frequency: </Text>
            <Text style={styles.infoText}>
              {reportData?.result?.left_foot?.screening_frequency || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Right Foot Report */}
        <View style={styles.section}>
          <Text style={styles.heading}>Right Foot Report</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Risk Category: </Text>
            <Text style={styles.infoText}>
              {reportData?.result?.right_foot?.risk_category || 'N/A'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Criteria: </Text>
            <Text style={styles.infoText}>
              {reportData?.result?.right_foot?.criteria || 'N/A'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Clinical Indicator: </Text>
            <Text style={styles.infoText}>
              {reportData?.result?.right_foot?.clinical_indicator || 'N/A'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Screening Frequency: </Text>
            <Text style={styles.infoText}>
              {reportData?.result?.right_foot?.screening_frequency || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.heading}>Recommendations</Text>
          <View style={styles.recommendationBox}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 15,
                borderBottomWidth: 2,
                borderBottomColor: 'black',
                width: '40%',
              }}>
              For Left Foot:
            </Text>
            {recommendations
              .filter((item) => item.id === result.left)
              .map((item, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {item.text}
                </Text>
              ))}
          </View>
          <View style={styles.recommendationBox}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 15,
                borderBottomWidth: 2,
                borderBottomColor: 'black',
                width: '45%',
              }}>
              For Right Foot:
            </Text>
            {recommendations
              .filter((item) => item.id === result.right)
              .map((item, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {item.text}
                </Text>
              ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.downloadButton} onPress={generatePDF}>
        <Text style={styles.downloadButtonText}>Download Report as PDF</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
    fontWeight: '600',
    textAlign: 'center',
    padding: 8,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationBox: {
    marginTop: 15,
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '60%',
  },
  downloadButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ReportProfile;