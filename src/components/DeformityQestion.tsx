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
import {useTranslation} from 'react-i18next';

const DeformityQestion = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
  const {t} = useTranslation();
  const questions = [
    {
      id: 'deformity1',
      text: t('Deformity.qes1'),
    },
    {
      id: 'deformity2',
      text: t('Deformity.qes2'),
    },
    {
      id: 'deformity3',
      text: t('Deformity.qes3'),
    },
    {
      id: 'deformity4',
      text: t('Deformity.qes4'),
    },

  ];
  const validateAnswers = () => {
    // 1. Check if at least one option is selected for any question
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

    // 3. Check if deformity1 is checked for at least one foot
    const isDeformity1Checked =
      answers['deformity1']?.left || answers['deformity1']?.right;

    // 4. Check if any other deformity is checked for the other foot
    const isOtherDeformityChecked = [
      'deformity2',
      'deformity3',
      'deformity4',
    ].some(
      questionId => answers[questionId]?.left || answers[questionId]?.right,
    );

    // 5. If deformity1 is checked for one foot and another deformity is checked for the other foot, allow proceeding
    if (isDeformity1Checked && isOtherDeformityChecked) {
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

    setCurrentStep('footwear'); // Proceed to the next step
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
              Instructions
            </Text>
            <View style={{marginBottom: 15}}>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>
                  {t('Deformity.title1')}:
                </Text>{' '}
                {t('Deformity.text1')}
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>
                  {t('Deformity.title2')}:
                </Text>{' '}
                {t('Deformity.text2')}
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>
                  {t('Deformity.title3')}:
                </Text>{' '}
                {t('Deformity.text3')}
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>
                  {t('Deformity.title4')}:
                </Text>{' '}
                {t('Deformity.text4')}
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                <Text style={{fontWeight: 'bold'}}>
                  {t('Deformity.title5')}:
                </Text>{' '}
                {t('Deformity.text5')}
              </Text>
            </View>
            <Text style={{fontWeight: 'bold', marginBottom: 10}}>
              {t('Deformity.title6')}:
            </Text>
            <Image
              source={require('../assets/deformity.jpeg')}
              style={{height: 150, width: 220, marginBottom: 20}}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopUp(false)}>
              <Text style={styles.modalButtonText}>{t('Deformity.btn1')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>{t('Deformity.title8')}</Text>
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: '400',
            marginBottom: 20,
          }}>
          {t('Deformity.text10')}
        </Text>
      </View>
      <View style={styles.heading}>
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 5}}
          onPress={() => setPopUp(true)}>
          <Icon name="questioncircle" size={22} color="black" />
          <Text style={styles.headingTxt}>{t('Deformity.btn2')}</Text>
        </TouchableOpacity>
        <View style={styles.rightHeading}>
          <Text style={styles.headingTxt}>{t('Deformity.title9')}</Text>
          <Text style={styles.headingTxt}>{t('Deformity.title10')}</Text>
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
    // If deformity1 or deformity4 is being checked, uncheck all other left checkboxes
    if (
      (item.id === 'deformity1' || item.id === 'deformity4') &&
      !answers[item.id]?.left
    ) {
      questions.forEach(question => {
        if (
          question.id !== 'deformity1' &&
          question.id !== 'deformity4'
        ) {
          handleAnswer(question.id, {
            ...answers[question.id],
            left: false,
          });
        }
      });
      // Also uncheck the other special deformity checkbox if it's not the current one
      const otherDeformity =
        item.id === 'deformity1' ? 'deformity4' : 'deformity1';
      handleAnswer(otherDeformity, {
        ...answers[otherDeformity],
        left: false,
      });
    }
    // Toggle the current checkbox
    handleAnswer(item.id, {
      ...answers[item.id],
      left: !answers[item.id]?.left,
    });
  }}
  disabled={
    // Disable all except deformity4 when deformity1 is selected
    (answers['deformity1']?.left && item.id !== 'deformity1') ||
    // Disable all except deformity1 when deformity4 is selected
    (answers['deformity4']?.left && item.id !== 'deformity4')
  }>
  <View
    style={[
      styles.checkbox,
      answers[item.id]?.left && styles.checkboxChecked,
      // Apply disabled style based on the same conditions
      ((answers['deformity1']?.left && item.id !== 'deformity1') ||
      (answers['deformity4']?.left && item.id !== 'deformity4'))
        ? styles.disabledCheckbox
        : null,
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
    // If deformity1 or deformity4 is being checked, uncheck all other right checkboxes
    if (
      (item.id === 'deformity1' || item.id === 'deformity4') &&
      !answers[item.id]?.right
    ) {
      questions.forEach(question => {
        if (
          question.id !== 'deformity1' &&
          question.id !== 'deformity4'
        ) {
          handleAnswer(question.id, {
            ...answers[question.id],
            right: false,
          });
        }
      });
      // Also uncheck the other special deformity checkbox if it's not the current one
      const otherDeformity =
        item.id === 'deformity1' ? 'deformity4' : 'deformity1';
      handleAnswer(otherDeformity, {
        ...answers[otherDeformity],
        right: false,
      });
    }
    // Toggle the current checkbox
    handleAnswer(item.id, {
      ...answers[item.id],
      right: !answers[item.id]?.right,
    });
  }}
  disabled={
    // Disable all except deformity1 when deformity1 is selected
    (answers['deformity1']?.right && item.id !== 'deformity1') ||
    // Disable all except deformity4 when deformity4 is selected
    (answers['deformity4']?.right && item.id !== 'deformity4')
  }>
  <View
    style={[
      styles.checkbox,
      answers[item.id]?.right && styles.checkboxChecked,
      // Apply disabled style based on the same conditions
      ((answers['deformity1']?.right && item.id !== 'deformity1') ||
       (answers['deformity4']?.right && item.id !== 'deformity4'))
        ? styles.disabledCheckbox
        : null,
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
          {t('Skin.text8')} (<Text style={styles.checkmarkSymbol}>✓</Text>).
        </Text>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>
            {t('BasicQes.text3')} "{t('BasicQes.no')}":
          </Text>
          {t('Skin.text9')} (<Text style={styles.uncheckedSymbol}>◻</Text>).
        </Text>
      </View>
      <View style={styles.buttonWrapper}>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('nail')}>
        <Text style={styles.nextButtonText}>{t('Skin.btn3')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton]}
        onPress={handleNext}>
        <Text style={styles.nextButtonText}>{t('Skin.btn4')}</Text>
      </TouchableOpacity>
      </View>
    </>
  );
};

export default DeformityQestion;

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
    bottom: 4,
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
