import React, {useState} from 'react';
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

const {high, wide} = Dimensions.get('window');

const BasicQuestions = ({answers, handleAnswer, setCurrentStep}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [image, setImage] = useState('');
  const [footImage, setFootImage] = useState<{
    left: string | null;
    right: string | null;
  }>({left: null, right: null});

  const handleTakePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(img => {
      console.log(image);
      setImage(img.path);
      setIsPopupVisible(false);
    });
  };

  const handleChooseFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(img => {
      console.log(image);
      setImage(img.path);
      setIsPopupVisible(false);
    });
  };

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
                  Yes
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
                  No
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
      {initialQuestions.map(renderQuestion)}

      {answers.ulcer && (
        <View style={styles.cameraContainer}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => setIsPopupVisible(true)}>
            <Text style={[styles.buttonText, {color: 'white'}]}>
              Take Photo of Left Foot
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => setIsPopupVisible(true)}>
            <Text style={[styles.buttonText, {color: 'white'}]}>
              Take Photo of Right Foot
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {footImage.left && (
        <View style={styles.imageContainer}>
          <Text>Left Foot Image:</Text>
          <Image source={{uri: footImage.left}} style={styles.footImage} />
        </View>
      )}

      {footImage.right && (
        <View style={styles.imageContainer}>
          <Text>Right Foot Image:</Text>
          <Image source={{uri: footImage.right}} style={styles.footImage} />
        </View>
      )}

      <MediaPopup
        isVisible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        onTakePhoto={handleTakePhoto}
        onChooseFromGallery={handleChooseFromGallery}
      />

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('rightFoot')}>
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
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
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
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  footImage: {
    width: 200,
    height: 200,
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
