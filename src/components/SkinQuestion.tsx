import {Modal, StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import React from 'react';
import {colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/AntDesign';

const questions = [
  {
    id: 'skin1',
    text: 'Skin is intact and has no signs of trauma & ulcer. No signs of fungus or callus formation?',
  },
  {
    id: 'skin2',
    text: 'Skin is dry, fungus such as a moccasin foot or interdigital yeast may be present. Some callus build-up may be noted?',
  },
  {
    id: 'skin3',
    text: 'Heavy callus build up?',
  },
  {
    id: 'skin4',
    text: 'Open skin ulceration present?',
  },
];

const SkinQuestion = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
  const validateAnswers = () => {
    // 1. Check if at least one option is selected for any question (left OR right)
    const hasAnyAnswers = questions.some(
      question => answers[question.id]?.left === true || answers[question.id]?.right === true
    );
  
    if (!hasAnyAnswers) {
      Alert.alert(
        'Incomplete Form',
        'Please select at least one option before proceeding.',
      );
      return false;
    }
  
    // 2. Check if at least one left foot and one right foot option is selected
    const hasLeftFootSelection = questions.some(
      question => answers[question.id]?.left === true
    );
    const hasRightFootSelection = questions.some(
      question => answers[question.id]?.right === true
    );
  
    if (!hasLeftFootSelection || !hasRightFootSelection) {
      Alert.alert(
        'Incomplete Form',
        'Please select at least one option for each foot (left and right).',
      );
      return false;
    }
  
    // 3. Check if skin1 is checked (either left or right)
    const isSkin1Checked = answers['skin1']?.left || answers['skin1']?.right;
  
    // 4. Check if skin2, skin3, and skin4 are not checked (both left and right)
    const areOtherQuestionsUnchecked = ['skin2', 'skin3', 'skin4'].every(
      questionId => !answers[questionId]?.left && !answers[questionId]?.right
    );
  
    // 5. If skin1 is checked and other questions are unchecked, allow proceeding
    if (isSkin1Checked && areOtherQuestionsUnchecked) {
      return true;
    }

    // if at least one left foot and one right foot option is selected, allow proceeding
    if (hasLeftFootSelection && hasRightFootSelection) {
      return true;
    }
    // 6. Otherwise, check if all questions have at least one checkbox selected (left or right)
    const isAllAnswered = questions.every(
      question => answers[question.id]?.left !== undefined || answers[question.id]?.right !== undefined
    );
  
    if (!isAllAnswered) {
      Alert.alert(
        'Incomplete Form',
        'Please answer all questions before proceeding.',
      );
      return false;
    }
  
    return true;
  };

  const handleNext = () => {
    if (!validateAnswers()) {
      return; // Stop if validation fails
    }

    setCurrentStep('nail'); // Proceed to the next step
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
                <Text style={{fontWeight: 'bold'}}>Examine the foot:</Text>{' '}
                Inspect the top, bottom, sides, and between the toes.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>Check skin integrity:</Text>{' '}
                Ensure the skin is unbroken, without cuts, blisters, or open
                wounds. Note any damage.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>Look for trauma:</Text> Check
                for cuts, scrapes, or blisters. Record their location and type.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>
                  Assess for fungal infections:
                </Text>{' '}
                Look for dry, flaky skin (moccasin foot) or moist, red areas
                (yeast infection) between the toes.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>Check skin condition:</Text>{' '}
                Feel for dry, rough, or cracked skin. Note if it's moist in any
                areas.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>Check for calluses:</Text>{' '}
                Look for thickened skin, especially on the bottom of the feet.
                Note if it's light or heavy.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>
                  Look for ulcers or open wounds:
                </Text>{' '}
                Inspect for any open sores. Document their size and location.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopUp(false)}>
              <Text style={styles.modalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>Diabetic Foot Test - Skin</Text>
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
          // If skin1 is being checked, uncheck all other left checkboxes
          if (item.id === 'skin1' && !answers[item.id]?.left) {
            questions.forEach((question) => {
              if (question.id !== 'skin1') {
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
        disabled={answers['skin1']?.left && item.id !== 'skin1'}>
        <View
          style={[
            styles.checkbox,
            answers[item.id]?.left && styles.checkboxChecked,
            answers['skin1']?.left && item.id !== 'skin1' && styles.disabledCheckbox,
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
          // If skin1 is being checked, uncheck all other right checkboxes
          if (item.id === 'skin1' && !answers[item.id]?.right) {
            questions.forEach((question) => {
              if (question.id !== 'skin1') {
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
        disabled={answers['skin1']?.right && item.id !== 'skin1'}>
        <View
          style={[
            styles.checkbox,
            answers[item.id]?.right && styles.checkboxChecked,
            answers['skin1']?.right && item.id !== 'skin1' && styles.disabledCheckbox,
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
        onPress={() => setCurrentStep('initial')}>
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

export default SkinQuestion;

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
  disabledCheckbox: {
    backgroundColor: '#e0e0e0',
    borderColor: '#e0e0e0',
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