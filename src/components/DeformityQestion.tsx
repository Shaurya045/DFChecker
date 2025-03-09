import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React from 'react';
import {colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/AntDesign';

const questions = [
  {
    id: 'deformity1',
    text: 'No deformity (photo shows healthy normal foot)',
  },
  {
    id: 'deformity2',
    text: 'Mild deformity (clarified by photos)',
  },
  {
    id: 'deformity3',
    text: 'sudden swelling and hotness of the foot',
  },
  {
    id: 'deformity4',
    text: 'Amputation',
  },
  {
    id: 'deformity4',
    text: 'Sudden swelling and hotness of the foot',
  },
];

const DeformityQestion = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
  const validateAnswers = () => {
    // Check if deformity1 is checked (either left or right)
    const isDeformity1Checked = answers['deformity1']?.left || answers['deformity1']?.right;

    // Check if deformity2, deformity3, and deformity4 are not checked (both left and right)
    const areOtherQuestionsUnchecked = ['deformity2', 'deformity3', 'deformity4'].every(
      questionId => !answers[questionId]?.left && !answers[questionId]?.right,
    );

    // If deformity1 is checked and other questions are unchecked, allow proceeding
    if (isDeformity1Checked && areOtherQuestionsUnchecked) {
      return true;
    }

    // Otherwise, check if all questions have at least one checkbox selected (left or right)
    const isAllAnswered = questions.every(
      question => answers[question.id]?.left !== undefined || answers[question.id]?.right !== undefined,
    );

    if (!isAllAnswered) {
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateAnswers()) {
      Alert.alert(
        'Incomplete Form',
        'Please answer all the questions before proceeding.',
      );
      return; // Stop if validation fails
    }

    setCurrentStep('footwear'); // Proceed to the next step
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={popUp}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              Instructions
            </Text>
            <View style={{marginBottom: 15}}>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>Look for deformities:</Text>{' '}
                Inspect the foot for any changes that might affect how shoes
                fit.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>Mild deformities:</Text> Look
                for signs of discomfort, such as:
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>
                  Bumps near the big toe:
                </Text>{' '}
                A noticeable bump on the side of the foot.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>
                  Changes in foot shape due to nerve damage:
                </Text>{' '}
                A deformity that alters the shape of the foot.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>Amputation:</Text> Check if
                any toes are missing or show signs of being removed.
              </Text>
            </View>
            <Text style={{fontWeight: 'bold', marginBottom: 10}}>Sample Image:</Text>
            <Image source={require('../assets/deformity.jpeg')} style={{height: 150, width:220, marginBottom: 20}}/>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopUp(false)}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>Diabetic Foot Test - Deformity</Text>
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: '400',
            marginBottom: 20,
          }}>
          Look for any bony changes that can put you at significant risk and
          prevent the wearing of off-the-shelf footwear
        </Text>
      </View>
      <View style={styles.heading}>
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 5}}
          onPress={() => setPopUp(true)}>
          <Icon name="questioncircle" size={22} color="black" />
          <Text style={styles.headingTxt}>Click For Instructions</Text>
        </TouchableOpacity>
        <View style={styles.rightHeading}>
          <Text style={styles.headingTxt}>Left</Text>
          <Text style={styles.headingTxt}>Right</Text>
        </View>
      </View>
      {questions.map((item) => (
        <View style={styles.heading} key={item.id}>
          <Text style={styles.questionTxt}>{item.text}</Text>
          <View style={styles.buttonGroup}>
            {/* Left Checkbox */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // If deformity1 is being checked, uncheck all other left checkboxes
                if (item.id === 'deformity1' && !answers[item.id]?.left) {
                  questions.forEach((question) => {
                    if (question.id !== 'deformity1') {
                      handleAnswer(question.id, {
                        ...answers[question.id],
                        left: false,
                      });
                    }
                  });
                }
                // Toggle the current checkbox
                handleAnswer(item.id, {
                  ...answers[item.id],
                  left: !answers[item.id]?.left,
                });
              }}
              disabled={answers['deformity1']?.left && item.id !== 'deformity1'}>
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.left && styles.checkboxChecked,
                  answers['deformity1']?.left && item.id !== 'deformity1' && styles.disabledCheckbox,
                ]}>
                {answers[item.id]?.left && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Right Checkbox */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // If deformity1 is being checked, uncheck all other right checkboxes
                if (item.id === 'deformity1' && !answers[item.id]?.right) {
                  questions.forEach((question) => {
                    if (question.id !== 'deformity1') {
                      handleAnswer(question.id, {
                        ...answers[question.id],
                        right: false,
                      });
                    }
                  });
                }
                // Toggle the current checkbox
                handleAnswer(item.id, {
                  ...answers[item.id],
                  right: !answers[item.id]?.right,
                });
              }}
              disabled={answers['deformity1']?.right && item.id !== 'deformity1'}>
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.right && styles.checkboxChecked,
                  answers['deformity1']?.right && item.id !== 'deformity1' && styles.disabledCheckbox,
                ]}>
                {answers[item.id]?.right && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {/* Add instructions for checkbox interaction */}
      <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>
            <Text style={styles.boldText}>For "Yes":</Text> 
            Click the checkbox (<Text style={styles.checkmarkSymbol}>✓</Text>).
          </Text>
          <Text style={styles.instructionText}>
            <Text style={styles.boldText}>For "No":</Text> 
            Leave the checkbox unfilled (<Text style={styles.uncheckedSymbol}>◻</Text>).
         </Text>
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('nail')}>
        <Text style={styles.nextButtonText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, {marginBottom: 40}]}
        onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};

export default DeformityQestion;

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
    fontWeight: 'semibold',
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
    borderRadius: '50%',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
  checkbox: {
    position: 'absolute',
    bottom: -10,
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
  disabledCheckbox: {
    backgroundColor: '#e0e0e0',
    borderColor: '#e0e0e0',
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
  instructionBox: {
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: -200,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#555',
    marginBottom: 5,
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
});