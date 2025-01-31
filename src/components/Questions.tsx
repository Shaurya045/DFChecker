import React, {useState} from 'react';
import {Text, StyleSheet, ScrollView} from 'react-native';
import BasicQuestions from './BasicQuestions';
import SkinQuestion from './SkinQuestion';
import NailQuestion from './NailQuestion';
import DeformityQestion from './DeformityQestion';
import FootwearQuestion from './FootwearQuestion';
import TempColdQuestion from './TempColdQuestion';
import TempHotQuestion from './TempHotQuestion';
import MotionQuestion from './MotionQuestion';
import SensationQuestion from './SensationQuestion';
import SensationIPswich from './SensationIPswich';
import PedalQuestion from './PedalQuestion';
import RuborQuestion from './RuborQuestion';
import ErythemaQuestion from './ErythemaQuestion';
import Monofilament from './Monofilament';
import MonofilamentQuestion from './MonofilamentQuestion';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type QesProps = NativeStackScreenProps<RootStackParamList, 'Qes'>;

const QuestionScreen = ({navigation}: QesProps) => {
  const [currentStep, setCurrentStep] = useState<
    | 'initial'
    | 'nail'
    | 'deformity'
    | 'skin'
    | 'footwear'
    | 'tempCold'
    | 'tempHot'
    | 'motion'
    | 'sensation'
    | 'monofilament'
    | 'monofilamentQ'
    | 'ipSwich'
    | 'pedal'
    | 'rubor'
    | 'erythema'
  >('initial');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [popUp, setPopUp] = useState(false);
  const [ipSwich, setIpSwich] = useState(false);

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
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'skin' ? (
        <SkinQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'nail' ? (
        <NailQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'deformity' ? (
        <DeformityQestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'footwear' ? (
        <FootwearQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'tempCold' ? (
        <TempColdQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'tempHot' ? (
        <TempHotQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'motion' ? (
        <MotionQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'sensation' ? (
        <SensationQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'monofilament' ? (
        <Monofilament
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          setIpSwich={setIpSwich}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'monofilamentQ' ? (
        <MonofilamentQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'ipSwich' ? (
        <SensationIPswich
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'pedal' ? (
        <PedalQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          ipSwich={ipSwich}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'rubor' ? (
        <RuborQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
        />
      ) : null}
      {currentStep === 'erythema' ? (
        <ErythemaQuestion
          answers={answers}
          handleAnswer={handleAnswer}
          setCurrentStep={setCurrentStep}
          popUp={popUp}
          setPopUp={setPopUp}
          navigation={navigation}
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
