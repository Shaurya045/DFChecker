import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { isTablet, scaleFontSize, getContentMaxWidth, padding, getResponsiveWidth, getResponsiveHeight } from '../utils/deviceUtils';
import { wp, hp } from '../utils/responsive';
import {TextInput} from 'react-native-paper';
import {colors} from '../utils/colors';
import MediaPopup from './MediaPopUp';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {url} from '../utils/constants';
import {useTranslation} from 'react-i18next';

interface BasicQuestionsProps {
  answers: Record<string, any>;
  handleAnswer: (id: string, value: any) => void;
  setCurrentStep: (step: string) => void;
  popUp: boolean;
  setPopUp: (value: boolean) => void;
}

const BasicQuestions: React.FC<BasicQuestionsProps> = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [foot, setFoot] = useState('');
  const [footImage, setFootImage] = useState<{
    left: any | null;
    right: any | null;
  }>({left: null, right: null});
  const {t} = useTranslation();
  
  // Get responsive dimensions with dynamic updates
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    // Listen for orientation changes
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });
    
    // Cleanup
    return () => subscription?.remove();
  }, []);

  const initialQuestions = [
    {
      id: 'neurologicalDisease',
      text: t('BasicQes.qes1'),
      type: 'boolean',
    },
    {
      id: 'amputation',
      text: t('BasicQes.qes2'),
      type: 'boolean',
    },
    {
      id: 'amputationCount',
      text: t('BasicQes.qes3'),
      type: 'number',
      condition: (answers: Record<string, any>) => answers.amputation === true,
    },
    {
      id: 'smoking',
      text: t('BasicQes.qes4'),
      type: 'boolean',
    },
    {
      id: 'ulcer',
      text: t('BasicQes.qes5'),
      type: 'boolean',
    },
    {
      id: 'renalFailure',
      text: t('BasicQes.qes6'),
      type: 'boolean',
    },
  ];

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions through Info.plist
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Camera permission is required to take photos',
      );
      return;
    }

    try {
      const img = await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        avoidEmptySpaceAroundImage: true,
        freeStyleCropEnabled: true,
      });
      
      if (foot === 'Left') {
        setFootImage({...footImage, left: img});
      } else {
        setFootImage({...footImage, right: img});
      }
    } catch (error) {
      console.log('Camera error:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setIsPopupVisible(false);
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const img = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        avoidEmptySpaceAroundImage: true,
        freeStyleCropEnabled: true,
      });
      
      if (foot === 'Left') {
        setFootImage({...footImage, left: img});
      } else {
        setFootImage({...footImage, right: img});
      }
    } catch (error) {
      console.log('Gallery error:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setIsPopupVisible(false);
    }
  };

  const submitImage = async () => {
    if ((!footImage.left || !footImage.right) && (answers.ulcer === true)) {
      Alert.alert('Error', 'Both foot images are required');
      return;
    }

    const formData = new FormData();
    formData.append('imageL', {
      uri: footImage.left.sourceURL,
      name: 'left-foot.jpg',
      type: footImage.left.mime,
    });
    formData.append('imageR', {
      uri: footImage.right.sourceURL,
      name: 'right-foot.jpg',
      type: footImage.right.mime,
    });

    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
      console.log(footImage);
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await fetch(`${url}/upload-images`, {
        method: 'POST',
        headers: {
        'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const result = await response.json();
      setCurrentStep('skin');
      console.log('Upload success:', result);
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Error', 'Failed to upload images');
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          console.error('No token found. Please log in.');
          return null;
        }
        let response = await fetch(`${url}/list`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let data = await response.json();
        if (data.data.imageL) {
          setFootImage({
            ...footImage,
            left: data.data.imageL,
            right: data.data.imageR,
          });
        }

        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching images:', error.message);
        } else {
          console.error('Error fetching images:', error);
        }
      }
    };

    fetchImages();
  }, []);

  const renderQuestion = (question: any) => {
    if (question.condition && !question.condition(answers)) {
      return null;
    }

    switch (question.type) {
      case 'boolean':
        return (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.question}>{question.text}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.button,
                  answers[question.id] === true && styles.selectedButton,
                ]}
                onPress={() => {
                  // Toggle the Yes button
                  const currentValue = answers[question.id];
                  handleAnswer(
                    question.id,
                    currentValue === true ? undefined : true,
                  );
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    answers[question.id] === true && styles.selectedButtonText,
                  ]}>
                  {t('BasicQes.y')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  answers[question.id] === false && styles.selectedButton,
                ]}
                onPress={() => {
                  // Toggle the No button
                  const currentValue = answers[question.id];
                  handleAnswer(
                    question.id,
                    currentValue === false ? undefined : false,
                  );
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    answers[question.id] === false && styles.selectedButtonText,
                  ]}>
                  {t('BasicQes.n')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'number':
        return (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.question}>{question.text}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={answers[question.id]?.toString() || ''}
              onChangeText={value => handleAnswer(question.id, value)}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const validateAnswers = () => {
    // Check if all required questions are answered
    const requiredQuestions = initialQuestions.filter(
      q => !q.condition || q.condition(answers),
    );
    const isAllAnswered = requiredQuestions.every(
      q => answers[q.id] !== undefined,
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

    setPopUp(true);
    if ((!footImage.left || !footImage.right) && answers.ulcer) {
      setCurrentStep('initial');
      Alert.alert(
        t('Alert.title3'),
        t('Alert.text5'),
      );
    }
    else if (answers.ulcer && footImage.left && footImage.right) {
      submitImage();
      
    }
    else if (!answers.ulcer) {
      setCurrentStep('skin');
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{t('BasicQes.title')}</Text>
      </View>
      {initialQuestions.map(renderQuestion)}

      {answers.ulcer && (
        <>
          <View style={styles.cameraContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                setIsPopupVisible(true);
                setFoot('Left');
              }}>
              <Text style={[styles.buttonText, {color: 'white'}]}>
                {t('BasicQes.btn1')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                setIsPopupVisible(true);
                setFoot('Right');
              }}>
              <Text style={[styles.buttonText, {color: 'white'}]}>
                {t('BasicQes.btn2')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imgContainer}>
            {footImage.left && (
              <View style={styles.imageContainer}>
                <Text style={styles.footImageLabel}>
                  {t('BasicQes.text1')}:
                </Text>
                <Image
                  source={{
                    uri:
                      footImage.left.path != null
                        ? footImage.left.path
                        : footImage.left,
                  }}
                  style={styles.footImage}
                />
              </View>
            )}

            {footImage.right && (
              <View style={styles.imageContainer}>
                <Text style={styles.footImageLabel}>
                  {t('BasicQes.text2')}:
                </Text>
                <Image
                  source={{
                    uri:
                      footImage.right.path != null
                        ? footImage.right.path
                        : footImage.right,
                  }}
                  style={styles.footImage}
                />
              </View>
            )}
          </View>
        </>
      )}

      <MediaPopup
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        onTakePhoto={handleTakePhoto}
        onChooseFromGallery={handleChooseFromGallery}
      />
      {/* Add instructions for checkbox interaction */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>
            {t('BasicQes.text3')} "{t('BasicQes.yes')}":
          </Text>
          <Text> {t('BasicQes.text4')}</Text>
        </Text>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>
            {t('BasicQes.text3')} "{t('BasicQes.no')}":
          </Text>
          <Text> {t('BasicQes.text5')}</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{t('BasicQes.btn3')}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: wp(2.5),
    marginBottom: hp(3),
  },
  headerText: {
    color: 'white',
    fontSize: scaleFontSize(20),
    fontWeight: '600',
    textAlign: 'center',
    padding: hp(1),
  },
  title: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    marginBottom: hp(2.5),
    textAlign: 'center',
  },
  questionContainer: {
    flexDirection: 'row',
    marginBottom: hp(2.5),
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: getContentMaxWidth(),
    width: '100%',
  },
  question: {
    fontSize: scaleFontSize(17),
    marginBottom: hp(1),
    maxWidth: isTablet() ? '65%' : '60%',
    textAlign: 'left',
    flexShrink: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: wp(4),
    minWidth: wp(20),
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 0,
    borderRadius: wp(10),
    width: wp(isTablet() ? 7 : 8),
    height: wp(isTablet() ? 7 : 8),
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
    fontSize: scaleFontSize(16),
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
  },
  input: {
    height: hp(isTablet() ? 6 : 5),
    width: isTablet() ? wp(35) : wp(40),
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: wp(2),
    fontSize: scaleFontSize(14),
    minWidth: wp(20),
  },
  cameraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp(2.5),
    width: '100%',
    alignSelf: 'center',
    maxWidth: getContentMaxWidth(),
  },
  cameraButton: {
    backgroundColor: '#2196F3',
    padding: wp(2.5),
    borderRadius: wp(1),
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(3),
    width: '100%',
    maxWidth: getContentMaxWidth(),
  },
  imageContainer: {
    marginBottom: hp(1),
    alignItems: 'center',
  },
  footImageLabel: {
    marginBottom: hp(0.5),
    fontSize: scaleFontSize(14),
    fontWeight: '500',
  },
  footImage: {
    width: isTablet() ? wp(25) : wp(40),
    height: isTablet() ? wp(25) : wp(40),
    resizeMode: 'contain',
    borderRadius: wp(1),
  },
  nextButton: {
    backgroundColor: colors.primary,
    padding: hp(2),
    borderRadius: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2.5),
    maxWidth: getContentMaxWidth(),
    width: '100%',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
  },
  instructionBox: {
    marginTop: hp(1),
    marginBottom: hp(2),
    width: '100%',
    maxWidth: getContentMaxWidth(),
  },
  instructionText: {
    fontSize: scaleFontSize(16),
    fontWeight: '400',
    color: '#555',
    marginBottom: hp(0.8),
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

export default BasicQuestions;
