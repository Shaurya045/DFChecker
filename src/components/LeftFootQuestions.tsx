import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {leftFootQuestions} from '../utils/questions';
import {colors} from '../utils/colors';

const {high, wide} = Dimensions.get('window');

const LeftFootQuestions = ({answers, handleAnswer, setCurrentStep}) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Left Foot Questions</Text>

      {leftFootQuestions.map(question => (
        <View key={question.id} style={styles.footQuestionContainer}>
          <Text style={styles.footQuestion}>{question.text}</Text>
          <View style={styles.checkboxGroup}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                answers[question.id] === true && styles.checkedBox,
              ]}
              onPress={() => handleAnswer(question.id, true)}>
              <Text
                style={[
                  styles.buttonText,
                  answers[question.id] === true && styles.selectedButtonText,
                ]}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.checkbox,
                answers[question.id] === false && styles.checkedBox,
              ]}
              onPress={() => handleAnswer(question.id, false)}>
              <Text
                style={[
                  styles.buttonText,
                  answers[question.id] === false && styles.selectedButtonText,
                ]}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('rightFoot')}>
        <Text style={styles.nextButtonText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => console.log('Submit', answers)}>
        <Text style={styles.nextButtonText}>Submit</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  selectedButtonText: {
    color: colors.white,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  cameraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: wide,
  },
  cameraButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cameraView: {
    height: 300,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraBtnContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  cameraBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  footImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  footQuestionContainer: {
    marginBottom: 15,
  },
  footQuestion: {
    fontSize: 16,
    marginBottom: 5,
  },
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  checkedBox: {
    backgroundColor: colors.primary,
  },
  nextButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    // marginBottom: 40,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LeftFootQuestions;
