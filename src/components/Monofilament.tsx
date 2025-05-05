import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../utils/colors';
import { useTranslation } from 'react-i18next';

const Monofilament = ({
  answers,
  handleAnswer,
  setCurrentStep,
  setIpSwich,
  popUp,
  setPopUp,
}) => {
  const {t} = useTranslation();
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
                {t('Monofilament.text1')}
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '400',
                  color: 'white',
                  marginBottom: 10,
                }}>
                {t('Monofilament.text2')}
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setPopUp(false);
                  setCurrentStep('monofilamentQ');
                  setIpSwich(false);
                }}>
                <Text style={styles.modalButtonText}>{t('Monofilament.btn1')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setPopUp(false);
                  setCurrentStep('ipSwich');
                  setIpSwich(true);
                }}>
                <Text style={styles.modalButtonText}>{t('Monofilament.btn2')}</Text>
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
