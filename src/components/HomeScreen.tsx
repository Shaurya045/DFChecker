import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  SafeAreaView,
  Modal,
} from 'react-native';
import {colors} from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {url} from '../utils/constants';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: HomeProps) => {
  const [profile, setProfile] = useState({});
  const [showPulseModal, setShowPulseModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const getUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return null;
      }

      const response = await fetch(`${url}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        console.error('Failed to fetch profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  const handleTestButtonPress = () => {
    setShowConfirmation(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserProfile();
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.greetingButton}>
          <View style={styles.greetingContent}>
            <Text style={styles.greetingText}>Hello {profile?.name}</Text>
            <View style={styles.userIcon}>
              <View style={styles.userIconCircle} />
              <View style={styles.userIconBody} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraSection}>
        <Text style={styles.instructionText}>Take Diabetic Foot Test</Text>
        <View style={styles.arrowContainer}>
          <View style={styles.arrow} />
        </View>
        <TouchableOpacity
          onPress={handleTestButtonPress}
          style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Take Test</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.confirmationModalContainer}>
          <View style={styles.confirmationModalContent}>
            <View style={styles.confirmationHeader}>
              <View style={styles.confirmationIcon}>
                <Text style={styles.confirmationIconText}>🩺</Text>
              </View>
              <Text style={styles.confirmationTitle}>Pedal Pulse Verification</Text>
              <Text style={styles.confirmationSubtitle}>
                We need your pedal pulse results before proceeding with the assessment
              </Text>
            </View>
            
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.helpButton]}
                onPress={() => {
                  setShowConfirmation(false);
                  setShowPulseModal(true);
                }}
              >
                <Text style={styles.helpButtonText}>Show Me How</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.confirmButton]}
                onPress={() => {
                  setShowConfirmation(false);
                  navigation.navigate('Qes');
                }}
              >
                <Text style={styles.confirmButtonText}>I Have Results</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pulse Check Instructions Modal */}
      <Modal
        visible={showPulseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPulseModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.instructionModalContainer}>
            {/* Header with icon */}
            <View style={styles.modalHeader}>
              <View style={styles.pulseIconContainer}>
                <Text style={styles.pulseIcon}>💓</Text>
              </View>
              <Text style={styles.modalTitle}>Pedal Pulse Check Guide</Text>
            </View>

            {/* Content with step-by-step instructions */}
            <View style={styles.instructionContent}>
              {/* Step 1 */}
              <View style={styles.instructionStep}>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Top of Foot Check</Text>
                  <Text style={styles.stepDescription}>
                    Gently place two fingers on the top of your foot, between the bones 
                    just below the ankle (dorsalis pedis artery). Apply light pressure.
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.stepDivider} />

              {/* Step 2 */}
              <View style={styles.instructionStep}>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Inner Ankle Check</Text>
                  <Text style={styles.stepDescription}>
                    If you can't feel it on top, move your fingers to the inner ankle, 
                    just behind the bony prominence (posterior tibial artery).
                  </Text>
                </View>
              </View>

              {/* Important Note */}
              <View style={styles.noteContainer}>
                <Text style={styles.noteTitle}>Important Note</Text>
                <Text style={styles.noteText}>
                  If you're having difficulty finding the pulse or are unsure, please consult 
                  your healthcare provider. Accurate pulse detection is essential for proper assessment.
                </Text>
              </View>
            </View>

            {/* Footer with button */}
            <TouchableOpacity 
              style={styles.gotItButton}
              onPress={() => setShowPulseModal(false)}
            >
              <Text style={styles.gotItButtonText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  greetingContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  greetingButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 15,
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    color: '#fff',
    fontSize: 18,
  },
  userIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  userIconCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 6,
  },
  userIconBody: {
    width: 24,
    height: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
  },
  cameraSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  instructionText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  arrowContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  arrow: {
    width: 30,
    height: 30,
    borderColor: colors.primary,
    borderWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    transform: [{rotate: '45deg'}],
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },

  // Confirmation Modal Styles
  confirmationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  confirmationModalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmationHeader: {
    padding: 24,
    alignItems: 'center',
  },
  confirmationIcon: {
    backgroundColor: colors.primaryLight,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmationIconText: {
    fontSize: 28,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  confirmationButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  helpButton: {
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  helpButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  // Pulse Instruction Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionModalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  modalHeader: {
    padding: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
  },
  pulseIconContainer: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pulseIcon: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  instructionContent: {
    padding: 20,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stepIndicator: {
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  stepDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
    marginLeft: 42,
  },
  noteContainer: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E6A100',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  gotItButton: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: 'center',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  gotItButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HomeScreen;