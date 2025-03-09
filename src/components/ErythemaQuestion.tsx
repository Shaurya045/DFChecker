import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors';
import { url } from '../utils/constants';

const questions = [
  {
    id: 'erythema',
    text: 'Redness noted',
  },
];

const ErythemaQuestion = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
  navigation,
}) => {
  const submitFormData = async () => {
    const data = answers;

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }

      // Log the data being sent
      console.log('Data being sent:', JSON.stringify({ data: data }));

      const response = await fetch(`${url}/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: data }),
      });

      // Log the raw response text
      const responseText = await response.text();
      console.log('Response Text:', responseText);

      if (!responseText) {
        console.error('Empty response from server');
        return;
      }

      // Attempt to parse the response as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return;
      }

      if (response.ok) {
        console.log('Form submitted successfully:', result);
        navigation.replace('Report');
      } else {
        console.error('Error submitting form:', result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Modal animationType="fade" transparent={true} visible={popUp}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Instructions</Text>
            <View style={styles.instructionTextContainer}>
              <Text style={styles.instructionText}>
                1. Mark the questions for both feet in their respective columns.
              </Text>
              <Text style={styles.instructionText}>
                2. For example, if you have heavy callus build-up on both feet,
                select both the left and right foot. If only on the right foot,
                select it only.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopUp(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>Diabetic Foot Test - Erythema</Text>
      </View>

      <View>
        <Text style={styles.questionInstruction}>
          Look for redness of the skin that does not change when the foot is
          elevated?
        </Text>
      </View>

      <View style={styles.heading}>
        <Text style={styles.headingTxt}>Questions</Text>
        <View style={styles.rightHeading}>
          <Text style={styles.headingTxt}>Left</Text>
          <Text style={styles.headingTxt}>Right</Text>
        </View>
      </View>

      {questions.map((item) => (
        <View style={styles.heading} key={item.id}>
          <Text style={styles.questionTxt}>{item.text}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                handleAnswer(item.id, {
                  ...answers[item.id],
                  left: !answers[item.id]?.left,
                })
              }
            >
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.left && styles.checkboxChecked,
                ]}
              >
                {answers[item.id]?.left && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                handleAnswer(item.id, {
                  ...answers[item.id],
                  right: !answers[item.id]?.right,
                })
              }
            >
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.right && styles.checkboxChecked,
                ]}
              >
                {answers[item.id]?.right && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>For "Yes":</Text> Click the checkbox (
          <Text style={styles.checkmarkSymbol}>✓</Text>).
        </Text>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>For "No":</Text> Leave the checkbox
          unfilled (<Text style={styles.uncheckedSymbol}>◻</Text>).
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('rubor')}
      >
        <Text style={styles.nextButtonText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={submitFormData}>
        <Text style={styles.nextButtonText}>Submit</Text>
      </TouchableOpacity>
    </>
  );
};

export default ErythemaQuestion;

const styles = StyleSheet.create({
  titleBox: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 30,
  },
  titleTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    padding: 8,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    marginBottom: 15,
  },
  rightHeading: {
    flexDirection: 'row',
    gap: 20,
  },
  headingTxt: {
    fontSize: 18,
    fontWeight: '600',
  },
  questionTxt: {
    fontSize: 17,
    fontWeight: '400',
    maxWidth: '60%',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 30,
  },
  button: {
    padding: 0,
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  instructionTextContainer: {
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 7,
  },
  modalButton: {
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  nextButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionBox: {
    marginTop: 0,
    marginBottom: 20,
    paddingHorizontal: -200,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  checkmarkSymbol: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  uncheckedSymbol: {
    color: '#000',
    fontWeight: 'bold',
  },
  questionInstruction: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 20,
  },
});