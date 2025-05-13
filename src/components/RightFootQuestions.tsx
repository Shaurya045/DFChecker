import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FootConditionGrid from './RightFootGrid';
import {rightFootQuestions} from '../utils/questions';
import {colors} from '../utils/colors';
import RightFootSensation from './RightFootSensation';
import RightPulseCheck from './RightPulseCheck';

interface RightFootQuestionsProps {
  answers: Record<string, any>;
  handleAnswer: (id: string, value: any) => void;
  setCurrentStep: (step: 'initial' | 'rightFoot' | 'leftFoot') => void;
}

const RightFootQuestions: React.FC<RightFootQuestionsProps> = ({
  answers,
  handleAnswer,
  setCurrentStep,
}) => {
  const additionalQuestions = [
    {
      id: 'roughSkinBuildUp',
      question: 'Is there a rough skin buildup (fish eye) on one of the feet?',
    },
    {
      id: 'shoeFit',
      question: 'Does the shoe fit your foot size?',
    },
  ];
  return (
    <>
      <Text style={styles.sectionTitle}>Right Foot Questions</Text>

      <FootConditionGrid
        questions={rightFootQuestions}
        answers={answers}
        handleAnswer={handleAnswer}
      />
      <RightFootSensation answers={answers} handleAnswer={handleAnswer} />
      <RightPulseCheck answers={answers} handleAnswer={handleAnswer} />
      {/* Additional Yes/No Questions */}
      <View style={styles.additionalQuestionsContainer}>
        {additionalQuestions.map(q => (
          <View key={q.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{q.question}</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionWrapper}
                onPress={() => handleAnswer(q.id, true)}>
                <View
                  style={[
                    styles.radioButton,
                    answers[q.id] === true && styles.radioButtonSelected,
                  ]}>
                  {answers[q.id] === true && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.optionText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionWrapper}
                onPress={() => handleAnswer(q.id, false)}>
                <View
                  style={[
                    styles.radioButton,
                    answers[q.id] === false && styles.radioButtonSelected,
                  ]}>
                  {answers[q.id] === false && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.optionText}>no</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setCurrentStep('initial')}>
        <Text style={styles.nextButtonText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, {marginBottom: 40}]}
        onPress={() => setCurrentStep('leftFoot')}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
  additionalQuestionsContainer: {
    padding: 16,
    gap: 24,
  },
  questionContainer: {
    alignItems: 'center',
    gap: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1a365d',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  optionText: {
    fontSize: 14,
    color: '#4a5568',
  },
});

export default RightFootQuestions;
