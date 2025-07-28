import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
  StatusBar,
  PixelRatio,
} from 'react-native';
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
import Icon from 'react-native-vector-icons/AntDesign';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../AuthContext';
import PatientInfoForm from './PatientInfoForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CitationsButton from './CitationsButton';
import { 
  isTablet, 
  scaleFontSize, 
  getContentMaxWidth, 
  padding,
  getResponsiveWidth,
  getResponsiveHeight
} from '../utils/deviceUtils';
import { wp, hp } from '../utils/responsive';

type QesProps = NativeStackScreenProps<RootStackParamList, 'Qes'>;

// Define the step type to use throughout the component
type QuestionStep = 
  | 'patientInfo'
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
  | 'erythema';

const QuestionScreen = ({navigation}: QesProps) => {
  const [currentStep, setCurrentStep] = useState<QuestionStep>('patientInfo');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [popUp, setPopUp] = useState(false);
  const [ipSwich, setIpSwich] = useState(false);
  // Patient info is now stored directly in answers object
  const {t} = useTranslation();
  const {isDoctor} = useAuth();
  
  useEffect(() => {
    // If user is not a doctor, skip the patient info form
    if (!isDoctor) {
      setCurrentStep('initial');
    }
  }, [isDoctor]);

  const handleAnswer = (id: string, value: any) => {
    setAnswers(prev => ({...prev, [id]: value}));
  };

  // Create a wrapper function for setCurrentStep that accepts string and casts it to QuestionStep
  const handleSetCurrentStep = (step: string) => {
    setCurrentStep(step as QuestionStep);
  };

  // Patient info is now handled directly through the answers object
  // and the PatientInfoForm component will call setCurrentStep

  // Get dynamic window dimensions for orientation changes
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    // Add event listener for orientation changes
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });
    
    // Clean up event listener
    return () => subscription?.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        {/* Replace arrow symbol with home symbol */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.homeButton}>
          <Icon name="home" size={isTablet() ? 36 : 30} color="#000" /> {/* Home icon */}
        </TouchableOpacity>
        
        {/* Citation button in header for better alignment */}
        <CitationsButton 
          category={currentStep === 'sensation' || currentStep === 'monofilamentQ' ? 'sensation' : 
                   currentStep === 'pedal' || currentStep === 'rubor' || currentStep === 'erythema' ? 'vascular' : 
                   'general'} 
          style={styles.headerCitationButton}
          isDoctor={isDoctor} 
        />
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('Question.title')}</Text>
        </View>
        
        {currentStep === 'patientInfo' ? (
          <PatientInfoForm 
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'initial' ? (
          <BasicQuestions
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'skin' ? (
          <SkinQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'nail' ? (
          <NailQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'deformity' ? (
          <DeformityQestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'footwear' ? (
          <FootwearQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'tempCold' ? (
          <TempColdQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'tempHot' ? (
          <TempHotQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'motion' ? (
          <MotionQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'sensation' ? (
          <SensationQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'monofilament' ? (
          <Monofilament
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            setIpSwich={setIpSwich}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'monofilamentQ' ? (
          <MonofilamentQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'ipSwich' ? (
          <SensationIPswich
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'pedal' ? (
          <PedalQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            ipSwich={ipSwich}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'rubor' ? (
          <RuborQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
          />
        ) : null}
        {currentStep === 'erythema' ? (
          <ErythemaQuestion
            answers={answers}
            handleAnswer={handleAnswer}
            setCurrentStep={handleSetCurrentStep}
            popUp={popUp}
            setPopUp={setPopUp}
            navigation={navigation}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    zIndex: 1,
    height: isTablet() ? hp(7) : hp(8),
    width: '100%',
  },
  homeButton: {
    padding: wp(1.5),
    minWidth: wp(8),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: isTablet() ? wp(5) : wp(4),
  },
  scrollContent: {
    maxWidth: getContentMaxWidth(),
    alignSelf: 'center',
    width: '100%',
    paddingBottom: hp(3),
    paddingTop: hp(1.5),
    flexGrow: 1, // Ensures content can grow to fill space if smaller than screen
  },
  title: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    // Ensures text scales appropriately on smaller devices
    maxWidth: isTablet() ? wp(70) : wp(80),
  },
  citationsButton: {
    marginBottom: hp(2),
    alignSelf: 'center',
  },
  citationsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: hp(3),
    width: '100%',
  },
  headerCitationButton: {
    alignSelf: 'center',
    minWidth: wp(8),
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: hp(0.5), // Responsive margin for vertical alignment
  },
});

export default QuestionScreen;
