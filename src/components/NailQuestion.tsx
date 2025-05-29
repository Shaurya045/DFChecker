import {
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
import {useTranslation} from 'react-i18next';

const NailQuestion = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
  const {t} = useTranslation();
  const questions = [
    {
      id: 'nails1',
      text: t('Nail.qes1'),
    },
    {
      id: 'nails2',
      text: t('Nail.qes2'),
    },
    {
      id: 'nails3',
      text: t('Nail.qes3'),
    },
  ];
  const validateAnswers = () => {
    // 1. Check if at least one option is selected for any question (left OR right)
    const hasAnyAnswers = questions.some(
      question =>
        answers[question.id]?.left === true ||
        answers[question.id]?.right === true,
    );

    if (!hasAnyAnswers) {
      Alert.alert(
        t('Alert.title2'),
        t('Alert.text4'),
      );
      return false;
    }

    // 2. Check if at least one left foot and one right foot option is selected
    const hasLeftFootSelection = questions.some(
      question => answers[question.id]?.left === true,
    );
    const hasRightFootSelection = questions.some(
      question => answers[question.id]?.right === true,
    );

    if (!hasLeftFootSelection || !hasRightFootSelection) {
      Alert.alert(
        t('Alert.title2'),
        t('Alert.text3'),
      );
      return false;
    }

    // 3. Check if nails1 is checked (either left or right)
    const isNails1Checked = answers['nails1']?.left || answers['nails1']?.right;

    // 4. Check if nails2 and nails3 are not checked (both left and right)
    const areOtherQuestionsUnchecked = ['nails2', 'nails3'].every(
      questionId => !answers[questionId]?.left && !answers[questionId]?.right,
    );

    // 5. If nails1 is checked and other questions are unchecked, allow proceeding
    if (isNails1Checked && areOtherQuestionsUnchecked) {
      return true;
    }

    // if at least one left foot and one right foot option is selected, allow proceeding
    if (hasLeftFootSelection && hasRightFootSelection) {
      return true;
    }
    // 6. Otherwise, check if all questions have at least one checkbox selected (left or right)
    const isAllAnswered = questions.every(
      question =>
        answers[question.id]?.left !== undefined ||
        answers[question.id]?.right !== undefined,
    );

    if (!isAllAnswered) {
      Alert.alert(
        t('Alert.title2'),
        t('Alert.text2'),
      );
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateAnswers()) {
      return; // Stop if validation fails
    }

    setCurrentStep('deformity'); // Proceed to the next step
  };

  return (
    <>
      <Modal animationType="fade" transparent={true} visible={popUp}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              {t('Nail.inst')}
            </Text>
            <View style={{marginBottom: 15}}>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>{t('Nail.title1')}:</Text>{' '}
                {t('Nail.text1')}
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>{t('Nail.title2')}:</Text>{' '}
                {t('Nail.text2')}
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>{t('Nail.title3')}:</Text>{' '}
                {t('Nail.text3')}
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>{t('Nail.title4')}:</Text>{' '}
                {t('Nail.text4')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopUp(false)}>
              <Text style={styles.modalButtonText}>{t('Nail.btn1')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>{t('Nail.title8')}</Text>
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: '400',
            marginBottom: 20,
          }}>
          {t('Nail.text10')}
        </Text>
      </View>
      <View style={styles.heading}>
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 5}}
          onPress={() => setPopUp(true)}>
          <Icon name="questioncircle" size={22} color="black" />
          <Text style={styles.headingTxt}>{t('Nail.btn2')}</Text>
        </TouchableOpacity>
        <View style={styles.rightHeading}>
          <Text style={styles.headingTxt}>{t('Nail.title9')}</Text>
          <Text style={styles.headingTxt}>{t('Nail.title10')}</Text>
        </View>
      </View>
      {questions.map(item => (
        <View style={styles.heading} key={item.id}>
          <Text style={styles.questionTxt}>{item.text}</Text>
          <View style={styles.buttonGroup}>
            {/* Left Checkbox */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // If nails1 is being checked, uncheck all other left checkboxes
                if (item.id === 'nails1' && !answers[item.id]?.left) {
                  questions.forEach(question => {
                    if (question.id !== 'nails1') {
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
              disabled={answers['nails1']?.left && item.id !== 'nails1'}>
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.left && styles.checkboxChecked,
                  answers['nails1']?.left &&
                    item.id !== 'nails1' &&
                    styles.disabledCheckbox,
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
                // If nails1 is being checked, uncheck all other right checkboxes
                if (item.id === 'nails1' && !answers[item.id]?.right) {
                  questions.forEach(question => {
                    if (question.id !== 'nails1') {
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
              disabled={answers['nails1']?.right && item.id !== 'nails1'}>
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.right && styles.checkboxChecked,
                  answers['nails1']?.right &&
                    item.id !== 'nails1' &&
                    styles.disabledCheckbox,
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
          <Text style={styles.boldText}>
            {t('BasicQes.text3')} "{t('BasicQes.yes')}":
          </Text>
          {t('Nail.text8')} (<Text style={styles.checkmarkSymbol}>✓</Text>).
        </Text>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>
            {t('BasicQes.text3')} "{t('BasicQes.no')}":
          </Text>
          {t('Nail.text9')} (<Text style={styles.uncheckedSymbol}>◻</Text>).
        </Text>
      </View>
      <View style={styles.buttonWrapper}>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('skin')}>
        <Text style={styles.nextButtonText}>{t('Nail.btn3')}</Text>
      </TouchableOpacity>
       
      <TouchableOpacity
        style={[styles.nextButton]}
        onPress={handleNext}>
        <Text style={styles.nextButtonText}>{t('Nail.btn4')}</Text>
      </TouchableOpacity>
      </View>
    </>
  );
};

export default NailQuestion;

const styles = StyleSheet.create({
   buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },

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
    justifyContent: 'space-between',
  },
  questionTxt: {
    fontSize: 17,
    fontWeight: '400',
    maxWidth: '60%',
    textAlign: 'left',
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
    width: 160,
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
