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

const questions = [
  {
    id: 'footwear1',
    text: 'After removal of the footwear are there any reddened ares on the foot?',
  },
  {
    id: 'footwear2',
    text: 'Shoes are inappropriate because they do not provide protection or support for the foot?',
  },
  {
    id: 'footwear3',
    text: 'Shoes are causing trauma (redness or ulceration)',
  },
];

const FootwearQuestion = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
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
                <Text style={{fontWeight: 'bold'}}>Fit & Comfort</Text>
                <View style={{paddingLeft: 6}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#333',
                    }}>
                    • Wear shoes and walk.
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#333',
                    }}>
                    • Check for a snug fit (not tight), space for toes, and
                    secure heel.
                  </Text>
                </View>
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>Protection & Support</Text>
                <View style={{paddingLeft: 6}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#333',
                    }}>
                    • Inspect materials: Are they durable and protective?
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#333',
                    }}>
                    • Ensure good cushioning, arch support, and slip-resistant
                    soles.
                  </Text>
                </View>
              </Text>
              <Text style={{fontSize: 15, fontWeight: '400', marginBottom: 7}}>
                <Text style={{fontWeight: 'bold'}}>Foot Check After Use</Text>
                <View style={{paddingLeft: 6}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#333',
                    }}>
                    • Wear shoes for a while.
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#333',
                    }}>
                    • After removing, check for redness, blisters, or pain.
                  </Text>
                </View>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPopUp(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.titleBox}>
        <Text style={styles.titleTxt}>Diabetic Foot Test - Footwear</Text>
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontWeight: '400',
            marginBottom: 20,
          }}>
          Look at the shoes what you are wearing
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
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('deformity')}>
        <Text style={styles.nextButtonText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, {marginBottom: 40}]}
        onPress={() => setCurrentStep('tempCold')}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};

export default FootwearQuestion;

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
    // justifyContent: 'space-between',
    gap: 30,
  },
  button: {
    // backgroundColor: '#e0e0e0',
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
    // marginBottom: 40,
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
});
