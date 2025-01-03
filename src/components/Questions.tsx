import React, {useState} from 'react';
import {Text, StyleSheet, ScrollView} from 'react-native';
import BasicQuestions from './BasicQuestions';
import RightFootQuestions from './RightFootQuestions';
import LeftFootQuestions from './LeftFootQuestions';

const QuestionScreen = () => {
  const [currentStep, setCurrentStep] = useState<
    'initial' | 'rightFoot' | 'leftFoot'
  >('initial');
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswer = (id: string, value: any) => {
    setAnswers(prev => ({...prev, [id]: value}));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Foot Health Questionnaire</Text>
      {currentStep === 'initial' ? (
        <BasicQuestions
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
        />
      ) : null}
      {currentStep === 'rightFoot' ? (
        <RightFootQuestions
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
        />
      ) : null}
      {currentStep === 'leftFoot' ? (
        <LeftFootQuestions
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
        />
      ) : null}
    </ScrollView>
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
});

export default QuestionScreen;
