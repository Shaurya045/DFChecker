import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/AntDesign';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type ReportDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'ReportDetail'
>;

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

const ReportDetail = ({route, navigation}: ReportDetailProps) => {
  const [detailedReport, setDetailedReport] = useState([]);
  useEffect(() => {
    setDetailedReport(route.params);
    // console.log('ReportDetail :', detailedReport?.reportData?.left_foot);
  }, [detailedReport]);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={{alignSelf: 'flex-start', marginBottom: 10}}>
        <Icon name="arrowleft" size={30} />
      </TouchableOpacity>

      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>Report Detail</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Basic Questions */}
        <View style={styles.section}>
          <Text style={styles.heading}>Pre screening assessment :-</Text>
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
              {detailedReport?.reportData?.basic_questions.neurologicalDisease
                ? 'Yes'
                : 'No'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>
              Have you had any amputations?{' '}
            </Text>
            <Text style={styles.infoText}>
              {detailedReport?.reportData?.basic_questions.amputation
                ? 'Yes'
                : 'No'}
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
              {detailedReport?.reportData?.basic_questions.amputationCount ||
                'N/A'}
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
              {detailedReport?.reportData?.basic_questions.smoking
                ? 'Yes'
                : 'No'}
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
              {detailedReport?.reportData?.basic_questions.ulcer ? 'Yes' : 'No'}
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
              {detailedReport?.reportData?.left_foot.risk_category || 'N/A'}
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
              {detailedReport?.reportData?.left_foot.criteria || 'N/A'}
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
              {detailedReport?.reportData?.left_foot.clinical_indicator ||
                'N/A'}
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
              {detailedReport?.reportData?.left_foot.screening_frequency ||
                'N/A'}
            </Text>
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Scores: </Text>
            {detailedReport?.reportData?.left_foot.scores ? (
              Object.entries(detailedReport?.reportData?.left_foot.scores).map(
                ([key, value], index) => (
                  <Text key={index} style={styles.infoText}>
                    {key}: {value}
                  </Text>
                ),
              )
            ) : (
              <Text style={styles.infoText}>No Scores Available</Text>
            )}
          </View> */}
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
              {detailedReport?.reportData?.right_foot.risk_category || 'N/A'}
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
              {detailedReport?.reportData?.right_foot.criteria || 'N/A'}
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
              {detailedReport?.reportData?.right_foot.clinical_indicator ||
                'N/A'}
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
              {detailedReport?.reportData?.right_foot.screening_frequency ||
                'N/A'}
            </Text>
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.subHeading}>Scores: </Text>
            {detailedReport?.reportData?.right_foot.scores ? (
              Object.entries(detailedReport?.reportData?.right_foot.scores).map(
                ([key, value], index) => (
                  <Text key={index} style={styles.infoText}>
                    {key}: {value}
                  </Text>
                ),
              )
            ) : (
              <Text style={styles.infoText}>No Scores Available</Text>
            )}
          </View> */}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.heading}>Recommendations :-</Text>

          <View style={styles.recommendationBox}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 15,
                borderBottomWidth: 2,
                borderBottomColor: 'black',
                width: '40%',
              }}>
              For Left Foot:
            </Text>
            {recommendations
              .filter(item => item.id === detailedReport?.result?.left)
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
                fontWeight: 600,
                marginBottom: 15,
                borderBottomWidth: 2,
                borderBottomColor: 'black',
                width: '45%',
              }}>
              For Right Foot:
            </Text>
            {recommendations
              .filter(item => item.id === detailedReport?.result?.right)
              .map((item, index) => (
                <Text key={index} style={styles.recommendationText}>
                  • {item.text}
                </Text>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportDetail;

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
  heading: {fontSize: 23, fontWeight: 'bold', marginBottom: 10},
  recommendationBox: {marginTop: 15},
  recommendationText: {fontSize: 16, fontWeight: '500', marginBottom: 8},
  section: {marginBottom: 20},
  subHeading: {fontSize: 16, fontWeight: '600'},
  infoText: {fontSize: 14, fontWeight: '500', maxWidth: '60%'},
});
