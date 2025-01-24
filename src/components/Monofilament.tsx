import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../utils/colors';

const Monofilament = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
  return (
    <>
      <Modal animationType="fade" transparent={false} visible={popUp}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: '600',
                marginBottom: 10,
              }}>
              Instructions
            </Text> */}
            <View style={{marginBottom: 15}}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '400',
                  marginBottom: 7,
                  color: 'white',
                }}>
                Before taking the next assessment, please confirm below.
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '400',
                  color: 'white',
                  marginBottom: 10,
                }}>
                Are you aware of monofilament test and have monofilament with
                you now to take test?
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setPopUp(false);
                  setCurrentStep('monofilamentQ');
                }}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setPopUp(false);
                  setCurrentStep('ipSwich');
                }}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Monofilament;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    width: '45%',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  modalButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
