import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
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
      // console.log(img);
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
      // console.log(img);
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
      // Retrieve the token from AsyncStorage
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
    // Fetch images from the backend
    const fetchImages = async () => {
      try {
        // Retrieve the token from AsyncStorage
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
        // console.log(data.data.imageL); // Log the data received
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
                onPress={() => handleAnswer(question.id, true)}>
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
                onPress={() => handleAnswer(question.id, false)}>
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

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => {
          setCurrentStep('skin');
          setPopUp(true);
          submitImage();
        }}>
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
  cameraView: {
    height: 300,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraBtnContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  cameraBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  footQuestionContainer: {
    marginBottom: 15,
  },
  footQuestion: {
    fontSize: 16,
    marginBottom: 5,
  },
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  checkedBox: {
    backgroundColor: colors.primary,
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
});

export default BasicQuestions;
