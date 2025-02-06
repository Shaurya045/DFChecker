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
import Icon from 'react-native-vector-icons/AntDesign';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

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
        const report = data.data.result;
        console.log('Report:', report);
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
      if (category === 'Low Risk - Category 0') {
        setResult('Very Low Risk');
      } else if (
        category === 'Low Risk - Category 1' ||
        category === 'Low Risk'
      ) {
        setResult('Low Risk');
      } else if (category === 'Moderate Risk - Category 2') {
        setResult('Moderate Risk');
      } else if (category === 'High Risk - Category 3') {
        setResult('High Risk');
      } else if (category === 'Urgent Risk') {
        setResult('Urgent Risk');
      } else if (category === 'Healthy Foot - Need Self Care') {
        setResult('Healthy Foot - Need Self Care');
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
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={{alignSelf: 'flex-start', marginBottom: 10}}>
        <Icon name="arrowleft" size={30} />
      </TouchableOpacity>
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
