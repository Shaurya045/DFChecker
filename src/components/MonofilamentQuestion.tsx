import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../utils/colors';
import {useTranslation} from 'react-i18next';

type MonofilamentAnswers = {
  [key: string]: {
    left?: boolean;
    right?: boolean;
  };
};

type MonofilamentQuestionProps = {
  answers: MonofilamentAnswers;
  handleAnswer: (key: string, value: { left?: boolean; right?: boolean }) => void;
  setCurrentStep: (step: string) => void;
  popUp: boolean;
  setPopUp: (value: boolean) => void;
};

const MonofilamentQuestion = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}: MonofilamentQuestionProps) => {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const {t} = useTranslation();

  const questions = [
    {
      id: 'monofilament1',
      text: t('MonofilamentQes.qes1'),
    },
    {
      id: 'monofilament2',
      text: t('MonofilamentQes.qes2'),
    },
    {
      id: 'monofilament3',
      text: t('MonofilamentQes.qes3'),
    },
  ];

  const handleLeftCheckbox = (itemId: string) => {
    const newAnswers = {...answers};
    // Uncheck all left checkboxes first
    questions.forEach(q => {
      newAnswers[q.id] = {
        ...newAnswers[q.id],
        left: false
      };
    });
    // Toggle the selected checkbox
    newAnswers[itemId] = {
      ...newAnswers[itemId],
      left: !answers[itemId]?.left
    };
    // Update state
    Object.keys(newAnswers).forEach(key => {
      handleAnswer(key, newAnswers[key]);
    });
  };

  const handleRightCheckbox = (itemId: string) => {
    const newAnswers = {...answers};
    // Uncheck all right checkboxes first
    questions.forEach(q => {
      newAnswers[q.id] = {
        ...newAnswers[q.id],
        right: false
      };
    });
    // Toggle the selected checkbox
    newAnswers[itemId] = {
      ...newAnswers[itemId],
      right: !answers[itemId]?.right
    };
    // Update state
    Object.keys(newAnswers).forEach(key => {
      handleAnswer(key, newAnswers[key]);
    });
  };

  return (
    <>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>{t('MonofilamentQes.title8')}</Text>
      </View>
      <View>
        <Text style={styles.descriptionText}>
          {t('MonofilamentQes.text3')}
        </Text>
        <Text style={[styles.descriptionText, {marginBottom: 20}]}>
          {t('MonofilamentQes.text4')}
        </Text>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => setIsImageVisible(true)}>
          <Text style={styles.imageButtonText}>
            {t('MonofilamentQes.btn1')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Header with Left/Right labels */}
      <View style={styles.heading}>
        <Text style={styles.headingTxt}>{t('MonofilamentQes.text1')}</Text>
        <View style={styles.rightHeading}>
          <Text style={styles.headingTxt}>{t('MonofilamentQes.text2')}</Text>
          <Text style={[styles.headingTxt, {marginLeft: 25}]}>
            {t('MonofilamentQes.text5')}
          </Text>
        </View>
      </View>

      {/* Questions with checkboxes */}
      {questions.map(item => (
        <View style={styles.questionRow} key={item.id}>
          <Text style={styles.questionTxt}>{item.text}</Text>
          <View style={styles.checkboxGroup}>
            {/* Left Checkbox */}
            <TouchableOpacity
              onPress={() => handleLeftCheckbox(item.id)}
              style={styles.checkboxWrapper}>
              <View style={[
                styles.checkbox,
                answers[item.id]?.left && styles.checkboxChecked
              ]}>
                {answers[item.id]?.left && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>

            {/* Right Checkbox */}
            <TouchableOpacity
              onPress={() => handleRightCheckbox(item.id)}
              style={[styles.checkboxWrapper, {marginLeft: 25}]}>
              <View style={[
                styles.checkbox,
                answers[item.id]?.right && styles.checkboxChecked
              ]}>
                {answers[item.id]?.right && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Navigation buttons */}
      <View style={styles.buttonWrapper}>
        
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('sensation')}>
        <Text style={styles.nextButtonText}>{t('Skin.btn3')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton]}
        onPress={() => setCurrentStep('pedal')}>
        <Text style={styles.nextButtonText}>{t('Skin.btn4')}</Text>
      </TouchableOpacity>
      </View>

      {/* Pop-up for additional information */}

      {/* Image modal */}
      <Modal
        visible={isImageVisible}
        transparent={true}
        onRequestClose={() => setIsImageVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('../assets/monofilament-6.png')}
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsImageVisible(false)}>
              <Text style={styles.modalButtonText}>{t('Skin.btn1')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MonofilamentQuestion;

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
    paddingVertical: 12,
  },
  titleTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  descriptionText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  headingTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
     justifyContent: 'space-between',
  },
  rightHeading: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 120,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionTxt: {
    fontSize: 17,
    fontWeight: '400',
    maxWidth: '60%',
    textAlign: 'left',
  },
  checkboxGroup: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'flex-end',
  },
  checkboxWrapper: {
    padding: 8,
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: 160,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});