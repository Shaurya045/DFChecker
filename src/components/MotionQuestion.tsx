import {
  FlatList,
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
    id: 'motion1',
    text: 'First toe is easily moved?',
  },
  {
    id: 'motion2',
    text: 'First toe has some restricted movement',
  },
  {
    id: 'motion3',
    text: 'First toe is rigid and cannot be moved',
  },
  
  {
    id: 'motion4',
    text: 'First toe (hallux) amputated?',
  },

];

const MotionQuestion = ({
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
     const isSkin1Checked = answers['motion4']?.left || answers['motion4']?.right;
   
     // 4. Check if skin2, skin3, and skin4 are not checked (both left and right)
     const areOtherQuestionsUnchecked = ['motion1', 'motion2', 'motion3'].every(
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
 
     setCurrentStep('sensation'); // Proceed to the next step
   };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={popUp}
        // onRequestClose={onClose}
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
                <Text style={{fontWeight: 'bold'}}>Move the big toe:</Text>{' '}
                Gently move the big toe up and down.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>Normal movement:</Text> The
                big toe moves easily.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>Restricted movement:</Text>{' '}
                The big toe has some difficulty moving.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>Stiff toe:</Text> The big toe
                is rigid and cannot be moved.
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>Missing toe:</Text> The big
                toe is missing.
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
        <Text style={styles.titleTxt}>
          Diabetic Foot Test - Range of Motion
        </Text>
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: '400',
            marginBottom: 20,
          }}>
          Move the first toe back and forth
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
                      // If motion4 is being checked, uncheck all other left checkboxes
                      if (item.id === 'motion4' && !answers[item.id]?.left) {
                        questions.forEach((question) => {
                          if (question.id !== 'motion4') {
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
                    disabled={answers['motion4']?.left && item.id !== 'motion4'}>
                    <View
                      style={[
                        styles.checkbox,
                        answers[item.id]?.left && styles.checkboxChecked,
                        answers['motion4']?.left && item.id !== 'motion4' && styles.disabledCheckbox,
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
                      // If motion4 is being checked, uncheck all other right checkboxes
                      if (item.id === 'motion4' && !answers[item.id]?.right) {
                        questions.forEach((question) => {
                          if (question.id !== 'motion4') {
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
                    disabled={answers['motion4']?.right && item.id !== 'motion4'}>
                    <View
                      style={[
                        styles.checkbox,
                        answers[item.id]?.right && styles.checkboxChecked,
                        answers['motion4']?.right && item.id !== 'motion4' && styles.disabledCheckbox,
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
        onPress={() => setCurrentStep('tempHot')}>
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

export default MotionQuestion;

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