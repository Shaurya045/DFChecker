import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {initialQuestions} from '../utils/questions';
import {colors} from '../utils/colors';
import MediaPopup from './MediaPopUp';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {url} from '../utils/constants';

const {high, wide} = Dimensions.get('window');

const BasicQuestions = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [foot, setFoot] = useState('');
  const [footImage, setFootImage] = useState<{
    left: string | null;
    right: string | null;
  }>({left: null, right: null});

  const handleTakePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      avoidEmptySpaceAroundImage: true,
      freeStyleCropEnabled: true,
    }).then(img => {
      if (foot === 'Left') {
        setFootImage({...footImage, left: img});
      } else {
        setFootImage({...footImage, right: img});
      }
      setIsPopupVisible(false);
    });
  };

  const handleChooseFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      avoidEmptySpaceAroundImage: true,
      freeStyleCropEnabled: true,
    }).then(img => {
      if (foot === 'Left') {
        setFootImage({...footImage, left: img});
      } else {
        setFootImage({...footImage, right: img});
      }
      setIsPopupVisible(false);
    });
  };

  const submitImage = async () => {
    if (!footImage.left || !footImage.right) {
      console.error('Both images are required.');
      return;
    }

    const formData = new FormData();
    formData.append('imageL', {
      uri: footImage.left.path,
      name: 'left-foot.jpg',
      type: footImage.left.mime,
    });
    formData.append('imageR', {
      uri: footImage.right.path,
      name: 'right-foot.jpg',
      type: footImage.right.mime,
    });

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.error('No token found. Please log in.');
        return null;
      }
      let response = await fetch(`${url}/upload-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error uploading images:', error);
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
        console.error('Error fetching images:', error.message);
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
                  handleAnswer(question.id, currentValue === true ? undefined : true);
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    answers[question.id] === true && styles.selectedButtonText,
                  ]}>
                  Y
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
                  handleAnswer(question.id, currentValue === false ? undefined : false);
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    answers[question.id] === false && styles.selectedButtonText,
                  ]}>
                  N
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
        'Incomplete Form',
        'Please answer all the questions before proceeding.',
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
    submitImage();
    setCurrentStep('skin');
    if ((footImage.left || footImage.right) && answers.ulcer) {
      Alert.alert(
        'Image uploaded successfully',
        'Your image will be analyzed by AI and report will be generated in 24 hours.',
      );
    }
  };

  return (
    <>
      <View
        style={{
          width: '100%',
          backgroundColor: colors.primary,
          borderRadius: 10,
          marginBottom: 30,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'semibold',
            textAlign: 'center',
            padding: 8,
          }}>
          Pre Screening Questions
        </Text>
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
                Take Photo of Left Foot
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => {
                setIsPopupVisible(true);
                setFoot('Right');
              }}>
              <Text style={[styles.buttonText, {color: 'white'}]}>
                Take Photo of Right Foot
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imgContainer}>
            {footImage.left && (
              <View style={styles.imageContainer}>
                <Text style={{marginBottom: 5, fontSize: 14, fontWeight: 500}}>
                  Left Foot Image:
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
                <Text style={{marginBottom: 5, fontSize: 14, fontWeight: 500}}>
                  Right Foot Image:
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
          <Text style={styles.boldText}>For "Yes":</Text> 
          <Text> Click the (Y). Click again to deselect.</Text> 
        </Text>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>For "No":</Text> 
          <Text> Click the (N). Click again to deselect.</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  question: {
    fontSize: 17,
    marginBottom: 10,
    maxWidth: '60%',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#e0e0e0',
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
  input: {
    height: 40,
    width: '40%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  cameraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: wide,
  },
  cameraButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: wide,
  },
  imageContainer: {
    marginBottom: 5,
    alignItems: 'center',
  },
  footImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
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

export default BasicQuestions;