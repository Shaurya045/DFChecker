import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';

const PedalQuestion = ({
  answers,
  handleAnswer,
  setCurrentStep,
  ipSwich,
  popUp,
  setPopUp,
}) => {
  const {t} = useTranslation();
  const questions = [
    {
      id: 'pedal',
      text: t('Pedal.qes1'),
    },
  ];
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
              {t('Pedal.inst')}
            </Text>
            <View style={{marginBottom: 15}}>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>{t('Pedal.title1')}:</Text>{' '}
                {t('Pedal.text1')}
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>{t('Pedal.title2')}:</Text>{' '}
                {t('Pedal.text2')}
              </Text>
              {/* Additional instructions for users */}
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>{t('Pedal.title3')}:</Text>{' '}
                {t('Pedal.text3')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopUp(false)}>
              <Text style={styles.modalButtonText}>{t('Skin.btn1')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>{t('Pedal.title8')}</Text>
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: '400',
            marginBottom: 20,
          }}>
          {t('Pedal.text10')}
        </Text>
      </View>
      <View style={styles.heading}>
        <TouchableOpacity
          style={{flexDirection: 'row', gap: 5}}
          onPress={() => setPopUp(true)}>
          <Icon name="questioncircle" size={22} color="black" />
          <Text style={styles.headingTxt}>{t('Skin.btn2')}</Text>
        </TouchableOpacity>
        <View style={styles.rightHeading}>
          <Text style={styles.headingTxt}>{t('Skin.title9')}</Text>
          <Text style={styles.headingTxt}>{t('Skin.title10')}</Text>
        </View>
      </View>
      {questions.map(item => (
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
              }>
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.left && styles.checkboxChecked,
                ]}>
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
              }>
              <View
                style={[
                  styles.checkbox,
                  answers[item.id]?.right && styles.checkboxChecked,
                ]}>
                {answers[item.id]?.right && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {/* Add "Yes" and "No" options below the question */}
      <View style={styles.yesNoContainer}>
        <Text style={styles.yesNoText}></Text>
        <Text style={styles.yesNoText}></Text>
      </View>
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
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() =>
          ipSwich ? setCurrentStep('ipSwich') : setCurrentStep('monofilamentQ')
        }>
        <Text style={styles.nextButtonText}>{t('Skin.btn3')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, {marginBottom: 40}]}
        onPress={() => setCurrentStep('rubor')}>
        <Text style={styles.nextButtonText}>{t('Skin.btn4')}</Text>
      </TouchableOpacity>
    </>
  );
};

export default PedalQuestion;

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
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkbox: {
    position: 'absolute',
    bottom: 5,
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
    padding: 0,
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 40,
    marginRight: 0,
    marginTop: -5,
  },
  yesNoText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  instructionBox: {
    marginTop: -20,
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
