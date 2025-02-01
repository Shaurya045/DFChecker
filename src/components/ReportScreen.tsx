import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {url} from '../utils/constants';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type ReportProps = NativeStackScreenProps<RootStackParamList, 'Report'>;

const recommendations = [
  {
    id: 'High Risk',
    text: 'Education on: risk factors (including LOPS + PAD foot deformity); risk of ulcer recurrence, daily foot inspection; appropriate footwearand foot-and nail-care; when/how to seek medical attention if needed',
  },
  {
    id: 'High Risk',
    text: 'Daily inspection of feet',
  },
  {
    id: 'High Risk',
    text: 'Well-fitting, orthopedic footwear with custom full-contact total contact casted foot orthoses and diabetic socks. Footwear must accommodate any deformities present',
  },
  {
    id: 'High Risk',
    text: 'Modified footwear and/or prosthesis based on level of amputation',
  },
  {
    id: 'High Risk',
    text: 'level of amputation Vascular',
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
    text: 'Dont remove any calluses by yourself.',
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
    text: 'Dont remove any calluses by yourself.',
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
    text: 'Dont remove any calluses by yourself.',
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
    text: 'Seek a ehab specialist for consultation on fitness exercises for feet.',
  },
  {
    id: 'Urgent Risk',
    text: 'Referral to a general, orthopedic or foot surgeon, if indicated, to surgically manage foot deformities',
  },
  {
    id: 'Urgent Risk',
    text: 'Referral to infectious diseases to manage infection, if indicated, and/or to a general, orthopedic or foot surgeon to debride infectious tissue & bone, if indicated',
  },
];

const ReportScreen = ({navigation}: ReportProps) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [result, setResult] = useState('');
  const getReport = async () => {
    try {
      // Retrieve the token from AsyncStorage
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
        const report = data.data;
        // console.log('Report:', report);
        setReportData(report);
        // console.log(reportData);
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
      const category = reportData.riskCategory;
      if (category === 'Very Low Risk (Category 0)') {
        setResult('Very Low Risk');
      } else if (category === 'Low Risk (Category 1)') {
        setResult('Low Risk');
      } else if (category === 'Moderate Risk (Category 2)') {
        setResult('Moderate Risk');
      } else if (category === 'High Risk (Category 3)') {
        setResult('High Risk');
      } else if (category === 'Urgent Risk') {
        setResult('Urgent Risk');
      }
    }
  };
  useEffect(() => {
    getReport();
  }, []);
  useEffect(() => {
    if (reportData && reportData.riskCategory) {
      checkreport();
    }
  }, [reportData]); // Runs only when reportData changes
  return (
    <View style={styles.container}>
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
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>Assessment Report</Text>
      </View>
      <Text
        style={{
          fontSize: 30,
          fontWeight: 500,
          color: 'green',
          textAlign: 'center',
        }}>
        {result}
      </Text>
      <Text
        style={{
          marginTop: 40,
          fontSize: 25,
          fontWeight: 'bold',
          color: colors.primary,
          textAlign: 'center',
        }}>
        Recommendations!
      </Text>
      <View style={{marginTop: 15}}>
        {recommendations.map((item, index) =>
          item.id === result ? (
            <Text
              key={index}
              style={{fontSize: 16, fontWeight: '500', marginBottom: 8}}>
              • {item.text}
            </Text>
          ) : null,
        )}
      </View>
    </View>
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
