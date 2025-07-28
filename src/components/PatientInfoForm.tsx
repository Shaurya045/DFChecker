import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {colors} from '../utils/colors';
import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';

interface PatientInfoFormProps {
  answers: Record<string, any>;
  handleAnswer: (id: string, value: any) => void;
  setCurrentStep: (step: string) => void;
  popUp: boolean;
  setPopUp: (value: boolean) => void;
}

// Patient info fields are now handled through the answers object

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({
  answers,
  handleAnswer,
  setCurrentStep,
  popUp,
  setPopUp,
}) => {
  const {t} = useTranslation();
  
  // Define the questions for patient information
  const patientQuestions = [
    {
      id: 'patientName',
      text: t('PatientInfoForm.patientName'),
      type: 'text',
      required: true,
    },
    {
      id: 'patientAge',
      text: t('PatientInfoForm.age'),
      type: 'number',
      required: true,
    },
    {
      id: 'patientGender',
      text: t('PatientInfoForm.gender'),
      type: 'gender-buttons',
      required: true,
    },
    {
      id: 'patientContact',
      text: t('PatientInfoForm.contactNumber'),
      type: 'phone',
      required: true,
    }
  ];

  const validateAnswers = () => {
    // Check if all required questions are answered
    const requiredQuestions = patientQuestions.filter(q => q.required);
    const isAllAnswered = requiredQuestions.every(
      q => answers[q.id] !== undefined && answers[q.id] !== '',
    );

    if (!isAllAnswered) {
      Alert.alert(
        t('PatientInfoForm.missingInfoTitle'),
        t('PatientInfoForm.missingInfoMessage'),
      );
      return false;
    }

    return true;
  };

  // No longer loading patient info from storage

  const handleNext = () => {
    if (!validateAnswers()) {
      return; // Stop if validation fails
    }

    // No longer saving patient info to storage
    setPopUp(true);
    // Move to the next step
    setCurrentStep('initial');
  };

  // Render different types of questions
  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.question}>{question.text}</Text>
            <TextInput
              style={styles.input}
              value={answers[question.id] || ''}
              onChangeText={(value) => handleAnswer(question.id, value)}
              placeholder={`Enter ${question.text.toLowerCase()}`}
            />
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
              onChangeText={(value) => handleAnswer(question.id, value)}
              placeholder={`Enter ${question.text.toLowerCase()}`}
            />
          </View>
        );
      case 'gender-buttons':
        return (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.question}>{question.text}</Text>
            <View style={styles.genderButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  answers[question.id] === 'male' && styles.selectedGenderButton
                ]}
                onPress={() => handleAnswer(question.id, 'male')}>
                <Text style={[
                  styles.genderButtonText,
                  answers[question.id] === 'male' && styles.selectedGenderButtonText
                ]}>{t('PatientInfoForm.male')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  answers[question.id] === 'female' && styles.selectedGenderButton
                ]}
                onPress={() => handleAnswer(question.id, 'female')}>
                <Text style={[
                  styles.genderButtonText,
                  answers[question.id] === 'female' && styles.selectedGenderButtonText
                ]}>{t('PatientInfoForm.female')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'phone':
        return (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.question}>{question.text}</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={answers[question.id] || ''}
              onChangeText={(value) => handleAnswer(question.id, value)}
              placeholder={`Enter ${question.text.toLowerCase()}`}
            />
          </View>
        );
      case 'textarea':
        return (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.question}>{question.text}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={answers[question.id] || ''}
              onChangeText={(value) => handleAnswer(question.id, value)}
              placeholder={`Enter ${question.text.toLowerCase()}`}
              multiline
              numberOfLines={4}
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
          {t('PatientInfoForm.title')}
        </Text>
      </View>
      
      {patientQuestions.map(renderQuestion)}
      
      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          <Text style={styles.boldText}>{t('PatientInfoForm.note')}</Text>
          <Text> {t('PatientInfoForm.requiredFields')}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{t('PatientInfoForm.continueButton')}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 17,
    marginBottom: 10,
    textAlign: 'left',
    color: '#344055',
  },
  input: {
    height: 40,
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedGenderButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderButtonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedGenderButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
});

export default PatientInfoForm;
